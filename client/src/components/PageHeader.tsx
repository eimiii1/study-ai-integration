import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex h-[46px] flex-shrink-0 items-center justify-between gap-3 border-b border-hairline bg-app px-6">
      <div className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-ink">
        {title}
      </div>
      <div className="flex flex-shrink-0 items-center gap-1">{children}</div>
    </div>
  );
}
