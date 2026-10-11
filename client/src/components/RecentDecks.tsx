import { recentDecks } from "../data";
import { AvatarCluster } from "./AvatarCluster";
import { ExpandIcon, RefreshIcon } from "./icons";

export function RecentDecks() {
  return (
    <section className="mb-7 px-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 text-[13px] font-medium text-ink">
          Recent decks <span className="font-normal text-ink-faint">(12)</span>
        </h2>
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-panel hover:text-ink">
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
        {recentDecks.map((deck) => (
          <article
            key={deck.id}
            className="flex flex-col gap-6 rounded-[10px] border border-line bg-panel p-3"
          >
            <div className="flex items-center justify-between">
              <AvatarCluster colors={deck.avatarColors} />
              <span className="text-[11px] text-ink-faint">{deck.cardCount} cards</span>
            </div>
            <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] text-ink-dim">
              {deck.title}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
