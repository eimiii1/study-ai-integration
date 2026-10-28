// Shared primitives so the same look isn't re-typed in every file.
//
// Shape language: solid 1.5px ink borders + a flat offset "sticker" shadow
// instead of soft blurred elevation — a page/notebook graphic rather than a
// floating glassy one. Buttons shift onto their own shadow on press.

export const primaryButton =
  "flex items-center justify-center gap-1.5 rounded-[6px] border-[1.5px] border-ink bg-violet px-3.25 py-1.75 text-[12.5px] font-semibold text-[#fbf8ee] shadow-[var(--shadow-sticker-sm)] hover:bg-violet-strong active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[var(--shadow-sticker-sm)]";

export const secondaryButton =
  "flex items-center justify-center gap-1.5 rounded-[6px] border-[1.5px] border-line-strong bg-panel px-3.25 py-1.75 text-[12.5px] font-medium text-ink-dim hover:border-ink hover:text-ink active:translate-x-[1px] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50";

export const ghostButton =
  "flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-elevated hover:text-ink";

export const dangerGhostButton =
  "flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-danger/10 hover:text-danger";

export const iconButton =
  "flex h-6.5 w-6.5 items-center justify-center rounded-[6px] text-ink-muted hover:bg-elevated hover:text-ink-dim";

export const inputClass =
  "w-full rounded-[6px] border-[1.5px] border-line-strong bg-input px-2.75 py-2 text-[13.5px] text-ink outline-none transition-shadow placeholder:text-ink-faint focus:border-ink focus:shadow-[2px_2px_0_0_var(--color-violet)]";

// A card that reads as a cut-out piece of paper: solid border + offset
// block shadow, lifting flush onto the page on hover instead of floating.
export const cardClass =
  "rounded-[8px] border-[1.5px] border-line-strong bg-panel shadow-[var(--shadow-sticker)] transition-[transform,box-shadow] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_0_var(--color-ink)]";

export const badgeClass =
  "inline-flex items-center gap-1 rounded-[4px] border-[1.5px] border-ink px-1.5 py-0.5 text-[10.5px] font-semibold text-ink";

// Deterministic accent color per deck/entity id, so the same deck always
// gets the same color without storing it anywhere.
const accentPalette = ["violet", "pink", "orange", "teal", "blue", "green"] as const;

export function accentFor(id: number | string): (typeof accentPalette)[number] {
  const n = typeof id === "number" ? id : [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return accentPalette[n % accentPalette.length];
}
