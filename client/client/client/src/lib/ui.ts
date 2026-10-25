// Shared primitives so the same look isn't re-typed in every file.

export const primaryButton =
  "flex items-center justify-center gap-1.5 rounded-[7px] bg-violet px-3 py-1.75 text-[12.5px] font-semibold text-app shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] hover:bg-violet-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

export const secondaryButton =
  "flex items-center justify-center gap-1.5 rounded-[7px] border border-line bg-panel px-3 py-1.75 text-[12.5px] font-medium text-ink-dim hover:border-line-strong hover:bg-panel-hover hover:text-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

export const ghostButton =
  "flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-panel hover:text-ink";

export const dangerGhostButton =
  "flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-danger/10 hover:text-danger";

export const iconButton =
  "flex h-6.5 w-6.5 items-center justify-center rounded-[6px] text-ink-muted hover:bg-elevated hover:text-ink-dim";

export const inputClass =
  "w-full rounded-lg border border-line bg-input px-2.75 py-2 text-[13.5px] text-ink outline-none transition-shadow placeholder:text-ink-faint focus:border-violet focus:shadow-[0_0_0_3px_rgba(155,140,240,0.15)]";

export const cardClass =
  "rounded-[10px] border border-line bg-panel transition-[border-color,box-shadow,transform] hover:border-line-strong";

export const badgeClass =
  "inline-flex items-center gap-1 rounded-[5px] border border-line-strong px-1.5 py-0.5 text-[10.5px] font-medium text-ink-muted";

// Deterministic accent color per deck/entity id, so the same deck always
// gets the same color without storing it anywhere.
const accentPalette = ["violet", "pink", "orange", "teal", "blue", "green"] as const;

export function accentFor(id: number | string): (typeof accentPalette)[number] {
  const n = typeof id === "number" ? id : [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return accentPalette[n % accentPalette.length];
}
