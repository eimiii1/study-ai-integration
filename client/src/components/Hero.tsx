import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { quickActions } from "../data";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  ArrowRightIcon,
  AtIcon,
  BellIcon,
  IconIndex,
  PlusIcon,
  SkillsIcon,
} from "./icons";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

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
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isExpanded = messages.length > 0;

  // Keep the thread scrolled to the latest message as it grows.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const sendMessage = async (raw: string) => {
    const text = raw.trim();
    if (!text || isSending) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);
    setInput("");
    setIsSending(true);

    // TODO: swap this for the real chat request once the AI backend exists.
    // For now it's just a prompt box: the thread animates, Rune replies with a stub.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "I'm not connected yet — chat replies are coming soon.",
      },
    ]);
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuickAction = (label: string) => {
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
              {user ? `Good morning, ${user.username}` : "Good morning"}
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
                      : "mr-auto bg-panel text-ink-dim")
                  }
                >
                  {m.text}
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
          disabled={isSending}
          className="w-full border-none bg-transparent pb-5 text-[13px] text-ink outline-none placeholder:text-ink-faint disabled:opacity-60"
          placeholder="Example: Quiz me on my Biology deck's mitosis cards…"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex h-6.5 w-6.5 items-center justify-center rounded-[6px] text-ink-muted hover:bg-elevated hover:text-ink-dim">
              <PlusIcon size={15} />
            </button>
            <button className="flex h-6.5 w-6.5 items-center justify-center rounded-[6px] text-ink-muted hover:bg-elevated hover:text-ink-dim">
              <AtIcon size={15} />
            </button>
            <button className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-elevated hover:text-ink-dim">
              <SkillsIcon size={13} />
              <span>Skills</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.25 text-[12px] text-ink-muted hover:bg-elevated hover:text-ink-dim">
              <span className="flex items-center">
                {["violet", "pink", "orange"].map((c, i) => (
                  <span
                    key={c}
                    className="h-2.25 w-2.25 rounded-full border-[1.5px] border-input"
                    style={{ background: `var(--color-${c})`, marginLeft: i === 0 ? 0 : -4 }}
                  />
                ))}
              </span>
              <span>Model Fusion</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex h-6.5 w-6.5 items-center justify-center rounded-[6px] text-ink-muted hover:bg-elevated hover:text-ink-dim">
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
