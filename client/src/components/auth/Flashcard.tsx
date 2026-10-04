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
      className="card-scene w-full max-w-sm aspect-4/3 text-left cursor-pointer"
    >
      <div className={`card-flip relative w-full h-full ${flipped ? "is-flipped" : ""}`}>
        <div className="card-face absolute inset-0 bg-chalk text-bone rounded-sm border border-chalk/10 p-7 flex flex-col justify-between">
          <span className="text-sm text-bone/50">Question</span>
          <p className="font-serif text-xl md:text-2xl leading-snug">{question}</p>
          <span className="text-sm text-bone/40">Click to flip</span>
        </div>
        <div className="card-face card-face--back absolute inset-0 bg-gilt text-chalk rounded-sm p-7 flex flex-col justify-between">
          <span className="text-sm text-chalk/70">Answer</span>
          <p className="font-serif text-xl md:text-2xl leading-snug">{answer}</p>
          <span className="text-sm text-chalk/60">Click to flip back</span>
        </div>
      </div>
    </button>
  );
}