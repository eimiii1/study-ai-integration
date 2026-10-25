import json
from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Deck, Quiz, Question
from utils.quiz_prompts import build_quiz_prompt
from google import genai

quizzes_bp = Blueprint('quizzes', __name__, url_prefix='/api/decks')


@quizzes_bp.route('/<int:deck_id>/study', methods=['GET'])
@jwt_required()
def study_deck(deck_id):
    user_id = get_jwt_identity()

    deck = Deck.query.filter_by(id=deck_id, user_id=user_id).first()
    if not deck:
        return jsonify({'error': 'Deck not found.'}), 404

    existing_quiz = Quiz.query.filter_by(deck_id=deck.id).first()
    if existing_quiz:
        return jsonify({
            'quiz_id': existing_quiz.id,
            'questions': [
                {'id': q.id, 'question_text': q.question_text, 'choices': q.choices, 'correct_answer': q.correct_answer}
                for q in existing_quiz.questions
            ]
        }), 200

    flashcards = deck.flashcards
    if not flashcards:
        return jsonify({'error': 'Add flashcards to this deck before studying.'}), 400

    prompt = build_quiz_prompt(flashcards)

    client = genai.Client(api_key=current_app.config['GEMINI_API_KEY'])
    chat = client.chats.create(model='gemini-3.8-flash')
    response = chat.send_message(prompt)

    try:
        questions_data = json.loads(response.text)
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to generate quiz. Please try again.'}), 500

    new_quiz = Quiz(title=f"{deck.title} Quiz", deck_id=deck.id)
    db.session.add(new_quiz)
    db.session.commit()

    for item in questions_data:
        new_question = Question(
            question_type='multiple_choice',
            question_text=item['question_text'],
            correct_answer=[item['correct_answer']],
            choices=item['choices'],
            quiz_id=new_quiz.id
        )
        db.session.add(new_question)

    db.session.commit()

    return jsonify({
        'quiz_id': new_quiz.id,
        'questions': [
            {'id': q.id, 'question_text': q.question_text, 'choices': q.choices, 'correct_answer': q.correct_answer}
            for q in new_quiz.questions
        ]
    }), 200