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

// This bar's chrome (multi-agent tabs, Memory, Share, Settings...) is
// template decoration left over from a multi-agent product this app isn't —
// Deckly has exactly one assistant (Rune) and no sharing/workspace backend.
// Shown for the look, honestly disabled instead of faking functionality.
const disabled = "cursor-not-allowed text-ink-faint opacity-55";

export function TopBar() {
  return (
    <div className="flex flex-col border-b border-hairline bg-app">
      <div className="flex h-[42px] items-center justify-between border-b border-hairline px-5">
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
          <SparkIcon size={13} />
          <span>Ask Rune</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled
            title="Not available yet"
            className={"flex items-center gap-1.5 rounded-[7px] border border-hairline bg-panel px-2.5 py-1.5 text-[12px] " + disabled}
          >
            <span>Quick Chat</span>
            <ChevronDownIcon size={12} />
          </button>
          <button
            disabled
            title="Not available yet"
            className={"flex items-center gap-1.5 rounded-[6px] px-1.5 py-1.5 text-[12px] " + disabled}
          >
            <MemoryIcon size={13} />
            <span>Memory</span>
          </button>
          <button
            disabled
            title="Not available yet"
            className={"flex items-center gap-1.5 rounded-[6px] px-1.5 py-1.5 text-[12px] " + disabled}
          >
            <ShareIcon size={13} />
            <span>Share</span>
          </button>
          <div className="ml-0.5 flex items-center" title="Placeholder collaborators — multi-user isn't a feature here yet">
            {["violet", "pink", "orange", "teal"].map((c, i) => (
              <span
                key={c}
                className="h-[17px] w-[17px] rounded-full border-2 border-app opacity-55 first:ml-0"
                style={{ background: `var(--color-${c})`, marginLeft: i === 0 ? 0 : -6 }}
              />
            ))}
          </div>
          <button
            disabled
            title="Not available yet"
            className={"flex h-6.5 w-6.5 items-center justify-center rounded-[6px] " + disabled}
          >
            <HelpIcon size={14} />
          </button>
        </div>
      </div>

      <div className="flex h-10 items-center justify-between px-5">
        <div className="flex items-center gap-0.5">
          {agentTabs.map((tab) => (
            <button
              key={tab.name}
              disabled={!tab.active}
              title={tab.active ? "Rune is your study assistant" : "Not available — Deckly has one assistant"}
              className={
                "flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[12.5px] " +
                (tab.active ? "bg-elevated text-ink" : "cursor-not-allowed text-ink-faint opacity-55")
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
          <button
            disabled
            title="Not available — Deckly has one assistant"
            className={"flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[12.5px] " + disabled}
          >
            <PlusIcon size={12} />
            <span>Add Agent</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled
            title="Not available yet"
            className={"rounded-[6px] px-1.5 py-1.5 text-[12.5px] " + disabled}
          >
            Start from scratch
          </button>
          <button
            disabled
            title="Not available yet"
            className={"flex items-center gap-1.5 rounded-[6px] px-1.5 py-1.5 text-[12px] " + disabled}
          >
            <PanelIcon size={13} />
            <span>Settings</span>
          </button>
          <button
            disabled
            title="Not available yet"
            className={"flex h-6.5 w-6.5 items-center justify-center rounded-[6px] " + disabled}
          >
            <ShareIcon size={13} style={{ transform: "rotate(90deg)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
