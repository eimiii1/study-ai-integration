import { useNavigate } from "react-router";
import { LogOutIcon } from "../components/icons";
import { PageHeader } from "../components/PageHeader";
import { ErrorNotice, LoadingText } from "../components/Status";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useDecks } from "../hooks/useDecks";
import { clearToken } from "../lib/api";
import { ghostButton } from "../lib/ui";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isLoading, error } = useCurrentUser();
  const { decks, isLoading: decksLoading } = useDecks();

  const signOut = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  const deckCount = decks.filter((d) => d.parent_deck_id === null).length;
  const subdeckCount = decks.length - deckCount;
  const initial = (user?.username ?? user?.email ?? "?").charAt(0).toUpperCase();

  return (
    <>
      <PageHeader title="Profile">
        <button className={ghostButton + " hover:!text-danger"} onClick={signOut}>
          <LogOutIcon size={13} />
          <span>Sign out</span>
        </button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {isLoading ? (
          <LoadingText label="Loading profile..." />
        ) : error || !user ? (
          <ErrorNotice message={error ?? "Couldn't load your profile."} />
        ) : (
          <div className="flex max-w-120 flex-col gap-3">
            <section className="flex items-center gap-3 rounded-[10px] border border-line bg-panel p-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#c9655f] text-[17px] font-medium text-white">
                {initial}
              </span>
              <div className="min-w-0">
                <h1 className="m-0 truncate text-[16px] font-medium text-ink">
                  {user.username ?? user.email}
                </h1>
                <p className="m-0 mt-0.5 truncate text-[12px] text-ink-muted">{user.email}</p>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Decks", value: deckCount },
                { label: "Subdecks", value: subdeckCount },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[10px] border border-line bg-panel p-3.25"
                >
                  <p className="m-0 text-[11px] text-ink-faint">{stat.label}</p>
                  <p className="m-0 mt-1 text-[20px] font-medium text-ink">
                    {decksLoading ? "–" : stat.value}
                  </p>
                </div>
              ))}
            </section>

            <section className="rounded-[10px] border border-line bg-panel">
              {[
                { label: "Username", value: user.username ?? "—" },
                { label: "Email", value: user.email },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 border-b border-hairline px-3.25 py-2.5 last:border-b-0"
                >
                  <span className="text-[12px] text-ink-muted">{row.label}</span>
                  <span className="truncate text-[12.5px] text-ink">{row.value}</span>
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
    </>
  );
}
