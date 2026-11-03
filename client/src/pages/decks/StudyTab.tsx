import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation, useOutletContext } from "react-router";
import { CheckIcon, ClockIcon, XIcon } from "../../components/icons";
import { ErrorNotice } from "../../components/Status";
import { apiFetch } from "../../lib/api";
import { badgeClass, inputClass, primaryButton, secondaryButton } from "../../lib/ui";
import type {
  DeckOutletContext,
  FurnitureRarity,
  QuestionDifficulty,
  Quiz,
  QuizQuestion,
} from "../../types";

const QUESTION_SECONDS = 25;

// The backend sends question_type / question_text / choices — deliberately
// no correct_answer here (see types.ts and server/routes/quizzes.py): that
// only comes back from the grading request once the question's answered, so
// it's never sitting in this payload for anyone to read out of the network
// tab before they've actually answered.
function normalizeQuestion(raw: unknown): QuizQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const q = raw as Record<string, unknown>;

  const id = typeof q.id === "number" ? q.id : Number(q.id);

  const type = (
    q.question_type === "identification" || q.question_type === "fill_in_blank"
      ? q.question_type
      : "multiple_choice"
  ) as QuizQuestion["type"];

  const question = q.question_text ?? q.question ?? q.prompt ?? q.text;

  const rawOptions = q.choices ?? q.options ?? q.answers;
  const options = Array.isArray(rawOptions)
    ? rawOptions.filter((o): o is string => typeof o === "string")
    : null;

  const difficulty: QuestionDifficulty | undefined =
    q.difficulty === "easy" || q.difficulty === "medium" || q.difficulty === "hard"
      ? q.difficulty
      : undefined;

  if (!Number.isFinite(id) || typeof question !== "string") return null;
  if (type === "multiple_choice" && (!options || options.length === 0)) return null;

  return { id, type, question, options, difficulty };
}

type AwardedItem = { name: string; rarity: FurnitureRarity; image_url: string };
// What the grading request reveals once a question's been answered — the
// only place the correct answer exists on the client, and only after.
type Revealed = { answer: string; explanation?: string };

export function StudyTab() {
  const { deck } = useOutletContext<DeckOutletContext>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Deliberately started by a click, not on mount: the first request generates
  // the quiz with the AI, and we don't want that firing just from opening a tab.
  // The one exception is the dashboard's "Study now" button routing here —
  // that click already happened in spirit, so we honor it once via location.state.
  const location = useLocation();
  const autoStartedRef = useRef(false);

  // Shared by both the first-load ("Start quiz") and regenerate flows — the
  // only difference is which loading/error state pair reports back, since a
  // regenerate failure shouldn't blank out the quiz currently on screen.
  const fetchQuiz = async (
    regenerate: boolean,
    setBusy: (v: boolean) => void,
    setFailure: (v: string | null) => void,
  ) => {
    setBusy(true);
    setFailure(null);
    try {
      const path = regenerate ? `/api/decks/${deck.id}/study?regenerate=true` : `/api/decks/${deck.id}/study`;
      const data = await apiFetch(path);
      if (!Array.isArray(data?.questions)) {
        throw new Error("The quiz came back in an unexpected format.");
      }

      const questions = (data.questions as unknown[])
        .map(normalizeQuestion)
        .filter((q): q is QuizQuestion => q !== null);

      if (questions.length === 0) {
        throw new Error(
          "The quiz came back but none of its questions were in a format this page understands.",
        );
      }

      setQuiz({ questions });
    } catch (err: unknown) {
      setFailure(err instanceof Error ? err.message : "Failed to load the quiz.");
    } finally {
      setBusy(false);
    }
  };

  const startQuiz = () => fetchQuiz(false, setIsLoading, setError);

  useEffect(() => {
    const wantsAutoStart = Boolean(
      (location.state as { autoStart?: boolean } | null)?.autoStart,
    );
    if (wantsAutoStart && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const regenerateQuiz = () => fetchQuiz(true, setIsRegenerating, setRegenerateError);

  if (quiz) {
    return (
      <QuizRunner
        key={deck.id}
        quiz={quiz}
        deckId={deck.id}
        onExit={() => setQuiz(null)}
        onRegenerate={regenerateQuiz}
        isRegenerating={isRegenerating}
        regenerateError={regenerateError}
      />
    );
  }

  return (
    <section className="max-w-120 rounded-[10px] border border-line bg-panel p-4">
      <h2 className="m-0 mb-1 text-[13px] font-medium text-ink">Quiz yourself</h2>
      <p className="m-0 mb-4 text-[12px] leading-relaxed text-ink-muted">
        A mixed quiz — multiple choice, identification, and fill-in-the-blank — is
        generated from this deck's flashcards the first time, then saved so it loads
        instantly after that. Adding, editing, or deleting a flashcard regenerates it
        fresh next time. Correct answers have a chance to drop furniture for your room.
        Make sure the deck has some flashcards first.
      </p>
      {error && (
        <div className="mb-3">
          <ErrorNotice message={error} />
        </div>
      )}
      <button className={primaryButton} onClick={startQuiz} disabled={isLoading}>
        {isLoading ? "Generating quiz..." : error ? "Try again" : "Start quiz"}
      </button>
    </section>
  );
}

type HistoryEntry = {
  question: QuizQuestion;
  userAnswer: string | null;
  isCorrect: boolean;
  timedOut: boolean;
  // Carried alongside the question itself since, unlike question.*, this
  // only exists after the server graded it.
  correctAnswer: string;
  explanation?: string;
};

// `!` to win the cascade over badgeClass's own border/text color, same
// convention as the hover overrides elsewhere in this codebase.
const difficultyStyle: Record<QuestionDifficulty, string> = {
  easy: "!border-green/40 !text-green",
  medium: "!border-orange/40 !text-orange",
  hard: "!border-danger/40 !text-danger",
};

const rarityStyle: Record<FurnitureRarity, string> = {
  common: "!border-line-strong !text-ink-muted",
  rare: "!border-blue/40 !text-blue",
  epic: "!border-violet/40 !text-violet",
};

function DifficultyBadge({ difficulty }: { difficulty?: QuestionDifficulty }) {
  if (!difficulty) return null;
  return (
    <span className={badgeClass + " " + difficultyStyle[difficulty]}>
      {difficulty}
    </span>
  );
}

function QuizRunner({
  quiz,
  deckId,
  onExit,
  onRegenerate,
  isRegenerating,
  regenerateError,
}: {
  quiz: Quiz;
  deckId: number;
  onExit: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
  regenerateError: string | null;
}) {
  const { questions } = quiz;

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"answering" | "revealed">("answering");
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [typedValue, setTypedValue] = useState("");
  const [timedOut, setTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [awardedItem, setAwardedItem] = useState<AwardedItem | null>(null);
  // The actual verdict the grading request returned, so the feedback shown
  // after answering always matches what was graded/scored — never a second,
  // separately-recomputed check that could disagree with it.
  const [lastCorrect, setLastCorrect] = useState(false);
  // The correct answer only exists on the client after the server reveals
  // it here — there's no local copy to fall back on anymore (see reveal()).
  const [revealed, setRevealed] = useState<Revealed | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [lastAttempt, setLastAttempt] = useState<{ given: string | null; isTimeout: boolean } | null>(null);

  const question = questions[index];
  const isDone = index >= questions.length;

  // Fresh timer + blank state every time the question changes.
  useEffect(() => {
    if (isDone) return;
    setPhase("answering");
    setUserAnswer(null);
    setTypedValue("");
    setTimedOut(false);
    setTimeLeft(QUESTION_SECONDS);
    setAwardedItem(null);
    setRevealed(null);
    setGradeError(null);
    setLastAttempt(null);

    const tick = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isDone]);

  // Time's up and still answering: reveal as a miss, same as any other answer.
  useEffect(() => {
    if (!isDone && timeLeft === 0 && phase === "answering") {
      reveal(null, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, isDone]);

  if (questions.length === 0) {
    return (
      <section className="max-w-120">
        <p className="mb-3 mt-0 text-[12px] text-ink-muted">This quiz has no questions.</p>
        <button className={primaryButton} onClick={onExit}>
          Back
        </button>
      </section>
    );
  }

  // Grading happens entirely on the server — it's also what decides
  // furniture drops, and it's now the *only* place the correct answer
  // exists at all (the quiz load never sends it, see types.ts). So there's
  // no local check to fall back on anymore: if the request itself fails,
  // this reports that and lets the player retry instead of silently
  // guessing right or wrong.
  async function reveal(given: string | null, isTimeout: boolean) {
    setIsGrading(true);
    setGradeError(null);
    setLastAttempt({ given, isTimeout });

    try {
      const result = await apiFetch(`/api/decks/${deckId}/study/answer`, {
        method: "POST",
        body: JSON.stringify({ question_id: question.id, answer: given }),
      });
      const correct = Boolean(result?.correct);
      const correctAnswer = typeof result?.correct_answer === "string" ? result.correct_answer : "";
      const explanation = typeof result?.explanation === "string" ? result.explanation : undefined;
      const awarded: AwardedItem | null = result?.awarded ?? null;

      setUserAnswer(given);
      setTimedOut(isTimeout);
      setRevealed({ answer: correctAnswer, explanation });
      setPhase("revealed");
      setLastCorrect(correct);
      if (correct) setScore((s) => s + 1);
      if (awarded) setAwardedItem(awarded);
      setHistory((h) => [
        ...h,
        { question, userAnswer: given, isCorrect: correct, timedOut: isTimeout, correctAnswer, explanation },
      ]);
    } catch {
      setGradeError("Couldn't grade that — check your connection and try again.");
    } finally {
      setIsGrading(false);
    }
  }

  const retryGrading = () => {
    if (lastAttempt) reveal(lastAttempt.given, lastAttempt.isTimeout);
  };

  const choose = (option: string) => {
    if (phase !== "answering" || isGrading) return;
    reveal(option, false);
  };

  const submitTyped = (e: FormEvent) => {
    e.preventDefault();
    if (phase !== "answering" || isGrading || !typedValue.trim()) return;
    reveal(typedValue, false);
  };

  const next = () => setIndex((i) => i + 1);

  if (isDone) {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    const grade =
      pct >= 90 ? "Excellent." : pct >= 70 ? "Solid work." : pct >= 50 ? "Getting there." : "Keep practicing.";

    if (showReview) {
      return (
        <section className="max-w-150 animate-fade-in-up">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="m-0 text-[13px] font-medium text-ink">Review</h2>
            <button className={secondaryButton} onClick={() => setShowReview(false)}>
              Back to results
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {history.map((entry, i) => (
              <article
                key={i}
                className={
                  "rounded-[10px] border p-3.25 " +
                  (entry.isCorrect ? "border-green/30 bg-green/5" : "border-danger/30 bg-danger/5")
                }
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <p className="m-0 text-[12.5px] font-medium text-ink">{entry.question.question}</p>
                  {entry.isCorrect ? (
                    <CheckIcon size={15} className="flex-shrink-0 text-green" />
                  ) : (
                    <XIcon size={15} className="flex-shrink-0 text-danger" />
                  )}
                </div>
                {!entry.isCorrect && (
                  <p className="m-0 mb-1 text-[12px] text-ink-muted">
                    Your answer: {entry.timedOut ? "(ran out of time)" : entry.userAnswer || "—"}
                  </p>
                )}
                <p className="m-0 mb-1 text-[12px] text-ink-dim">
                  Correct answer: <span className="font-medium text-ink">{entry.correctAnswer}</span>
                </p>
                {entry.explanation && (
                  <p className="m-0 text-[11.5px] leading-relaxed text-ink-faint">
                    {entry.explanation}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="max-w-120 animate-fade-in-up rounded-[10px] border border-line bg-panel p-4">
        <h2 className="m-0 mb-1 text-[13px] font-medium text-ink">Quiz complete</h2>
        <p className="m-0 mb-1 text-[22px] font-medium text-ink">
          {score} <span className="text-ink-faint">/ {total}</span>
        </p>
        <p className="m-0 mb-4 text-[12.5px] text-ink-muted">
          {pct}% — {grade}
        </p>
        {regenerateError && (
          <div className="mb-3">
            <ErrorNotice message={regenerateError} />
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <button
            className={primaryButton}
            onClick={() => {
              setIndex(0);
              setScore(0);
              setHistory([]);
            }}
          >
            Retake
          </button>
          <button className={secondaryButton} onClick={() => setShowReview(true)}>
            Review answers
          </button>
          <button className={secondaryButton} onClick={onRegenerate} disabled={isRegenerating}>
            {isRegenerating ? "Regenerating..." : "Regenerate quiz"}
          </button>
          <button
            className="rounded-[6px] px-2.5 py-1.5 text-[12px] text-ink-dim hover:bg-elevated hover:text-ink"
            onClick={onExit}
          >
            Done
          </button>
        </div>
      </section>
    );
  }

  const hasAnswered = phase === "revealed";

  const optionClass = (option: string) => {
    const base =
      "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-[12.5px] transition-colors ";
    if (!hasAnswered) {
      return base + "border-line bg-panel text-ink-dim hover:bg-panel-hover hover:text-ink";
    }
    if (option === revealed?.answer) return base + "border-green bg-green/10 text-green";
    if (option === userAnswer) return base + "border-danger bg-danger/10 text-danger";
    return base + "border-hairline bg-panel text-ink-faint";
  };

  const timerLow = timeLeft <= 10;

  return (
    <section key={index} className="max-w-120 animate-fade-in-up">
      <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full bg-violet transition-[width] duration-300"
          style={{ width: `${((index + (hasAnswered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="mb-2 flex items-center justify-between">
        <p className="m-0 text-[11.5px] text-ink-faint">
          Question {index + 1} of {questions.length}
        </p>
        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={question.difficulty} />
          <span
            className={
              "flex items-center gap-1 text-[11.5px] " +
              (hasAnswered ? "text-ink-faint" : timerLow ? "text-danger" : "text-ink-muted")
            }
          >
            <ClockIcon size={12} />
            {hasAnswered ? "—" : `${timeLeft}s`}
          </span>
        </div>
      </div>

      <h2 className="m-0 mb-4 text-[15px] font-medium leading-snug text-ink">{question.question}</h2>

      {gradeError && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-[12.5px] text-danger">
          <span>{gradeError}</span>
          <button
            type="button"
            onClick={retryGrading}
            disabled={isGrading}
            className="flex-shrink-0 font-medium underline decoration-danger/40 underline-offset-2 hover:decoration-danger"
          >
            {isGrading ? "Retrying..." : "Try again"}
          </button>
        </div>
      )}

      {question.type === "multiple_choice" && question.options ? (
        <div className="mb-4 flex flex-col gap-2">
          {question.options.map((option) => (
            <button
              key={option}
              className={optionClass(option)}
              onClick={() => choose(option)}
              disabled={hasAnswered || isGrading}
            >
              <span>{option}</span>
              {hasAnswered && option === revealed?.answer && (
                <CheckIcon size={14} className="flex-shrink-0" />
              )}
              {hasAnswered && option === userAnswer && option !== revealed?.answer && (
                <XIcon size={14} className="flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={submitTyped} className="mb-4 flex flex-col gap-2.5">
          <input
            className={inputClass}
            placeholder={
              question.type === "fill_in_blank" ? "Fill in the blank..." : "Type your answer..."
            }
            value={typedValue}
            onChange={(e) => setTypedValue(e.target.value)}
            disabled={hasAnswered || isGrading}
            autoFocus
          />
          {!hasAnswered && (
            <button className={primaryButton} type="submit" disabled={isGrading || !typedValue.trim()}>
              {isGrading ? "Grading..." : "Submit answer"}
            </button>
          )}
          {hasAnswered && (
            <div
              className={
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[12.5px] " +
                (lastCorrect ? "border-green bg-green/10 text-green" : "border-danger bg-danger/10 text-danger")
              }
            >
              {lastCorrect ? <CheckIcon size={14} /> : <XIcon size={14} />}
              <span>
                {lastCorrect
                  ? "Correct"
                  : `${timedOut ? "Time's up — " : ""}Correct answer: ${revealed?.answer}`}
              </span>
            </div>
          )}
        </form>
      )}

      {hasAnswered && revealed?.explanation && (
        <p className="m-0 mb-4 text-[12px] leading-relaxed text-ink-faint">{revealed.explanation}</p>
      )}

      {hasAnswered && awardedItem && (
        <div className="mb-4 flex animate-fade-in-up items-center gap-2.5 rounded-lg border border-violet/30 bg-violet/10 px-3 py-2.5">
          <img src={awardedItem.image_url} alt={awardedItem.name} className="h-9 w-9 object-contain" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[12px] font-medium text-ink">Got {awardedItem.name}!</span>
            <span className={badgeClass + " mt-0.5 w-fit " + rarityStyle[awardedItem.rarity]}>
              {awardedItem.rarity}
            </span>
          </div>
        </div>
      )}

      {hasAnswered && (
        <button className={primaryButton} onClick={next}>
          {index + 1 === questions.length ? "See results" : "Next question"}
        </button>
      )}
    </section>
  );
}
