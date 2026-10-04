import type { ReactNode } from "react";
import NavBar from "../components/NavBar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-obsidian text-bone font-sans">
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
    </div>
  );
}