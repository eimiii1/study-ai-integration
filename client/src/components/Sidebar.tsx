import { Link, NavLink, useNavigate } from "react-router";
import { navItems } from "../data";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { clearToken } from "../lib/api";
import { accentFor } from "../lib/ui";
import { IconIndex, LogOutIcon, SearchIcon } from "./icons";

// The sidebar is the dark "spine" of the notebook — a fixed rail with its
// own ink/rail color scale, distinct from the paper-toned content area it
// sits beside, rather than one flat surface stretched across the screen.
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
    <aside className="flex h-full w-52 flex-shrink-0 flex-col border-r-[1.5px] border-[#2c342e] bg-sidebar p-3">
      <div className="mb-5 flex items-center gap-2 px-1">
        <img src="/Logo_BuildScape.png" alt="" className=" rounded-[6px] cursor-pointer"
          onClick={() => navigate('/')}
         />
      </div>


      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        <p className="m-0 mb-1 px-1.5 text-[10.5px] font-medium text-[#6c7467]">Workspace</p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  "flex items-center gap-2 rounded-[6px] border-[1.5px] px-2 py-1.75 text-[12.5px] no-underline " +
                  (isActive
                    ? "border-[#3a443c] bg-[#262e27] font-medium text-[#f1efe2]"
                    : "border-transparent text-[#aab0a2] hover:border-[#2c342e] hover:bg-[#232a25] hover:text-[#f1efe2]")
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

      <div className="mt-3 flex flex-col gap-px border-t border-[#2c342e] pt-3">
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-[6px] px-1.5 py-1.5 no-underline hover:bg-[#232a25]"
        >
          <span
            className="flex h-5.5 w-5.5 flex-shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-[#3a443c] text-[9.5px] font-bold text-[#fbf8ee]"
            style={{ background: user ? `var(--color-${accentFor(user.id)})` : "#4a4f43" }}
          >
            {(user?.username ?? "?").charAt(0).toUpperCase()}
          </span>
          <span className="flex-1 truncate text-[12.5px] text-[#dedbc9]">
            {isLoading ? "Loading..." : user?.username ?? "Not signed in"}
          </span>
          <button
            onClick={signOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-5.5 w-5.5 flex-shrink-0 items-center justify-center rounded-[5px] text-[#6c7467] hover:bg-[#2c342e] hover:text-danger"
          >
            <LogOutIcon size={12} />
          </button>
        </Link>
      </div>
    </aside>
  );
}
