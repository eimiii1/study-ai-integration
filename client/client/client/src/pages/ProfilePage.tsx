import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckIcon, LogOutIcon, MailIcon, ProfileIcon, UserIcon } from "../components/icons";
import { PageHeader } from "../components/PageHeader";
import { ErrorNotice, LoadingText } from "../components/Status";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useDecks } from "../hooks/useDecks";
import { clearToken } from "../lib/api";
import { accentFor, dangerGhostButton } from "../lib/ui";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isLoading, error } = useCurrentUser();
  const { decks, isLoading: decksLoading } = useDecks();
  const [copied, setCopied] = useState(false);

  const signOut = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  const copyEmail = async () => {
    if (!user?.email) return;
    try {
      await navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied by the browser; fail quietly.
    }
  };

  const topLevel = decks.filter((d) => d.parent_deck_id === null);
  const deckCount = topLevel.length;
  const subdeckCount = decks.length - deckCount;
  const cardCount = decks.reduce((sum, d) => sum + d.card_count, 0);
  const initial = (user?.username ?? user?.email ?? "?").charAt(0).toUpperCase();
  const accent = accentFor(user?.id ?? 0);

  return (
    <>
      <PageHeader title="Profile">
        <button className={dangerGhostButton} onClick={signOut}>
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
            <section className="relative overflow-hidden rounded-[12px] border border-line bg-panel p-5">
              <span
                className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full opacity-25 blur-2xl"
                style={{ background: `var(--color-${accent})` }}
              />
              <div className="relative flex items-center gap-3.5">
                <span
                  className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-full text-[19px] font-semibold text-white shadow-[var(--shadow-soft)]"
                  style={{ background: `var(--color-${accent})` }}
                >
                  {initial}
                </span>
                <div className="min-w-0">
                  <h1 className="m-0 truncate text-[17px] font-semibold text-ink">
                    {user.username ?? user.email}
                  </h1>
                  <button
                    onClick={copyEmail}
                    className="group mt-0.5 flex items-center gap-1.25 text-[12.5px] text-ink-muted hover:text-ink"
                  >
                    <MailIcon size={12} />
                    <span className="truncate">{user.email}</span>
                    {copied && (
                      <span className="flex items-center gap-0.5 text-[11px] text-green">
                        <CheckIcon size={11} /> Copied
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-3 gap-2.5">
              {[
                { label: "Decks", value: deckCount },
                { label: "Subdecks", value: subdeckCount },
                { label: "Flashcards", value: cardCount },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[10px] border border-line bg-panel p-3.25 transition-colors hover:border-line-strong"
                >
                  <p className="m-0 text-[11px] text-ink-faint">{stat.label}</p>
                  <p className="m-0 mt-1 text-[19px] font-semibold text-ink">
                    {decksLoading ? "–" : stat.value}
                  </p>
                </div>
              ))}
            </section>

            <section className="overflow-hidden rounded-[10px] border border-line bg-panel">
              <p className="m-0 border-b border-hairline px-3.25 py-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                Account
              </p>
              {[
                { label: "Username", value: user.username ?? "—", icon: <UserIcon size={13} /> },
                { label: "Email", value: user.email, icon: <MailIcon size={13} /> },
                { label: "User ID", value: `#${user.id}`, icon: <ProfileIcon size={13} /> },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 border-b border-hairline px-3.25 py-2.75 last:border-b-0"
                >
                  <span className="flex items-center gap-2 text-[12px] text-ink-muted">
                    <span className="text-ink-faint">{row.icon}</span>
                    {row.label}
                  </span>
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
