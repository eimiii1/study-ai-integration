// A generated dot-grid, radius falling off from a focal point — the quiet
// halftone texture behind the auth screens. Built from a plain grid rather
// than randomness so it reads as deliberate, not decorative noise, and so
// the same props always render the same pattern (no layout shift, nothing
// to get out of sync between server and client).
const COLS = 22;
const ROWS = 26;
const CELL = 16;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;

interface HalftoneDotsProps {
  /** Focal point as a fraction of the grid, 0–1. */
  focusX?: number;
  focusY?: number;
  maxRadius?: number;
  className?: string;
}

export function HalftoneDots({ focusX = 0.3, focusY = 0.32, maxRadius = 4.6, className = "" }: HalftoneDotsProps) {
  const fx = focusX * WIDTH;
  const fy = focusY * HEIGHT;
  const maxDist = Math.hypot(WIDTH, HEIGHT) * 0.62;

  const dots: { x: number; y: number; r: number }[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * CELL + CELL / 2;
      const y = row * CELL + CELL / 2;
      const dist = Math.hypot(x - fx, y - fy);
      const falloff = Math.max(0, 1 - dist / maxDist);
      const r = Math.max(0.35, falloff * falloff * maxRadius);
      if (r > 0.4) dots.push({ x, y, r });
    }
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="currentColor" />
      ))}
    </svg>
  );
}
