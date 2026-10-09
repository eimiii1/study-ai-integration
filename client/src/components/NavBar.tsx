import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

type NavItem = { label: string; to: string; icon: ReactNode };

const icons = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h4v-6h3v6h4a1 1 0 0 0 1-1V9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  decks: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="4" width="13" height="9" rx="1.2" />
      <rect x="7" y="11" width="13" height="9" rx="1.2" />
    </svg>
  ),
  notes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 3h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
      <path d="M8 9h6M8 13h8M8 17h5" strokeLinecap="round" />
    </svg>
  ),
  quizzes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.3a2.5 2.5 0 1 1 3.6 2.3c-.8.5-1.1.9-1.1 1.9" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.4" fill="currentColor" />
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M15 17v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1" strokeLinecap="round" />
      <path d="M19 12H9m10 0-3-3m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const navItems: NavItem[] = [
  { label: "Home", to: "/", icon: icons.home },
  { label: "Decks", to: "/decks", icon: icons.decks },
  { label: "Notes", to: "/notes", icon: icons.notes },
  { label: "Quizzes", to: "/quizzes", icon: icons.quizzes },
];

export default function NavBar() {
  const location = useLocation();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col rounded-2xl border border-line bg-paper">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dashed border-line text-[10px] font-medium text-muted">
          logo
        </div>
        <p className="text-[0.95rem] font-semibold tracking-tight">Study AI</p>
      </div>

      <nav className="flex flex-col gap-1 px-3 pt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.875rem] font-medium transition-colors ${
                isActive ? "bg-ink text-paper" : "text-muted hover:bg-canvas hover:text-ink"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3 pb-4 pt-2">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-canvas">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-[0.8rem] font-medium">
            P
          </div>
          <p className="flex-1 truncate text-sm font-medium">Philip</p>
          <button
            type="button"
            aria-label="Log out"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
          >
            {icons.logout}
          </button>
        </div>
      </div>
    </aside>
  );
}