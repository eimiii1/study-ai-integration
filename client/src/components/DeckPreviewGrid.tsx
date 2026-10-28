import { Link } from "react-router";
import type { Deck } from "../types";
import { DeckTile } from "./DeckTile";
import { ExpandIcon, RefreshIcon } from "./icons";

interface DeckPreviewGridProps {
  decks: Deck[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function DeckPreviewGrid({ decks, isLoading, error, refetch }: DeckPreviewGridProps) {
  const topLevelDecks = decks.filter((deck) => deck.parent_deck_id === null);

  return (
    <section className="px-7 pb-10">
      <div className="mb-3.5 flex items-end justify-between border-b-[1.5px] border-ink pb-2">
        <h2 className="font-display m-0 text-[17px] font-medium italic text-ink">
          Your decks <span className="font-sans text-[13px] not-italic font-normal text-ink-faint">({topLevelDecks.length})</span>
        </h2>
        <div className="flex items-center gap-1">
          <button
            className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-elevated hover:text-ink"
            onClick={() => refetch()}
          >
            <RefreshIcon size={13} />
            <span>Refresh</span>
          </button>
          <Link
            to="/decks"
            className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted no-underline hover:bg-elevated hover:text-ink"
          >
            <ExpandIcon size={13} />
            <span>View all</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <p className="m-0 text-[12px] text-ink-muted">Loading decks…</p>
      ) : error ? (
        <div>
          <p className="mb-2 text-[12px] text-danger">{error}</p>
          <button
            className="rounded-[6px] border-[1.5px] border-line-strong px-2 py-1 text-[12px] text-ink-dim hover:border-ink hover:text-ink"
            onClick={() => refetch()}
          >
            Try again
          </button>
        </div>
      ) : topLevelDecks.length === 0 ? (
        <div className="rounded-[8px] border-[1.5px] border-dashed border-line-strong px-5 py-7 text-center">
          <p className="m-0 text-[12.5px] text-ink-muted">
            No decks yet —{" "}
            <Link to="/decks" className="font-medium text-ink underline decoration-line-strong underline-offset-2">
              create your first one
            </Link>{" "}
            to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {topLevelDecks.map((deck) => (
            <DeckTile key={deck.id} deck={deck} />
          ))}
        </div>
      )}
    </section>
  );
}
