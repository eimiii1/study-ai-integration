import { Link } from "react-router";

const links = [
  { label: "Home", to: "/" },
  { label: "Decks", to: "/decks" },
  { label: "Notes", to: "/notes" },
  { label: "Quizzes", to: "/quizzes" },
];

export default function NavBar() {
  return (
    <header className="bg-inkwell text-chalk">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="font-serif text-xl">Study AI</span>

        <nav className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="text-chalk/70 transition hover:text-chalk">
              {link.label}
            </Link>
          ))}
        </nav>

        <button type="button" className="text-sm text-chalk/70 transition hover:text-chalk">
          Log out
        </button>
      </div>
    </header>
  );
}