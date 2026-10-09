import type { ReactNode } from "react";
import NavBar from "../components/NavBar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen gap-4 bg-canvas p-4">
      <NavBar />
      <main className="flex-1 overflow-y-auto rounded-2xl bg-obsidian px-10 py-10 shadow-[0_1px_2px_rgba(23,34,32,0.04),0_8px_24px_-8px_rgba(23,34,32,0.08)]">
        {children}
      </main>
    </div>
  );
}