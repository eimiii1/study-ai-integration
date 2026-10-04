import type { ReactNode } from "react";
import Flashcard from "../components/auth/Flashcard";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-sans text-bone bg-obsidian">
      {/* Left: hero */}
      <div className="bg-inkwell text-chalk flex flex-col justify-center px-8 md:px-16 py-16 gap-10">
        <div className="max-w-md">
          <h1 className="font-serif text-3xl md:text-[2.75rem] leading-[1.15] mb-4">
            Study your own notes, quizzed back to you by AI.
          </h1>
          <p className="text-chalk/70 leading-relaxed" style={{ maxWidth: "34ch" }}>
            Turn a deck of flashcards into a quiz in one click. Try the card below.
          </p>
        </div>
        <Flashcard
          question="What is a binary search tree?"
          answer="A tree where each node has at most two children, with left nodes smaller and right nodes larger."
        />
      </div>

      {/* Right: form */}
      <div className="bg-obsidian flex items-center justify-center px-8 md:px-16 py-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}