import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  children?: ReactNode;
}

// Same 42px bar as the first row of TopBar, for pages that don't use the Rune chrome.
export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex h-[42px] flex-shrink-0 items-center justify-between gap-3 border-b border-hairline bg-app px-5">
      <div className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-ink">
        {title}
      </div>
      <div className="flex flex-shrink-0 items-center gap-1">{children}</div>
    </div>
  );
}
