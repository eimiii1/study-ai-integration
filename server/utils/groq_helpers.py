from flask import current_app
from groq import Groq


def groq_error_message(e):
    """Groq's free tier enforces a tokens-PER-REQUEST/minute cap, so a single
    oversized request (a long PDF prompt) and genuine repeated-use rate
    limiting both surface as a 429 with 'rate_limit' in it — but they need
    different advice, so tell them apart by the wording Groq actually sends."""
    text = str(e).lower()

    if 'json_validate_failed' in text or 'failed_generation' in text:
        return (
            "The AI didn't manage to produce a valid response on that attempt — this "
            "happens occasionally with reasoning models. Please try again."
        )
    if 'too large' in text or 'reduce the length' in text or 'request_too_large' in text:
        return (
            "That request was too big for Groq's free-tier limit in one go. Try a "
            "shorter PDF (or fewer pages), or lower the number of questions."
        )
    if '429' in text or 'rate_limit' in text:
        return "Hit Groq's rate limit — wait a bit and try again."
    if '404' in text or 'model_not_found' in text:
        return (
            f"Groq model '{current_app.config['GROQ_MODEL']}' isn't available on this "
            "API key. Set GROQ_MODEL in .env to a model your key can access."
        )
    return 'Could not reach the AI service. Check the server console for details.'


def is_retryable_generation_failure(e):
    text = str(e).lower()
    return 'json_validate_failed' in text or 'failed_generation' in text


def create_completion(model, messages, max_tokens, json_mode=False):
    """Thin wrapper around the Groq call. 'gpt-oss' reasoning models on Groq
    spend part of their output budget on hidden reasoning before the actual
    answer — with no limit on that, they can burn through it entirely and
    emit nothing (an empty failed_generation / json_validate_failed error).
    reasoning_effort keeps that budget small so there's room left for the
    real answer. Shared by both the chatbot's own completions and the deck
    quiz generator, since both hit the same reasoning-model failure mode."""
    client = Groq(api_key=current_app.config['GROQ_API_KEY'])
    kwargs = {'model': model, 'messages': messages, 'max_tokens': max_tokens}
    if json_mode:
        kwargs['response_format'] = {'type': 'json_object'}
    if 'gpt-oss' in model.lower():
        kwargs['reasoning_effort'] = 'low'
    return client.chat.completions.create(**kwargs)
