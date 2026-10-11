import { agentTabs } from "../data";
import {
  ChevronDownIcon,
  HelpIcon,
  MemoryIcon,
  PanelIcon,
  PlusIcon,
  ShareIcon,
  SparkIcon,
} from "./icons";

export function TopBar() {
  return (
    <div className="flex flex-col border-b border-hairline bg-app">
      <div className="flex h-[42px] items-center justify-between border-b border-hairline px-5">
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
          <SparkIcon size={13} />
          <span>Ask Rune</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-[7px] border border-line bg-panel px-2.5 py-1.5 text-[12px] text-ink-dim">
            <span>Quick Chat</span>
            <ChevronDownIcon size={12} />
          </button>
          <button className="flex items-center gap-1.5 rounded-[6px] px-1.5 py-1.5 text-[12px] text-ink-dim hover:bg-panel hover:text-ink">
            <MemoryIcon size={13} />
            <span>Memory</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-[6px] px-1.5 py-1.5 text-[12px] text-ink-dim hover:bg-panel hover:text-ink">
            <ShareIcon size={13} />
            <span>Share</span>
          </button>
          <div className="ml-0.5 flex items-center">
            {["violet", "pink", "orange", "teal"].map((c, i) => (
              <span
                key={c}
                className="h-[17px] w-[17px] rounded-full border-2 border-app first:ml-0"
                style={{ background: `var(--color-${c})`, marginLeft: i === 0 ? 0 : -6 }}
              />
            ))}
          </div>
          <button className="flex h-6.5 w-6.5 items-center justify-center rounded-[6px] text-ink-muted hover:bg-panel hover:text-ink">
            <HelpIcon size={14} />
          </button>
        </div>
      </div>

      <div className="flex h-10 items-center justify-between px-5">
        <div className="flex items-center gap-0.5">
          {agentTabs.map((tab) => (
            <button
              key={tab.name}
              className={
                "flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[12.5px] " +
                (tab.active ? "bg-elevated text-ink" : "text-ink-muted")
              }
            >
              {tab.icon === "spark" ? (
                <SparkIcon size={12} />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
              )}
              <span>{tab.name}</span>
            </button>
          ))}
          <button className="flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[12.5px] text-ink-faint">
            <PlusIcon size={12} />
            <span>Add Agent</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="rounded-[6px] px-1.5 py-1.5 text-[12.5px] text-ink-dim hover:bg-panel hover:text-ink">
            Start from scratch
          </button>
          <button className="flex items-center gap-1.5 rounded-[6px] px-1.5 py-1.5 text-[12px] text-ink-dim hover:bg-panel hover:text-ink">
            <PanelIcon size={13} />
            <span>Settings</span>
          </button>
          <button className="flex h-6.5 w-6.5 items-center justify-center rounded-[6px] text-ink-muted hover:bg-panel hover:text-ink">
            <ShareIcon size={13} style={{ transform: "rotate(90deg)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
