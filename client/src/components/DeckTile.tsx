import { Link } from "react-router";
import { plural } from "../lib/format";
import type { Deck } from "../types";

export function DeckTile({ deck }: { deck: Deck }) {
  const isSubdeck = deck.parent_deck_id !== null;

  return (
    <Link
      to={`/decks/${deck.id}`}
      className="block rounded-[10px] border border-line bg-panel p-3.25 no-underline hover:bg-panel-hover"
    >
      <div className="mb-2.25 flex items-center gap-2">
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-bold text-ink">
          {deck.title}
        </span>
      </div>
      <p className="m-0 line-clamp-2 text-[11.5px] leading-relaxed text-ink-muted">
        {deck.description || "No description yet."}
      </p>
      <p className="m-0 mt-1.5 text-[11px] text-ink-faint">
        {plural(deck.card_count, "card")}
        {!isSubdeck && ` · ${plural(deck.subdeck_count, "subdeck")}`}
      </p>
    </Link>
  );
}
