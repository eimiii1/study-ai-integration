import { useDecks } from "../hooks/useDecks";
import type { Deck } from "../types";
import { AvatarCluster } from "./AvatarCluster";
import { ExpandIcon, RefreshIcon } from "./icons";

const COLOR_PALETTE = ["violet", "pink", "orange", "teal", "blue", "green"];

function getDeckColors(deck: Deck): string[] {
  const first = COLOR_PALETTE[deck.id % COLOR_PALETTE.length];
  const second = COLOR_PALETTE[(deck.id + 2) % COLOR_PALETTE.length];
  return [first, second];
}

export function RecentDecks() {
  const { decks, isLoading, error, refetch } = useDecks();

  if (isLoading) {
    return <p className="px-5 text-[12px] text-ink-muted">Loading decks...</p>;
  }

  if (error) {
    return <p className="px-5 text-[12px] text-danger">{error}</p>;
  }

  return (
    <section className="mb-7 px-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 text-[13px] font-medium text-ink">
          Recent decks{" "}
          <span className="font-normal text-ink-faint">({decks.length})</span>
        </h2>
        <div className="flex items-center gap-1">
          <button
            className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-panel hover:text-ink"
            onClick={() => refetch()}
          >
            <RefreshIcon size={13} />
            <span>Refresh</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-panel hover:text-ink">
            <ExpandIcon size={13} />
            <span>Expand</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {decks
          .filter(deck => deck.parent_deck_id === null)
          .map((deck) => (
            <article
              key={deck.id}
              className="rounded-[10px] border border-line bg-panel p-3.25"
            >
              <div className="mb-2.25 flex items-center gap-2">
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-bold text-ink">
                  {deck.title}
                </span>
              </div>
              <p className="m-0 line-clamp-2 text-[11.5px] leading-relaxed text-ink-muted">
                {deck.description}
              </p>
              <p className="m-0 text-[11px] text-ink-faint">
                {decks.filter(d => d.parent_deck_id === deck.id).length} subdecks
              </p>
            </article>
          ))}
      </div>
    </section>
  );
}