import { useState } from "react";

type FlashcardProps = {
  question: string;
  answer: string;
};

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-label="Flip the flashcard"
      className="card-scene w-full max-w-sm aspect-[4/3] text-left cursor-pointer"
    >
      <div className={`card-flip relative h-full w-full ${flipped ? "is-flipped" : ""}`}>
        <div className="card-face absolute inset-0 flex flex-col justify-between rounded-xl border border-line bg-paper p-6 text-ink">
          <span className="text-sm text-muted">Question</span>
          <p className="text-lg leading-snug">{question}</p>
          <span className="text-sm text-muted">Click to flip</span>
        </div>
        <div className="card-face card-face--back absolute inset-0 flex flex-col justify-between rounded-xl border border-paper/15 bg-paper/10 p-6 text-paper">
          <span className="text-sm text-paper/60">Answer</span>
          <p className="text-lg leading-snug">{answer}</p>
          <span className="text-sm text-paper/50">Click to flip back</span>
        </div>
      </div>
    </button>
  );
}