import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../api/client";
import DeckPreviewCard from "./DeckPreviewCard";

type Deck = {
  id: number;
  title: string;
  description: string | null;
};

export default function DeckPreviewGrid() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Deck[]>("/decks")
      .then((data) => setDecks(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load decks"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight">My decks</h2>
        <Link to="/decks" className="text-sm font-medium text-muted hover:text-ink">
          View all
        </Link>
      </div>

      {loading && <p className="text-sm text-muted">Loading decks...</p>}
      {error && <p className="text-sm text-muted">{error}</p>}
      {!loading && !error && decks.length === 0 && (
        <p className="text-sm text-muted">No decks yet.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => (
          <DeckPreviewCard key={deck.id} title={deck.title} />
        ))}
      </div>
    </section>
  );
}