import { Link } from "react-router";
import type { Deck } from "../types";
import { DeckTile } from "./DeckTile";
import { ExpandIcon, RefreshIcon } from "./icons";

interface RecentDecksProps {
  decks: Deck[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function RecentDecks({ decks, isLoading, error, refetch }: RecentDecksProps) {
  if (isLoading) {
    return <p className="px-5 text-[12px] text-ink-muted">Loading decks...</p>;
  }

  if (error) {
    return (
      <div className="px-5">
        <p className="mb-2 text-[12px] text-danger">{error}</p>
        <button
          className="rounded-[6px] border border-line px-2 py-1 text-[12px] text-ink-dim hover:bg-panel hover:text-ink"
          onClick={() => refetch()}
        >
          Try again
        </button>
      </div>
    );
  }

  const topLevelDecks = decks.filter((deck) => deck.parent_deck_id === null);

  return (
    <section className="mb-7 px-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 text-[13px] font-medium text-ink">
          Recent decks{" "}
          <span className="font-normal text-ink-faint">({topLevelDecks.length})</span>
        </h2>
        <div className="flex items-center gap-1">
          <button
            className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-panel hover:text-ink"
            onClick={() => refetch()}
          >
            <RefreshIcon size={13} />
            <span>Refresh</span>
          </button>
          <Link
            to="/decks"
            className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted no-underline hover:bg-panel hover:text-ink"
          >
            <ExpandIcon size={13} />
            <span>Expand</span>
          </Link>
        </div>
      </div>

      {topLevelDecks.length === 0 ? (
        <p className="m-0 text-[12px] text-ink-faint">
          No decks yet —{" "}
          <Link to="/decks" className="text-ink-dim hover:text-ink">
            create one
          </Link>{" "}
          to get started.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2.5">
          {topLevelDecks.map((deck) => (
            <DeckTile key={deck.id} deck={deck} />
          ))}
        </div>
      )}
    </section>
  );
}
