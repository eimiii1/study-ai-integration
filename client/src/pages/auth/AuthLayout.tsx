import type { ReactNode } from "react";
import { BrandMark, CardGlyph } from "../../components/BrandMark";
import { HalftoneDots } from "../../components/auth/HalftoneDots";

interface AuthLayoutProps {
  eyebrow: string;
  headline: string;
  /** A short "front / back" pair shown on the floating flashcard preview —
      lets each screen (login vs. register) riff on a different study moment
      without the layout needing to know anything about decks or cards. */
  preview?: { front: string; back: string };
  children: ReactNode;
}

const accentDots = ["violet", "pink", "orange", "teal"] as const;

export function AuthLayout({
  eyebrow,
  headline,
  preview = { front: "Mitochondria", back: "The powerhouse of the cell" },
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-app">
      <div className="relative hidden max-w-130 flex-[0_0_44%] flex-col justify-between overflow-hidden border-r border-hairline bg-elevated px-14 py-12 lg:flex">
        <HalftoneDots
          focusX={0.62}
          focusY={0.3}
          className="pointer-events-none absolute inset-0 h-full w-full text-ink/[0.16]"
        />

        <div className="relative z-10">
          <BrandMark size="md" tone="dark" />
        </div>

        <div className="relative z-10 flex flex-1 items-center">
          <div className="w-50 -rotate-3 rounded-[16px] border border-line bg-panel p-4 shadow-[var(--shadow-lift)]">
            <span className="mb-2.5 flex items-center gap-1.5 text-[10.5px] font-medium text-ink-faint">
              <CardGlyph size={13} />
              Flashcard
            </span>
            <p className="font-display m-0 text-[17px] font-medium leading-snug text-ink">{preview.front}</p>
            <p className="m-0 mt-2 border-t border-dashed border-line pt-2 text-[12px] leading-relaxed text-ink-muted">
              {preview.back}
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="font-display m-0 mb-3 max-w-90 text-[32px] font-medium leading-[1.2] text-ink">
            {headline}
          </h2>
          <p className="m-0 max-w-80 text-[13.5px] leading-relaxed text-ink-muted">{eyebrow}</p>

          <div className="mt-8 flex items-center gap-1.5">
            {accentDots.map((c) => (
              <span key={c} className="h-1.5 w-1.5 rounded-full" style={{ background: `var(--color-${c})` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-10">
        <div className="mb-8 lg:hidden">
          <BrandMark size="md" tone="dark" />
        </div>
        <div className="w-full max-w-91">{children}</div>
      </div>
    </div>
  );
}
