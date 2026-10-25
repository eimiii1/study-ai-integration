import { useEffect, useRef, useState } from "react";
import { useLocation, useOutletContext } from "react-router";
import { CheckIcon, XIcon } from "../../components/icons";
import { ErrorNotice } from "../../components/Status";
import { apiFetch } from "../../lib/api";
import { primaryButton } from "../../lib/ui";
import type { DeckOutletContext, Quiz, QuizQuestion } from "../../types";

// The backend sends question_text / choices / correct_answer (and
// correct_answer is itself a one-item array), so normalize that into the
// { question, options, answer } shape the rest of this file uses.
function normalizeQuestion(raw: unknown): QuizQuestion | null {
  if (!raw || typeof raw !== "object") return null;
  const q = raw as Record<string, unknown>;

  const question = q.question_text ?? q.question ?? q.prompt ?? q.text;
  const options = q.choices ?? q.options ?? q.answers;
  const rawAnswer = q.answer ?? q.correct_answer ?? q.correctAnswer;
  const answer = Array.isArray(rawAnswer) ? rawAnswer[0] : rawAnswer;

  if (
    typeof question !== "string" ||
    !Array.isArray(options) ||
    options.length === 0 ||
    !options.every((o) => typeof o === "string") ||
    typeof answer !== "string"
  ) {
    return null;
  }

  return { question, options, answer };
}

export function StudyTab() {
  const { deck } = useOutletContext<DeckOutletContext>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Deliberately started by a click, not on mount: the first request generates
  // the quiz with the AI, and we don't want that firing just from opening a tab.
  // The one exception is Hero routing you here with "quiz me on X" — that
  // click already happened in spirit, so we honor it once via location.state.
  const location = useLocation();
  const autoStartedRef = useRef(false);

  const startQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/decks/${deck.id}/study`);
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
      setError(err instanceof Error ? err.message : "Failed to load the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

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

  if (quiz) {
    return <QuizRunner key={deck.id} quiz={quiz} onExit={() => setQuiz(null)} />;
  }

  return (
    <section className="max-w-120 rounded-[10px] border border-line bg-panel p-4">
      <h2 className="m-0 mb-1 text-[13px] font-medium text-ink">Quiz yourself</h2>
      <p className="m-0 mb-4 text-[12px] leading-relaxed text-ink-muted">
        A multiple-choice quiz is generated from this deck's flashcards the first time, then
        saved so it loads instantly after that. Make sure the deck has some flashcards first.
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

function QuizRunner({ quiz, onExit }: { quiz: Quiz; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const { questions } = quiz;

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

  if (index >= questions.length) {
    return (
      <section className="max-w-120 rounded-[10px] border border-line bg-panel p-4">
        <h2 className="m-0 mb-1 text-[13px] font-medium text-ink">Quiz complete</h2>
        <p className="m-0 mb-4 text-[22px] font-medium text-ink">
          {score} <span className="text-ink-faint">/ {questions.length}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <button
            className={primaryButton}
            onClick={() => {
              setIndex(0);
              setSelected(null);
              setScore(0);
            }}
          >
            Retake
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

  const question = questions[index];
  const hasAnswered = selected !== null;

  const choose = (option: string) => {
    if (hasAnswered) return;
    setSelected(option);
    if (option === question.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const optionClass = (option: string) => {
    const base =
      "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-[12.5px] transition-colors ";
    if (!hasAnswered) {
      return base + "border-line bg-panel text-ink-dim hover:bg-panel-hover hover:text-ink";
    }
    if (option === question.answer) return base + "border-green bg-green/10 text-green";
    if (option === selected) return base + "border-danger bg-danger/10 text-danger";
    return base + "border-hairline bg-panel text-ink-faint";
  };

  return (
    <section className="max-w-120">
      <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full bg-violet transition-[width] duration-300"
          style={{ width: `${((index + (hasAnswered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>
      <p className="m-0 mb-2 text-[11.5px] text-ink-faint">
        Question {index + 1} of {questions.length}
      </p>
      <h2 className="m-0 mb-4 text-[15px] font-medium leading-snug text-ink">
        {question.question}
      </h2>

      <div className="mb-4 flex flex-col gap-2">
        {question.options.map((option) => (
          <button
            key={option}
            className={optionClass(option)}
            onClick={() => choose(option)}
            disabled={hasAnswered}
          >
            <span>{option}</span>
            {hasAnswered && option === question.answer && (
              <CheckIcon size={14} className="flex-shrink-0" />
            )}
            {hasAnswered && option === selected && option !== question.answer && (
              <XIcon size={14} className="flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      {hasAnswered && (
        <button className={primaryButton} onClick={next}>
          {index + 1 === questions.length ? "See results" : "Next question"}
        </button>
      )}
    </section>
  );
}