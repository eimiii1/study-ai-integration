import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export function HomeIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V19a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

export function InboxIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 13 6.5 5h11L20 13" />
      <path d="M4 13v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5h-5l-1.5 2.5h-3L9 13H4Z" />
    </svg>
  );
}

export function MessagesIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 5h16v10H9l-4 4V5Z" />
    </svg>
  );
}

export function BalancesIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 3v18M7 7l-3 5a3 3 0 0 0 6 0l-3-5Zm10 0-3 5a3 3 0 0 0 6 0l-3-5ZM4 7h6M14 7h6M8 21h8" />
    </svg>
  );
}

export function CustomersIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 14.2c2.6.4 4.5 2.7 4.5 5.8" />
    </svg>
  );
}

export function TransactionsIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 8h13l-3-3M20 16H7l3 3" />
    </svg>
  );
}

export function ContractsIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M7 3h7l4 4v14H7V3Z" />
      <path d="M14 3v4h4M9.5 12h5M9.5 15h5M9.5 9h2" />
    </svg>
  );
}

export function WorkflowsIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M7 6h10M6.3 7.7 10.5 16M17.7 7.7 13.5 16" />
    </svg>
  );
}

export function TasksIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m8.5 12 2.3 2.3 4.7-4.6" />
    </svg>
  );
}

export function SearchIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M19 19l-4.3-4.3" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 9.5 12 15l6-5.5" />
    </svg>
  );
}

export function ChevronUpIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 14.5 12 9l6 5.5" />
    </svg>
  );
}

export function SparkIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest} fill="currentColor" stroke="none">
      <path d="M12 2c.6 3.8 1.6 4.8 5.4 5.4-3.8.6-4.8 1.6-5.4 5.4-.6-3.8-1.6-4.8-5.4-5.4 3.8-.6 4.8-1.6 5.4-5.4Z" />
      <path d="M18.5 15c.3 2 .8 2.5 2.8 2.8-2 .3-2.5.8-2.8 2.8-.3-2-.8-2.5-2.8-2.8 2-.3 2.5-.8 2.8-2.8Z" />
    </svg>
  );
}

export function PlusIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function AtIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-4 7.5" />
    </svg>
  );
}

export function SkillsIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
  );
}

export function BellIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 10.5a6 6 0 0 1 12 0c0 3 .8 4.6 1.6 5.6H4.4C5.2 15.1 6 13.5 6 10.5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function MessageIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 5.5h16v9.5H9.5L5 18.5V15H4V5.5Z" />
    </svg>
  );
}

export function ContractActionIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M7.5 4h6l3 3v13h-9V4Z" />
      <path d="M13.5 4v3h3" />
      <path d="M9.5 18 11 19.5 15 15" />
    </svg>
  );
}

export function MailIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
      <path d="m5 7.5 7 5.5 7-5.5" />
    </svg>
  );
}

export function NoteIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="5" y="4" width="14" height="16" rx="1.5" />
      <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" />
    </svg>
  );
}

export function UploadIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 15V5M8.5 8.5 12 5l3.5 3.5" />
      <path d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

export function RefreshIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3L19 8.3" />
      <path d="M19 4.5v4h-4" />
      <path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3L5 15.7" />
      <path d="M5 19.5v-4h4" />
    </svg>
  );
}

export function ExpandIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </svg>
  );
}

export function FilterIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export function ShareIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="18" cy="5" r="2.2" />
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="18" cy="19" r="2.2" />
      <path d="M7.8 10.8 16.2 6.2M7.8 13.2l8.4 4.6" />
    </svg>
  );
}

export function MemoryIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="5" y="5" width="14" height="14" rx="2.5" />
      <path d="M9 9h6v6H9z" />
    </svg>
  );
}

export function HelpIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 9.5a2 2 0 1 1 3 1.7c-.8.5-1.3 1-1.3 2" />
      <path d="M12 16.3v.1" />
    </svg>
  );
}

export function WindowIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M4 9h16" />
    </svg>
  );
}

export function PanelIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M9 4v16" />
    </svg>
  );
}

export function DecksIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="5" y="9" width="14" height="9" rx="1.8" />
      <path d="M7 9V7.5A1.5 1.5 0 0 1 8.5 6h7A1.5 1.5 0 0 1 17 7.5V9" />
      <path d="M9 6V4.8A1 1 0 0 1 10 3.8h4a1 1 0 0 1 1 1V6" />
    </svg>
  );
}

export function ProfileIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="8.3" r="3.5" />
      <path d="M5 19.5c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
    </svg>
  );
}

export function QuizIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.8 9.6a2.2 2.2 0 1 1 3.3 1.9c-.9.5-1.3 1-1.3 1.9" />
      <path d="M12 16.4v.1" />
    </svg>
  );
}

export function CardIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 10.5h8M8 14h5" />
    </svg>
  );
}

export function LockIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      <path d="M12 14.2v2" />
    </svg>
  );
}

export function UserIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  );
}

export function EyeIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

export function EyeOffIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3.5 3.5l17 17" />
      <path d="M10.6 5.7A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a13.6 13.6 0 0 1-3 3.7M6.4 6.4C3.9 8.1 2.5 11 2.5 12S6 18.5 12 18.5a9.6 9.6 0 0 0 2.9-.45" />
      <path d="M9.9 10c-.26.42-.4.9-.4 1.4a2.5 2.5 0 0 0 3.5 2.3" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 15, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconIndex({
  name,
  size,
}: {
  name: string;
  size?: number;
}) {
  const map: Record<string, (p: IconProps) => JSX.Element> = {
    home: HomeIcon,
    decks: DecksIcon,
    profile: ProfileIcon,
    quiz: QuizIcon,
    card: CardIcon,
    mail: MailIcon,
    note: NoteIcon,
    upload: UploadIcon,
  };
  const Cmp = map[name] ?? HomeIcon;
  return <Cmp size={size} />;
}
