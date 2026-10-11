import { navItems } from "../data";
import { ChevronDownIcon, IconIndex, SearchIcon, WindowIcon } from "./icons";

export function Sidebar() {
  return (
    <aside className="flex h-full w-46 flex-shrink-0 flex-col border-r border-hairline bg-sidebar p-2.5">
      <div className="flex items-center justify-between px-1 pb-2.5">
        <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink">
          <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#e8554f] text-[10px] font-bold text-white">
            D
          </span>
          <span>Deckly</span>
          <ChevronDownIcon size={12} className="text-ink-muted" />
        </div>
        <button
          className="flex rounded-[5px] p-0.5 text-ink-muted hover:bg-elevated hover:text-ink-dim"
          aria-label="Open panel"
        >
          <WindowIcon size={14} />
        </button>
      </div>

      <button className="mb-3.5 flex w-full items-center gap-1.5 rounded-[7px] border border-hairline px-2 py-1.5 text-ink-muted">
        <SearchIcon size={14} />
        <span className="flex-1 text-left text-[12.5px]">Search</span>
        <span className="text-[10.5px] text-ink-faint">⌘K</span>
      </button>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto">
        <ul className="flex flex-col gap-px">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={
                  "flex items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-[12.5px] no-underline " +
                  (item.active
                    ? "bg-elevated font-medium text-ink"
                    : "text-ink-dim hover:bg-elevated hover:text-ink")
                }
              >
                <span className="flex opacity-85">
                  <IconIndex name={item.icon} size={15} />
                </span>
                <span className="flex-1">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-2 flex flex-col gap-px border-t border-hairline pt-2.5">
        <button className="flex w-full items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-[12.5px] text-ink-dim hover:bg-elevated">
          <span>Spaces</span>
          <ChevronDownIcon size={12} />
        </button>
        <button className="flex w-full items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-[12.5px] text-ink-dim hover:bg-elevated">
          <span className="w-[15px] text-center text-[11px] text-ink-muted">▦</span>
          <span>Apps</span>
        </button>
        <button className="flex w-full items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-[12.5px] text-ink-dim hover:bg-elevated">
          <span className="w-[15px] text-center text-[11px] text-ink-muted">•••</span>
          <span>More</span>
        </button>

        <div className="mt-1 flex items-center gap-2 px-1.5 pb-0.5 pt-2">
          <span className="h-[18px] w-[18px] rounded-full bg-[#c9655f]" />
          <span className="flex-1 text-[12.5px] text-ink">Jane Moore</span>
          <span className="text-[13px] text-ink-muted">⋯</span>
        </div>
      </div>
    </aside>
  );
}
