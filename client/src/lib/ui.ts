
export const primaryButton =
  "flex items-center justify-center gap-1.5 rounded-[10px] border border-ink bg-ink px-3.25 py-1.75 text-[12.5px] font-semibold text-app hover:bg-ink-dim active:opacity-85 disabled:cursor-not-allowed disabled:opacity-45";

export const secondaryButton =
  "flex items-center justify-center gap-1.5 rounded-[10px] border border-line-strong bg-panel px-3.25 py-1.75 text-[12.5px] font-medium text-ink-dim hover:border-ink hover:text-ink active:opacity-85 disabled:cursor-not-allowed disabled:opacity-45";

export const ghostButton =
  "flex items-center gap-1.5 rounded-[8px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-elevated hover:text-ink";

export const dangerGhostButton =
  "flex items-center gap-1.5 rounded-[8px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-danger/10 hover:text-danger";

export const iconButton =
  "flex h-6.5 w-6.5 items-center justify-center rounded-[8px] text-ink-muted hover:bg-elevated hover:text-ink-dim";

export const inputClass =
  "w-full rounded-[10px] border border-line bg-input px-2.75 py-2 text-[13.5px] text-ink outline-none transition-shadow placeholder:text-ink-faint focus:border-ink focus:bg-panel focus:shadow-[var(--shadow-ring)]";

export const cardClass =
  "rounded-[14px] border border-line bg-panel shadow-[var(--shadow-soft)] transition-[transform,box-shadow] hover:-translate-y-[1px] hover:shadow-[var(--shadow-lift)]";

export const badgeClass =
  "inline-flex items-center gap-1 rounded-[6px] border border-line-strong px-1.5 py-0.5 text-[10.5px] font-semibold text-ink-dim";


const accentPalette = ["violet", "pink", "orange", "teal", "blue", "green"] as const;

export function accentFor(id: number | string): (typeof accentPalette)[number] {
  const n = typeof id === "number" ? id : [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return accentPalette[n % accentPalette.length];
}
