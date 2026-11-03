import { Link, NavLink, useNavigate } from "react-router";
import { navItems } from "../data";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { clearToken } from "../lib/api";
import { accentFor } from "../lib/ui";
import { BrandMark } from "./BrandMark";
import { IconIndex, LogOutIcon } from "./icons";

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
    <aside className="flex h-full w-52 flex-shrink-0 flex-col border-0 border-rail-line bg-sidebar p-3">
      <button
        onClick={() => navigate("/")}
        className="mb-5 flex items-center gap-2 rounded-[8px] px-1.5 py-1 text-left hover:bg-[#1e1c16]"
      >
        <BrandMark size="sm" tone="light" />
      </button>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        <p className="m-0 mb-1 px-1.5 text-[10.5px] font-medium text-rail-faint">Workspace</p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  "flex items-center gap-2 rounded-[8px] border-0 px-2 py-1.75 text-[12.5px] no-underline " +
                  (isActive
                    ? "border-rail-line bg-[#1d1d1d] font-medium text-rail-ink"
                    : "border-transparent text-rail-dim hover:border-rail-line hover:bg-[#1d1d1d] hover:text-rail-ink")
                }
              >
                <span className="flex opacity-90">
                  <IconIndex name={item.icon} size={14} />
                </span>
                <span className="flex-1">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-3 flex flex-col gap-px border-t border-rail-line pt-3">
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-[8px] px-1.5 py-1.5 no-underline hover:bg-[#1c1a15]"
        >
          <span
            className="flex h-5.5 w-5.5 flex-shrink-0 items-center justify-center rounded-[6px] text-[9.5px] font-bold text-rail-ink"
            style={{ background: user ? `var(--color-${accentFor(user.id)})` : "#45423a" }}
          >
            {(user?.username ?? "?").charAt(0).toUpperCase()}
          </span>
          <span className="flex-1 truncate text-[12.5px] text-rail-ink/85">
            {isLoading ? "Loading..." : user?.username ?? "Not signed in"}
          </span>
          <button
            onClick={signOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-5.5 w-5.5 flex-shrink-0 items-center justify-center rounded-[6px] text-rail-faint hover:bg-rail-line hover:text-danger"
          >
            <LogOutIcon size={12} />
          </button>
        </Link>
      </div>
    </aside>
  );
}
