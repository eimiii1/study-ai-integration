import json
import traceback
from flask import Blueprint, jsonify, current_app, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from models import db, Deck, Quiz, Question
from utils.quiz_prompts import build_quiz_prompt
from utils.rewards import maybe_award_furniture
from utils.groq_helpers import create_completion, groq_error_message, is_retryable_generation_failure
from utils.text_match import is_close_enough

quizzes_bp = Blueprint('quizzes', __name__, url_prefix='/api/decks')


def _serialize_question(q):
    return {
        'id': q.id,
        'question_type': q.question_type,
        'question_text': q.question_text,
        'choices': q.choices,
        'correct_answer': q.correct_answer,
        'difficulty': q.difficulty,
        'explanation': q.explanation,
    }


def _serialize_quiz(quiz):
    return {
        'quiz_id': quiz.id,
        'questions': [_serialize_question(q) for q in quiz.questions],
    }


def _extract_json(text):
    if not text:
        raise ValueError("Empty response from the model.")
    return json.loads(text)


@quizzes_bp.route('/<int:deck_id>/study', methods=['GET'])
@jwt_required()
def study_deck(deck_id):
    user_id = get_jwt_identity()

    deck = Deck.query.filter_by(id=deck_id, user_id=user_id).first()
    if not deck:
        return jsonify({'error': 'Deck not found.'}), 404

    # ?regenerate=true drops the cached quiz and makes a fresh one below,
    # instead of only regenerating when a flashcard actually changes.
    regenerate = request.args.get('regenerate', '').lower() in ('1', 'true', 'yes')

    existing_quiz = Quiz.query.filter_by(deck_id=deck.id).first()
    if existing_quiz and regenerate:
        db.session.delete(existing_quiz)
        db.session.commit()
        existing_quiz = None

    if existing_quiz:
        return jsonify(_serialize_quiz(existing_quiz)), 200

    flashcards = deck.flashcards
    if not flashcards:
        return jsonify({'error': 'Add flashcards to this deck before studying.'}), 400

    prompt = build_quiz_prompt(flashcards)

    model = current_app.config['GROQ_MODEL']
    messages = [{'role': 'user', 'content': prompt}]

    try:
        try:
            completion = create_completion(model, messages, max_tokens=6000, json_mode=True)
        except Exception as e:
            # 'gpt-oss' reasoning models occasionally burn their whole output
            # budget on hidden reasoning and emit nothing — worth one
            # automatic retry before bothering the user with it.
            if not is_retryable_generation_failure(e):
                raise
            completion = create_completion(model, messages, max_tokens=6000, json_mode=True)
        raw_text = completion.choices[0].message.content
    except Exception as e:
        # Network error, bad/missing API key, invalid model name, rate limit, etc.
        # Printed so it shows up in the Flask console (debug=True) instead of
        # just a bare 500 in the browser with no clue what happened.
        traceback.print_exc()
        return jsonify({'error': groq_error_message(e)}), 500

    try:
        parsed = _extract_json(raw_text)
        questions_data = parsed.get('questions') if isinstance(parsed, dict) else parsed
        if not isinstance(questions_data, list) or not questions_data:
            raise ValueError("Expected a non-empty 'questions' array.")
    except (json.JSONDecodeError, ValueError, AttributeError):
        traceback.print_exc()
        return jsonify({'error': 'Failed to generate quiz. Please try again.'}), 500

    try:
        new_quiz = Quiz(title=f"{deck.title} Quiz", deck_id=deck.id)
        db.session.add(new_quiz)
        db.session.flush()  # assigns new_quiz.id without a second round trip

        for item in questions_data:
            if not isinstance(item, dict) or 'question_text' not in item or 'correct_answer' not in item:
                continue  # skip a malformed entry instead of blowing up the whole quiz

            new_question = Question(
                question_type=item.get('question_type', 'multiple_choice'),
                question_text=item['question_text'],
                correct_answer=[item['correct_answer']],
                choices=item.get('choices'),
                difficulty=item.get('difficulty'),
                explanation=item.get('explanation'),
                quiz_id=new_quiz.id
            )
            db.session.add(new_question)

        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({
            'error': "Couldn't save the quiz. If you just updated the server, make sure the "
                     "'difficulty' and 'explanation' columns exist on the question table."
        }), 500

    if not new_quiz.questions:
        db.session.delete(new_quiz)
        db.session.commit()
        return jsonify({'error': 'The AI response had no usable questions. Please try again.'}), 500

    return jsonify(_serialize_quiz(new_quiz)), 200


def _is_correct(question, given):
    if given is None:
        return False
    correct = question.correct_answer[0] if isinstance(question.correct_answer, list) else question.correct_answer
    if question.question_type == 'multiple_choice':
        return given == correct
    # Typed answers: forgive case, surrounding whitespace, and a small typo
    # (one missed/extra/swapped letter) instead of demanding an exact match.
    return is_close_enough(str(given), str(correct))


# Grading happens here, server-side, instead of trusting whatever the client
# claims — this is also what decides furniture drops, so a client-side-only
# "you got it right" would let anyone farm rewards for free.
@quizzes_bp.route('/<int:deck_id>/study/answer', methods=['POST'])
@jwt_required()
def answer_question(deck_id):
    user_id = get_jwt_identity()

    deck = Deck.query.filter_by(id=deck_id, user_id=user_id).first()
    if not deck:
        return jsonify({'error': 'Deck not found.'}), 404

    quiz = Quiz.query.filter_by(deck_id=deck.id).first()
    if not quiz:
        return jsonify({'error': 'No quiz for this deck yet.'}), 404

    data = request.get_json() or {}
    question_id = data.get('question_id')
    given_answer = data.get('answer')

    question = Question.query.filter_by(id=question_id, quiz_id=quiz.id).first()
    if not question:
        return jsonify({'error': 'Question not found.'}), 404

    correct = _is_correct(question, given_answer)

    awarded = None
    if correct:
        item = maybe_award_furniture(user_id)
        if item:
            awarded = {'id': item.id, 'name': item.name, 'kind': item.kind, 'rarity': item.rarity, 'image_url': item.image_url}

    correct_answer = question.correct_answer[0] if isinstance(question.correct_answer, list) else question.correct_answer

    return jsonify({
        'correct': correct,
        'correct_answer': correct_answer,
        'explanation': question.explanation,
        'awarded': awarded,
    }), 200