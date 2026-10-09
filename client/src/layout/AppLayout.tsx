import type { ReactNode } from "react";
import NavBar from "../components/NavBar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen gap-4 bg-canvas p-4 text-ink">
      <NavBar />
      <main className="flex-1 overflow-y-auto rounded-2xl border border-line bg-paper shadow-[0_1px_2px_rgba(10,10,10,0.03),0_12px_32px_-12px_rgba(10,10,10,0.08)]">
        <div className="mx-auto max-w-4xl px-10 py-12">{children}</div>
      </main>
    </div>
  );
}