import { Link, NavLink, useNavigate } from "react-router";
import { navItems } from "../data";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { clearToken } from "../lib/api";
import { accentFor } from "../lib/ui";
import { ChevronDownIcon, IconIndex, LogOutIcon, SearchIcon, WindowIcon } from "./icons";

// Template chrome with no backing feature in this app yet (no "spaces" or
// "apps" concept on the backend) — shown, but honestly disabled rather than
// pretending to do something.
const disabledChrome =
  "flex w-full cursor-not-allowed items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-[12.5px] text-ink-faint opacity-55";

export function Sidebar() {
  const { user, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  const signOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex h-full w-46 flex-shrink-0 flex-col border-r border-hairline bg-sidebar p-2.5">
      <div className="flex items-center justify-between px-1 pb-2.5">
        <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink">
          <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#e8554f] text-[10px] font-bold text-white">
            D
          </span>
          <span>Deckly</span>
          <ChevronDownIcon size={12} className="text-ink-muted" />
        </div>
        <button
          disabled
          title="Not available yet"
          className="flex cursor-not-allowed rounded-[5px] p-0.5 text-ink-faint opacity-55"
          aria-label="Open panel"
        >
          <WindowIcon size={14} />
        </button>
      </div>

      <button
        disabled
        title="Search isn't wired up yet"
        className="mb-3.5 flex w-full cursor-not-allowed items-center gap-1.5 rounded-[7px] border border-hairline px-2 py-1.5 text-ink-faint opacity-55"
      >
        <SearchIcon size={14} />
        <span className="flex-1 text-left text-[12.5px]">Search</span>
        <span className="text-[10.5px]">⌘K</span>
      </button>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto">
        <ul className="flex flex-col gap-px">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  "relative flex items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-[12.5px] no-underline " +
                  (isActive
                    ? "bg-elevated font-medium text-ink"
                    : "text-ink-dim hover:bg-elevated hover:text-ink")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute -left-2.5 h-4 w-0.75 rounded-full bg-violet" />
                    )}
                    <span className="flex opacity-85">
                      <IconIndex name={item.icon} size={15} />
                    </span>
                    <span className="flex-1">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-2 flex flex-col gap-px border-t border-hairline pt-2.5">
        <button disabled title="Not available yet" className={disabledChrome}>
          <span>Spaces</span>
          <ChevronDownIcon size={12} />
        </button>
        <button disabled title="Not available yet" className={disabledChrome}>
          <span className="w-[15px] text-center text-[11px]">▦</span>
          <span>Apps</span>
        </button>
        <button disabled title="Not available yet" className={disabledChrome}>
          <span className="w-[15px] text-center text-[11px]">•••</span>
          <span>More</span>
        </button>

        <Link
          to="/profile"
          className="mt-1 flex items-center gap-2 rounded-[6px] px-1.5 py-1.5 pb-0.5 pt-2 no-underline hover:bg-elevated"
        >
          <span
            className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ background: user ? `var(--color-${accentFor(user.id)})` : "var(--color-ink-faint)" }}
          >
            {(user?.username ?? "?").charAt(0).toUpperCase()}
          </span>
          <span className="flex-1 truncate text-[12.5px] text-ink">
            {isLoading ? "Loading..." : user?.username ?? "Not signed in"}
          </span>
          <button
            onClick={signOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[5px] text-ink-muted hover:bg-panel hover:text-danger"
          >
            <LogOutIcon size={12} />
          </button>
        </Link>
      </div>
    </aside>
  );
}
