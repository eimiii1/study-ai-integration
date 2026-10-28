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
the flashcard's Back is a short, specific term or fact; use "multiple_choice" when the
Back is more conceptual or could plausibly be confused with related ideas.

Question type rules:
- "multiple_choice": "question_text" is a question based on the flashcard's Front.
  "correct_answer" is the flashcard's Back. "choices" has exactly 4 options total,
  including the correct one, in random order. The 3 incorrect choices MUST be
  plausible and from the same topic/category as the correct answer (not random or
  obviously wrong) — that's what makes the quiz actually test understanding.
- "identification": "question_text" asks the user to recall the answer directly
  (based on the Front). "correct_answer" is the flashcard's Back, kept short enough to
  type. "choices" is null.
- "fill_in_blank": "question_text" is a sentence built from the flashcard's Front
  and/or Back with the single key term or phrase replaced by "_____". "correct_answer"
  is exactly the missing term/phrase. "choices" is null.

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
