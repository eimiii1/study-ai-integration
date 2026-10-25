import { exploreDecks } from "../data";
import { badgeClass, cardClass } from "../lib/ui";
import { ExpandIcon, FilterIcon, SearchIcon } from "./icons";

export function ExploreDecks() {
  return (
    <section className="px-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 text-[13px] font-medium text-ink">Explore decks</h2>
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-panel hover:text-ink">
            <SearchIcon size={13} />
            <span>Search</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-panel hover:text-ink">
            <FilterIcon size={13} />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-panel hover:text-ink">
            <ExpandIcon size={13} />
            <span>Expand</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {exploreDecks.map((deck) => (
          <article
            key={deck.id}
            className={cardClass + " p-3.25 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"}
          >
            <div className="mb-2.25 flex items-center gap-2">
              <span
                className="flex h-5.5 w-5.5 flex-shrink-0 items-center justify-center rounded-[5px] text-[11px] font-bold text-white"
                style={{ background: deck.iconBg }}
              >
                {deck.iconLetter}
              </span>
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-medium text-ink">
                {deck.name}
              </span>
              {deck.trending && <span className={badgeClass}>Trending</span>}
            </div>
            <p className="m-0 line-clamp-2 min-h-[2.6em] text-[12px] leading-relaxed text-ink-muted">
              {deck.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
