import type { ReactNode } from "react";
import { SparkIcon } from "../../components/icons";

interface AuthLayoutProps {
  eyebrow: string;
  headline: string;
  children: ReactNode;
}

export function AuthLayout({ eyebrow, headline, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-app">
      <div className="relative hidden max-w-120 flex-[0_0_42%] flex-col justify-center overflow-hidden border-r border-hairline bg-sidebar p-14 lg:flex">
        <div
          className="pointer-events-none absolute -bottom-45 -right-45 h-105 w-105 rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(155,140,240,0.14), transparent 70%)",
          }}
        />

        <div className="mb-11 flex h-7.5 w-7.5 items-center justify-center rounded-[7px] bg-[#e8554f]">
          <span className="text-[16px] font-bold text-white">D</span>
        </div>

        <div className="mb-5 text-ink">
          <SparkIcon size={34} />
        </div>

        <h2 className="m-0 mb-2.5 max-w-80 text-[26px] font-medium leading-snug tracking-tight text-ink">
          {headline}
        </h2>
        <p className="m-0 max-w-75 text-[13px] leading-relaxed text-ink-muted">{eyebrow}</p>

        <div className="relative z-10 mt-9 flex gap-1.5">
          {["violet", "pink", "orange"].map((c) => (
            <span
              key={c}
              className="h-2 w-2 rounded-full"
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
