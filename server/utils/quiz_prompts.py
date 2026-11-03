def build_quiz_prompt(flashcards):
    flashcard_text = "\n".join([
        f"- Front: {card.front} | Back: {card.back}"
        for card in flashcards
    ])

    prompt = f"""
You are generating a varied, genuinely challenging study quiz from a set of flashcards.

Flashcards:
{flashcard_text}

Create exactly one question per flashcard, in the same order as the flashcards above.
Mix question types across the set so it isn't repetitive: use "multiple_choice",
"identification", and "fill_in_blank". Prefer "identification" or "fill_in_blank" when
the flashcard's Front is a short, specific term or name; use "multiple_choice" when the
Back is more conceptual or could plausibly be confused with related ideas.

IMPORTANT — a typed answer is never a full sentence or definition. For "identification"
and "fill_in_blank", "correct_answer" must always be a short term or phrase (a few words
at most) that a student could type in a few seconds, exactly like a real teacher's
identification quiz: the student writes the term being defined, never the definition
itself.

Question type rules:
- "multiple_choice": "question_text" is a question based on the flashcard's Front.
  "correct_answer" is the flashcard's Back. "choices" has exactly 4 options total,
  including the correct one, in random order. The 3 incorrect choices MUST be
  plausible and from the same topic/category as the correct answer (not random or
  obviously wrong) — that's what makes the quiz actually test understanding.
- "identification": "question_text" gives the flashcard's Back (the definition/
  explanation/description) as a clue and asks the user to name the term it describes.
  "correct_answer" is the flashcard's Front — the term itself, not a restatement of the
  definition. If the Front itself is long, shorten "correct_answer" to just its core
  name/term. "choices" is null.
- "fill_in_blank": "question_text" is a sentence built from the flashcard's Front
  and/or Back with the single key term or phrase replaced by "_____". "correct_answer"
  is exactly the missing term/phrase — never the full sentence. "choices" is null.

Also set, for every question:
- "difficulty": "easy", "medium", or "hard" — judge this from how specific or obscure
  the flashcard's content is, not the question type.
- "explanation": one short sentence giving the reasoning for the correct answer,
  written so it's still useful to someone who answered wrong.

Return ONLY a valid JSON object, with no extra text, in this exact format:
{{
    "questions": [
        {{
            "question_type": "multiple_choice" | "identification" | "fill_in_blank",
            "question_text": "...",
            "correct_answer": "...",
            "choices": ["...", "...", "...", "..."] (or null for identification/fill_in_blank),
            "difficulty": "easy" | "medium" | "hard",
            "explanation": "..."
        }}
    ]
}}
"""
    return prompt


def build_flashcards_prompt_from_text(text, truncated=False):
    """Extracts a document's own DEFINITIONS as flashcards (front = term,
    back = definition) — not generic facts about its topic. Used by the
    chatbot's 'turn this PDF into a deck' flow: it only has to do the
    extraction, because once these flashcards are saved to a deck, that
    deck's own /study endpoint (build_quiz_prompt, above) already turns
    them into a mixed quiz with real grading and furniture rewards —
    exactly like a deck the user built by hand."""

    truncation_note = (
        "\n\n(Note: this is only the first portion of a longer document — only use "
        "definitions that actually appear in what's shown here.)"
        if truncated
        else ""
    )

    prompt = f"""
You are extracting flashcards from the text of a document a student uploaded (for
example lecture notes, a textbook chapter, or an article). This is NOT a summary of
the document's general content — every flashcard must come from something the
document itself explicitly defines or explains.

Document text:
{text}{truncation_note}

Find every distinct term, concept, or piece of vocabulary this document explicitly
defines or explains: a "X is ...", "X refers to ...", a glossary-style entry, a
labeled heading followed by its explanation, or any other clear term-plus-meaning
pair. Ignore standalone facts, dates, examples, or opinions that aren't attached to
a defined term — those don't belong here.

Write one flashcard per definition you found — however many that actually is
(don't pad it out, and don't skip any to hit a round number), up to a maximum of
40. For each:
- "front": the term or concept, exactly as it's named in the document.
- "back": its definition/explanation, in the document's own words where possible
  (a light paraphrase for clarity is fine, but never change its meaning).

Also write a short "title" (3-6 words) summarizing what the document is about, to
use as the name of the deck these flashcards go into.

Return ONLY a valid JSON object, with no extra text, in this exact format:
{{
    "title": "...",
    "flashcards": [
        {{ "front": "...", "back": "..." }}
    ]
}}
"""
    return prompt
