import { Link } from "react-router";
import { plural } from "../lib/format";
import { accentFor } from "../lib/ui";
import { DecksIcon } from "./icons";
import type { Deck } from "../types";

export function DeckTile({ deck }: { deck: Deck }) {
  const isSubdeck = deck.parent_deck_id !== null;
  const accent = accentFor(deck.id);

  return (
    <Link
      to={`/decks/${deck.id}`}
      className="group relative block rounded-[14px] border border-line bg-panel p-3.5 pt-4.5 no-underline shadow-[var(--shadow-soft)] transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-[var(--shadow-lift)]"
    >
      <span
        className="absolute left-4 top-0 h-[2.5px] w-7 -translate-y-px rounded-full"
        style={{ background: `var(--color-${accent})` }}
      />
      <div className="mb-2.25 flex items-center gap-2">
        <span
          className="flex h-5.5 w-5.5 flex-shrink-0 items-center justify-center rounded-[6px] text-white"
          style={{ background: `var(--color-${accent})` }}
        >
          <DecksIcon size={12} />
        </span>
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-bold text-ink">
          {deck.title}
        </span>
      </div>
      <p className="m-0 line-clamp-2 min-h-[2.6em] text-[12px] leading-relaxed text-ink-muted">
        {deck.description || "No description yet."}
      </p>
      <p className="m-0 mt-2.5 flex items-center gap-1 border-t border-dashed border-line-strong pt-2 text-[11px] text-ink-faint">
        {plural(deck.card_count, "card")}
        {!isSubdeck && ` · ${plural(deck.subdeck_count, "subdeck")}`}
      </p>
    </Link>
  );
}
