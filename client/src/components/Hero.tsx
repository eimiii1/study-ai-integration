import { quickActions } from "../data";
import { AtIcon, BellIcon, ChevronDownIcon, IconIndex, PlusIcon, SkillsIcon } from "./icons";

export function Hero() {
  return (
    <section className="flex flex-col items-center px-5 pb-9 pt-16">
      <h1 className="m-0 text-[23px] font-medium tracking-tight text-ink">
        Good morning, Jane
      </h1>
      <p className="mb-6 mt-1.5 text-[13px] text-ink-muted">
        I'm Rune, what are we studying today?
      </p>

      <div className="w-full max-w-129 rounded-xl border border-line bg-input px-3.5 pb-2.5 pt-3.5">
        <input
          className="w-full border-none bg-transparent pb-5 text-[13px] text-ink outline-none placeholder:text-ink-faint"
          placeholder="Example: Quiz me on my Biology deck's mitosis cards…"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex h-6.5 w-6.5 items-center justify-center rounded-[6px] text-ink-muted hover:bg-elevated hover:text-ink-dim">
              <PlusIcon size={15} />
            </button>
            <button className="flex h-6.5 w-6.5 items-center justify-center rounded-[6px] text-ink-muted hover:bg-elevated hover:text-ink-dim">
              <AtIcon size={15} />
            </button>
            <button className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-elevated hover:text-ink-dim">
              <SkillsIcon size={13} />
              <span>Skills</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-elevated hover:text-ink-dim">
              <span className="flex items-center">
                {["violet", "pink", "orange"].map((c, i) => (
                  <span
                    key={c}
                    className="h-2.25 w-2.25 rounded-full border-[1.5px] border-input"
                    style={{ background: `var(--color-${c})`, marginLeft: i === 0 ? 0 : -4 }}
                  />
                ))}
              </span>
              <span>Model Fusion</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex h-6.5 w-6.5 items-center justify-center rounded-[6px] text-ink-muted hover:bg-elevated hover:text-ink-dim">
              <BellIcon size={15} />
            </button>
            <button className="flex h-6.5 w-6.5 items-center justify-center rounded-[6px] bg-ink text-app">
              <ChevronDownIcon size={13} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex max-w-155 flex-wrap items-center justify-center gap-2">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-panel px-2.75 py-1.75 text-[12px] text-ink-dim hover:bg-panel-hover hover:text-ink"
          >
            <IconIndex name={action.icon} size={14} />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
