import { useEffect, useState } from "react";

// A brief boot splash shown once when the app first mounts, not a generic
// spinner reused everywhere — matches the paper/sticker theme (ink-bordered
// badge, serif wordmark, three dots pulsing like the HUD toast on My Room).
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
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-app transition-opacity duration-250 " +
        (leaving ? "pointer-events-none opacity-0" : "opacity-100")
      }
    >
      <img
        src="/Logo_BuildScape.png"
        alt=""
        className="h-70 w-120 rounded-[10px] border-none"
      />
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet" />
      </div>
    </div>
  );
}