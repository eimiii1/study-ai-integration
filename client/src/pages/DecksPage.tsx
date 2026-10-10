import { useEffect, useState } from "react";
import { api } from "../api/client";
import AppLayout from "../layout/AppLayout";
import DeckPreviewCard from "../components/DeckPreviewCard";
import CreateDeckModal from "../components/CreateDeckModal";

type Deck = {
  id: number;
  title: string;
  description: string | null;
  parent_deck_id: number | null;
  subdeck_count: number;
  card_count: number;
};

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDecks = () => {
    setLoading(true);
    api<Deck[]>("/decks")
      .then((data) => {
        const topLevelDecks = data.filter((deck) => deck.parent_deck_id === null);
        setDecks(topLevelDecks);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load decks"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Decks</h1>
            <p className="mt-1 text-sm text-muted">All your decks in one place.</p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/85"
          >
            + Create deck
          </button>
        </div>

        {loading && <p className="text-sm text-muted">Loading decks...</p>}
        {error && <p className="text-sm text-muted">{error}</p>}
        {!loading && !error && decks.length === 0 && (
          <p className="text-sm text-muted">No decks yet. Create your first one to get started.</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <DeckPreviewCard
              key={deck.id}
              title={deck.title}
              description={deck.description}
              subdeckCount={deck.subdeck_count}
              cardCount={deck.card_count}
            />
          ))}
        </div>
      </div>

      <CreateDeckModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchDecks}
      />
    </AppLayout>
  );
}