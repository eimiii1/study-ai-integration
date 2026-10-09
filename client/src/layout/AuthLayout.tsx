import type { ReactNode } from "react";
import Flashcard from "../components/auth/Flashcard";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: hero */}
      <div className="hidden flex-col justify-center gap-10 bg-ink px-12 py-16 text-paper lg:flex">
        <div className="max-w-sm">
          <h1 className="text-5xl font-semibold leading-[1.2] tracking-tight">
            Study your own notes, quizzed back to you by AI.
          </h1>
          <p className="mt-4 text-paper/60" style={{ maxWidth: "32ch" }}>
            Turn a deck of flashcards into a quiz in one click. Try the card below.
          </p>
        </div>
        <Flashcard
          question="What is a binary search tree?"
          answer="A tree where each node has at most two children, with left nodes smaller and right nodes larger."
        />
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center bg-paper px-8 py-16 md:px-14">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}