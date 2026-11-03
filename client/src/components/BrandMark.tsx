// The product's mascot logo (a bright, cartoon "BuildScape" lockup) belongs to
// the old warm/sticker visual system. This mark is its replacement for the new
// monochrome chrome: a plain wordmark plus a tiny stacked-card glyph — legible
// at 20px, and quiet enough to sit next to the serif headlines on the auth
// screens without competing with them.

export function CardGlyph({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect x="5.25" y="2.75" width="12" height="12" rx="2.25" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
      <rect x="2.75" y="5.25" width="12" height="12" rx="2.25" fill="currentColor" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.75 9.25h6M5.75 11.75h3.75" stroke="var(--color-app)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function BrandMark({
  size = "md",
  tone = "dark",
  className = "",
}: {
  size?: "sm" | "md";
  tone?: "dark" | "light";
  className?: string;
}) {
  const textSize = size === "sm" ? "text-[13px]" : "text-[15px]";
  const glyphSize = size === "sm" ? 20 : 24;
  const color = tone === "light" ? "text-rail-ink" : "text-ink";

  return (
    <span className={`inline-flex items-center gap-2 ${color} ${className}`}>
      <CardGlyph size={glyphSize} />
      <span className={`font-semibold tracking-[-0.01em] ${textSize}`}>
        Build<span className="font-normal opacity-60">Scape</span>
      </span>
    </span>
  );
}
