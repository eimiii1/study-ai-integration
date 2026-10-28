import type { ReactNode } from "react";

interface AuthLayoutProps {
  eyebrow: string;
  headline: string;
  children: ReactNode;
}

export function AuthLayout({ eyebrow, headline, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-app">
      <div className="relative hidden max-w-120 flex-[0_0_42%] flex-col justify-center overflow-hidden border-r-[1.5px] border-[#2c342e] bg-sidebar p-14 lg:flex">
        <span
          aria-hidden
          className="font-display pointer-events-none absolute -left-4 -top-10 select-none text-[220px] italic leading-none text-[#262e27]"
        >
          “
        </span>

        <div className="relative z-10 mb-10 flex items-center gap-2.5">
          <span className="flex h-7.5 w-7.5 items-center justify-center rounded-[6px] border-[1.5px] border-[#3a443c] bg-violet text-[15px] font-bold text-[#fbf8ee]">
            D
          </span>
          <span className="text-[11px] tracking-[0.02em] text-[#6c7467]">Deckly — your study desk</span>
        </div>

        <h2 className="font-display relative z-10 m-0 mb-3 max-w-85 text-[32px] font-medium leading-[1.2] text-[#f1efe2]">
          {headline}
        </h2>
        <p className="relative z-10 m-0 max-w-75 text-[13.5px] leading-relaxed text-[#aab0a2]">{eyebrow}</p>

        <div className="relative z-10 mt-10 flex items-center gap-1.5">
          {["violet", "pink", "orange", "teal"].map((c) => (
            <span
              key={c}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: `var(--color-${c})` }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-10">
        <div className="w-full max-w-90">{children}</div>
      </div>
    </div>
  );
}
