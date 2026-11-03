def _levenshtein(a, b):
    """Classic edit distance — how many single-character inserts/deletes/
    substitutions turn `a` into `b`. Fine to run straight like this: these
    are single words/short phrases, never full sentences."""
    if a == b:
        return 0
    if not a:
        return len(b)
    if not b:
        return len(a)

    previous_row = list(range(len(b) + 1))
    for i, ca in enumerate(a, start=1):
        current_row = [i]
        for j, cb in enumerate(b, start=1):
            insert_cost = current_row[j - 1] + 1
            delete_cost = previous_row[j] + 1
            substitute_cost = previous_row[j - 1] + (ca != cb)
            current_row.append(min(insert_cost, delete_cost, substitute_cost))
        previous_row = current_row
    return previous_row[-1]


def is_close_enough(given, correct):
    """Grades typed answers (identification / fill-in-the-blank) with a
    small typo allowance instead of demanding an exact string match — one
    missed letter in "mitochondria" shouldn't cost the point. The allowance
    scales with the answer's length so it stays forgiving on long answers
    without accepting an actually-different short one."""
    given = (given or "").strip().lower()
    correct = (correct or "").strip().lower()
    if not given or not correct:
        return given == correct

    if given == correct:
        return True

    threshold = max(1, round(len(correct) * 0.2))
    return _levenshtein(given, correct) <= threshold
