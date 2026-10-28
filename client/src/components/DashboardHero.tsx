import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { CardIcon, DecksIcon, RoomIcon } from "./icons";
import type { Deck } from "../types";

function timeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const todayLabel = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

// The homepage, reworked as a plain dashboard: a greeting, a few honest
// stats pulled straight from the decks you actually have, and three quick
// jumps into the three things this app does — no chat, no AI assistant
// chrome, nothing you have to type into.
export function DashboardHero({ decks }: { decks: Deck[] }) {
  const { user } = useCurrentUser();
  const navigate = useNavigate();

  const topLevel = decks.filter((d) => d.parent_deck_id === null);
  const deckCount = topLevel.length;
  const subdeckCount = decks.length - deckCount;
  const cardCount = decks.reduce((sum, d) => sum + d.card_count, 0);
  const firstDeckId = decks[0]?.id;

  return (
    <section className="border-b-[1.5px] border-ink bg-panel px-7 pb-6 pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono m-0 text-[10.5px] tracking-[0.04em] text-ink-faint">{todayLabel}</p>
          <h1 className="font-display m-0 mt-1 text-[30px] font-medium italic leading-tight text-ink">
            {user ? `${timeOfDayGreeting()}, ${user.username}.` : `${timeOfDayGreeting()}.`}
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/decks", { state: { openCreate: true } })}
            className="flex items-center gap-1.5 rounded-[6px] border-[1.5px] border-ink bg-violet px-3.5 py-2 text-[12.5px] font-semibold text-[#fbf8ee] shadow-[var(--shadow-sticker-sm)] hover:bg-violet-strong active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            New deck
          </button>
          <button
            onClick={() => firstDeckId && navigate(`/decks/${firstDeckId}/study`, { state: { autoStart: true } })}
            disabled={!firstDeckId}
            className="flex items-center gap-1.5 rounded-[6px] border-[1.5px] border-line-strong bg-panel px-3.5 py-2 text-[12.5px] font-medium text-ink-dim hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
          >
            Study now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatTile icon={<DecksIcon size={15} />} label="Decks" value={deckCount} accent="violet" />
        <StatTile icon={<CardIcon size={15} />} label="Flashcards" value={cardCount} accent="teal" />
        <button
          onClick={() => navigate("/room")}
          className="group relative flex items-center justify-between gap-2 overflow-hidden rounded-[8px] border-[1.5px] border-ink bg-orange/12 px-4 py-3.5 text-left shadow-[var(--shadow-sticker)] transition-transform hover:-translate-y-[1px]"
        >
          <span>
            <span className="mb-0.5 flex items-center gap-1.5 text-[11px] text-ink-muted">
              <RoomIcon size={13} />
              My Room
            </span>
            <span className="font-display text-[14px] italic text-ink">See your furniture</span>
          </span>
          <span
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink text-[13px] text-ink transition-transform group-hover:translate-x-0.5"
            style={{ background: "var(--color-orange)" }}
          >
            ›
          </span>
        </button>
      </div>

      {subdeckCount > 0 && (
        <p className="m-0 mt-2.5 text-[11.5px] text-ink-faint">
          Plus {subdeckCount} subdeck{subdeckCount === 1 ? "" : "s"} nested inside those.
        </p>
      )}
    </section>
  );
}

function StatTile({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[8px] border-[1.5px] border-ink bg-elevated px-4 py-3.5 shadow-[var(--shadow-sticker)]">
      <div>
        <p className="m-0 flex items-center gap-1.5 text-[11px] text-ink-muted">
          <span style={{ color: `var(--color-${accent})` }}>{icon}</span>
          {label}
        </p>
        <p className="font-display m-0 mt-0.5 text-[26px] font-medium leading-none text-ink">{value}</p>
      </div>
    </div>
  );
}
