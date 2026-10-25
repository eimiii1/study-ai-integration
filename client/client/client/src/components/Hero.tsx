import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router";
import { quickActions } from "../data";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useDecks } from "../hooks/useDecks";
import {
  ArrowRightIcon,
  AtIcon,
  BellIcon,
  IconIndex,
  PlusIcon,
  SkillsIcon,
  SparklesIcon,
} from "./icons";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

// "Good morning" regardless of the clock always read oddly at night, so this
// picks the right greeting from the local hour instead.
function timeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Prefills for the quick-action chips — they just drop a starter prompt
// into the box, same as clicking a suggestion on any AI chat UI.
const QUICK_ACTION_PROMPTS: Record<string, string> = {
  "Create a deck": "Create a new deck for me about ",
  "Generate a quiz": "Generate a quiz from my ",
  "Add flashcard": "Add a flashcard to ",
  "Add note": "Add a note to ",
  "Upload notes": "Here are some notes — turn them into flashcards: ",
};

export function Hero() {
  const { user } = useCurrentUser();
  const { decks } = useDecks();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isExpanded = messages.length > 0;

  // Keep the thread scrolled to the latest message as it grows.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  // There's no general-purpose chat endpoint on the backend yet (only the
  // per-deck quiz generation at /api/decks/:id/study is AI-backed), so this
  // is a real, deck-aware router rather than a free-form LLM call: it reads
  // the actual decks you have, matches a deck mentioned by name, and
  // navigates you straight into the right place (quiz / notes / flashcards).
  const sendMessage = async (raw: string) => {
    const text = raw.trim();
    if (!text || isSending) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);
    setInput("");
    setShowMentions(false);
    setIsSending(true);

    await new Promise((resolve) => setTimeout(resolve, 450));

    const lower = text.toLowerCase();
    const deck = decks.find((d) => d.title && lower.includes(d.title.toLowerCase()));

    let reply: string;
    let go: (() => void) | null = null;

    if (deck && /\bquiz\b/.test(lower)) {
      reply = `Opening the quiz for "${deck.title}"…`;
      go = () => navigate(`/decks/${deck.id}/study`, { state: { autoStart: true } });
    } else if (deck && /\bnote/.test(lower)) {
      reply = `Taking you to notes for "${deck.title}"…`;
      go = () => navigate(`/decks/${deck.id}/notes`, { state: { openAdd: true } });
    } else if (deck && /(flashcard|\bcard)/.test(lower)) {
      reply = `Taking you to flashcards for "${deck.title}"…`;
      go = () => navigate(`/decks/${deck.id}`, { state: { openAdd: true } });
    } else if (deck) {
      reply = `Opening "${deck.title}"…`;
      go = () => navigate(`/decks/${deck.id}`);
    } else if (/create.*deck|new deck/.test(lower)) {
      reply = "Let's set up a new deck.";
      go = () => navigate("/decks", { state: { openCreate: true } });
    } else if (decks.length === 0) {
      reply = "You don't have any decks yet — let's create your first one.";
      go = () => navigate("/decks", { state: { openCreate: true } });
    } else {
      const example = decks[0]?.title ?? "Organic Chemistry";
      reply = `Mention a deck by name and I'll jump there — try "quiz me on ${example}" or "add a note to ${example}".`;
    }

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text: reply }]);
    setIsSending(false);
    if (go) setTimeout(go, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // When exactly one deck exists there's no ambiguity, so these jump straight
  // in; otherwise they fall back to prefilling the box so you can name which
  // deck, which sendMessage above then resolves for real.
  const handleQuickAction = (label: string) => {
    if (label === "Create a deck") {
      navigate("/decks", { state: { openCreate: true } });
      return;
    }
    if (decks.length === 1) {
      const deck = decks[0];
      if (label === "Generate a quiz") {
        navigate(`/decks/${deck.id}/study`, { state: { autoStart: true } });
        return;
      }
      if (label === "Add flashcard") {
        navigate(`/decks/${deck.id}`, { state: { openAdd: true } });
        return;
      }
      if (label === "Add note") {
        navigate(`/decks/${deck.id}/notes`, { state: { openAdd: true } });
        return;
      }
    }
    setInput(QUICK_ACTION_PROMPTS[label] ?? "");
    inputRef.current?.focus();
  };

  return (
    <motion.section
      layout
      transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}
      className={
        "mx-auto flex w-full flex-col px-5 " +
        (isExpanded ? "h-[calc(100vh-82px)] max-w-180" : "items-center pb-9 pt-16")
      }
    >
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            key="greeting"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <h1 className="m-0 text-[23px] font-medium tracking-tight text-ink">
              {user ? `${timeOfDayGreeting()}, ${user.username}` : timeOfDayGreeting()}
            </h1>
            <p className="mb-6 mt-1.5 text-[13px] text-ink-muted">
              I'm Rune, what are we studying today?
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {isExpanded && (
        <div className="mb-1 flex justify-end">
          <button
            onClick={() => setMessages([])}
            className="text-[11px] text-ink-faint hover:text-ink-dim"
          >
            New chat
          </button>
        </div>
      )}

      {isExpanded && (
        <div ref={scrollRef} className="mx-auto w-full max-w-129 flex-1 overflow-y-auto pb-4">
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={
                    "max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed " +
                    (m.role === "user"
                      ? "ml-auto bg-elevated text-ink"
                      : "mr-auto flex items-start gap-1.75 bg-panel text-ink-dim")
                  }
                >
                  {m.role === "assistant" && (
                    <span className="mt-0.5 flex-shrink-0 text-violet">
                      <SparklesIcon size={12} />
                    </span>
                  )}
                  <span>{m.text}</span>
                </motion.div>
              ))}
              {isSending && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mr-auto flex items-center gap-1 rounded-xl bg-panel px-3.5 py-3 text-[13px] text-ink-faint"
                >
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <motion.div
        layout
        className="mx-auto w-full max-w-129 rounded-xl border border-line bg-input px-3.5 pb-2.5 pt-3.5"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowMentions(false), 120)}
          disabled={isSending}
          className="w-full border-none bg-transparent pb-5 text-[13px] text-ink outline-none placeholder:text-ink-faint disabled:opacity-60"
          placeholder="Example: Quiz me on my Biology deck's mitosis cards…"
        />
        <div className="flex items-center justify-between">
          <div className="relative flex items-center gap-1">
            <button
              disabled
              title="Not available yet"
              className="flex h-6.5 w-6.5 cursor-not-allowed items-center justify-center rounded-[6px] text-ink-faint opacity-55"
            >
              <PlusIcon size={15} />
            </button>
            <button
              type="button"
              onClick={() => setShowMentions((v) => !v)}
              disabled={decks.length === 0}
              title={decks.length === 0 ? "No decks yet" : "Mention a deck"}
              aria-label="Mention a deck"
              className={
                "flex h-6.5 w-6.5 items-center justify-center rounded-[6px] text-ink-muted hover:bg-elevated hover:text-ink-dim " +
                (decks.length === 0 ? "cursor-not-allowed opacity-40" : "") +
                (showMentions ? " bg-elevated text-ink-dim" : "")
              }
            >
              <AtIcon size={15} />
            </button>

            {showMentions && decks.length > 0 && (
              <div className="animate-fade-in-up absolute bottom-full left-0 mb-1.5 w-56 overflow-hidden rounded-lg border border-line bg-elevated shadow-[var(--shadow-lift)]">
                <p className="m-0 border-b border-hairline px-2.5 py-1.5 text-[10.5px] font-medium uppercase tracking-wide text-ink-faint">
                  Mention a deck
                </p>
                <div className="max-h-48 overflow-y-auto">
                  {decks
                    .filter((d) => d.parent_deck_id === null)
                    .map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setInput((prev) => (prev.trim() ? `${prev.trim()} ${d.title} ` : `${d.title} `));
                          setShowMentions(false);
                          inputRef.current?.focus();
                        }}
                        className="flex w-full items-center truncate px-2.5 py-1.75 text-left text-[12px] text-ink-dim hover:bg-panel hover:text-ink"
                      >
                        {d.title}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <button
              disabled
              title="Not available yet"
              className="flex cursor-not-allowed items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-faint opacity-55"
            >
              <SkillsIcon size={13} />
              <span>Skills</span>
            </button>
            <button
              disabled
              title="Not available yet"
              className="flex cursor-not-allowed items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-faint opacity-55"
            >
              <span className="flex items-center">
                {["violet", "pink", "orange"].map((c, i) => (
                  <span
                    key={c}
                    className="h-2.25 w-2.25 rounded-full border-[1.5px] border-input opacity-70"
                    style={{ background: `var(--color-${c})`, marginLeft: i === 0 ? 0 : -4 }}
                  />
                ))}
              </span>
              <span>Model Fusion</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled
              title="Not available yet"
              className="flex h-6.5 w-6.5 cursor-not-allowed items-center justify-center rounded-[6px] text-ink-faint opacity-55"
            >
              <BellIcon size={15} />
            </button>
            <button
              onClick={() => sendMessage(input)}
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              className="flex h-6.5 w-6.5 items-center justify-center rounded-[6px] bg-ink text-app disabled:opacity-40"
            >
              <ArrowRightIcon size={13} />
            </button>
          </div>
        </div>
      </motion.div>

      {!isExpanded && (
        <div className="mt-4 flex max-w-155 flex-wrap items-center justify-center gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.label)}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-panel px-2.75 py-1.75 text-[12px] text-ink-dim hover:bg-panel-hover hover:text-ink"
            >
              <IconIndex name={action.icon} size={14} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </motion.section>
  );
}
