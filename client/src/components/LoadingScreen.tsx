import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";

export function LoadingScreen({ onDone }: { onDone?: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 1750);
    const doneTimer = setTimeout(() => onDone?.(), 2000);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5 bg-app transition-opacity duration-250 " +
        (leaving ? "pointer-events-none opacity-0" : "opacity-100")
      }
    >
      <div className="scale-150">
        <BrandMark size="md" tone="dark" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink" />
      </div>
    </div>
  );
}
