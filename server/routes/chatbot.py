import json
import traceback
from flask import Blueprint, jsonify, current_app, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from pypdf import PdfReader
from pypdf.errors import PdfReadError
from models import db, Deck, Flashcard
from utils.quiz_prompts import build_flashcards_prompt_from_text
from utils.groq_helpers import create_completion, groq_error_message, is_retryable_generation_failure

chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/chatbot')

# Keep the prompt a reasonable size regardless of how long the PDF is — past
# this point we just pull flashcards from the first chunk of the document.
# This also matters for Groq's free-tier tokens-PER-MINUTE cap: that's a
# per-request limit too, so one big document text dump can trip "rate
# limited" on its very first request, even though a short chat message
# never comes close.
MAX_CHARS_FOR_PROMPT = 6000
MIN_EXTRACTED_CHARS = 50
MAX_FLASHCARDS = 40

CHAT_SYSTEM_PROMPT = (
    "You are the study assistant built into BuildScape, a flashcard and quiz app for "
    "students. Chat naturally and helpfully: explain concepts, help with studying, "
    "answer general questions, and have ordinary conversation. "
    "One feature of this chat is specific to the app: if the user attaches a PDF "
    "(lecture notes, a chapter, an article) using the PDF button in the composer, "
    "the app automatically reads it, pulls out every term/concept it explicitly "
    "defines, and saves those as flashcards in a new deck — which can then be "
    "quizzed on like any other deck, with real grading and furniture rewards. You "
    "don't do that extraction yourself in the conversation, it happens separately "
    "when they upload. If it seems relevant, you can mention that they can attach a "
    "PDF to get a deck out of it, but don't bring it up if it isn't relevant to what "
    "they're asking. Keep replies conversational and reasonably concise."
)
MAX_HISTORY_MESSAGES = 20
MAX_MESSAGE_CHARS = 4000


def _extract_pdf_text(file_stream):
    reader = PdfReader(file_stream)

    if reader.is_encrypted:
        try:
            reader.decrypt('')
        except Exception:
            raise ValueError('This PDF is password-protected and cannot be read.')

    pages_text = []
    for page in reader.pages:
        try:
            pages_text.append(page.extract_text() or '')
        except Exception:
            continue  # skip a page pypdf can't parse instead of failing the whole file

    return '\n'.join(pages_text).strip()


# Turns a PDF into a real deck: a new Deck row owned by the uploader, with
# one Flashcard per definition the model found. From here on it's an
# ordinary deck — /api/decks/<id>/study (routes/quizzes.py) generates the
# actual quiz from these flashcards and already has real grading and
# furniture rewards, so this endpoint only has to do the extraction.
@chatbot_bp.route('/deck-from-pdf', methods=['POST'])
@jwt_required()
def deck_from_pdf():
    user_id = get_jwt_identity()

    upload = request.files.get('pdf')
    if not upload or not upload.filename:
        return jsonify({'error': 'Attach a PDF file.'}), 400

    if not upload.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are supported.'}), 400

    try:
        text = _extract_pdf_text(upload.stream)
    except PdfReadError:
        return jsonify({'error': "Couldn't read that file — make sure it's a valid PDF."}), 400
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception:
        traceback.print_exc()
        return jsonify({'error': "Couldn't read that file — make sure it's a valid PDF."}), 400

    if len(text) < MIN_EXTRACTED_CHARS:
        return jsonify({
            'error': "Couldn't find readable text in that PDF. It may be scanned pages or "
                     "images rather than real text, which this can't read yet."
        }), 400

    truncated = len(text) > MAX_CHARS_FOR_PROMPT
    prompt = build_flashcards_prompt_from_text(text[:MAX_CHARS_FOR_PROMPT], truncated=truncated)

    model = current_app.config['GROQ_MODEL']
    messages = [{'role': 'user', 'content': prompt}]

    try:
        try:
            completion = create_completion(model, messages, max_tokens=4000, json_mode=True)
        except Exception as e:
            # Reasoning models occasionally burn their whole output budget on
            # hidden reasoning and emit nothing — worth one automatic retry
            # before bothering the user with it.
            if not is_retryable_generation_failure(e):
                raise
            completion = create_completion(model, messages, max_tokens=4000, json_mode=True)
        raw_text = completion.choices[0].message.content
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': groq_error_message(e)}), 500

    try:
        parsed = json.loads(raw_text) if raw_text else None
        cards_data = parsed.get('flashcards') if isinstance(parsed, dict) else None
        if not isinstance(cards_data, list) or not cards_data:
            raise ValueError("Expected a non-empty 'flashcards' array.")
    except (json.JSONDecodeError, ValueError, AttributeError):
        traceback.print_exc()
        return jsonify({'error': 'Failed to pull flashcards out of this PDF. Please try again.'}), 500

    cards = []
    for item in cards_data[:MAX_FLASHCARDS]:
        if not isinstance(item, dict):
            continue  # skip a malformed entry instead of failing the whole deck
        front = item.get('front')
        back = item.get('back')
        if not isinstance(front, str) or not front.strip() or not isinstance(back, str) or not back.strip():
            continue
        cards.append((front.strip(), back.strip()))

    if not cards:
        return jsonify({
            'error': "Couldn't find any clear definitions in this PDF. Try a document that "
                     "defines its own terms (lecture notes, a glossary, a textbook chapter)."
        }), 500

    title = parsed.get('title') if isinstance(parsed.get('title'), str) and parsed.get('title') else None
    if not title:
        title = upload.filename.rsplit('.', 1)[0]

    try:
        new_deck = Deck(
            title=title,
            description=f"Generated from {upload.filename} by the chatbot.",
            user_id=user_id,
        )
        db.session.add(new_deck)
        db.session.flush()  # assigns new_deck.id without a second round trip

        for front, back in cards:
            db.session.add(Flashcard(front=front, back=back, deck_id=new_deck.id))

        db.session.commit()
    except Exception:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({'error': "Couldn't save the new deck. Please try again."}), 500

    return jsonify({'id': new_deck.id, 'title': new_deck.title, 'card_count': len(cards)}), 201


# A real back-and-forth with the model — the client sends the whole
# conversation so far (it's not stored server-side, same ephemeral spirit as
# the PDF quiz above) and gets the next reply back.
@chatbot_bp.route('/message', methods=['POST'])
@jwt_required()
def chat_message():
    data = request.get_json(silent=True) or {}
    raw_messages = data.get('messages')
    if not isinstance(raw_messages, list) or not raw_messages:
        return jsonify({'error': 'A message is required.'}), 400

    history = []
    for item in raw_messages[-MAX_HISTORY_MESSAGES:]:
        if not isinstance(item, dict):
            continue
        role = item.get('role')
        content = item.get('content')
        if role not in ('user', 'assistant') or not isinstance(content, str) or not content.strip():
            continue
        history.append({'role': role, 'content': content.strip()[:MAX_MESSAGE_CHARS]})

    if not history or history[-1]['role'] != 'user':
        return jsonify({'error': 'A message is required.'}), 400

    try:
        completion = create_completion(
            current_app.config['GROQ_MODEL'],
            [{'role': 'system', 'content': CHAT_SYSTEM_PROMPT}, *history],
            max_tokens=1024,
        )
        reply = completion.choices[0].message.content
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': groq_error_message(e)}), 500

    if not reply or not reply.strip():
        return jsonify({'error': 'The AI gave an empty reply. Please try again.'}), 500

    return jsonify({'reply': reply.strip()}), 200
