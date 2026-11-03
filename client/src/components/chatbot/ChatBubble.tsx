import type { ChatMessage } from "../../types";
import { primaryButton, secondaryButton } from "../../lib/ui";
import { ArrowRightIcon, ChatbotIcon, DecksIcon, NoteIcon, XIcon } from "../icons";

function BotAvatar() {
  return (
    <span className="flex h-6.5 w-6.5 flex-shrink-0 items-center justify-center rounded-[6px] border-[1.5px] border-ink bg-violet text-[#fbf8ee]">
      <ChatbotIcon size={13} />
    </span>
  );
}

export function ChatBubble({
  message,
  onStudyDeck,
  onViewDeck,
}: {
  message: ChatMessage;
  onStudyDeck: (deckId: number) => void;
  onViewDeck: (deckId: number) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-[10px] border-[1.5px] border-ink bg-panel px-3 py-2 text-[12.5px] text-ink shadow-[var(--shadow-sticker-sm)]">
          {message.kind === "file" ? (
            <span className="flex items-center gap-1.5">
              <NoteIcon size={13} className="flex-shrink-0 text-ink-muted" />
              <span className="truncate">{message.fileName}</span>
            </span>
          ) : (
            message.text
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <BotAvatar />
      <div className="min-w-0 max-w-[85%] flex-1">
        {message.kind === "text" && (
          <div className="rounded-[10px] border border-line bg-panel px-3 py-2 text-[12.5px] leading-relaxed text-ink-dim">
            {message.text}
          </div>
        )}

        {message.kind === "pending" && (
          <div className="flex items-center gap-2 rounded-[10px] border border-line bg-panel px-3 py-2 text-[12.5px] text-ink-muted">
            <span className="h-3 w-3 flex-shrink-0 animate-spin rounded-full border-[1.5px] border-ink-faint border-t-violet" />
            {message.text}
          </div>
        )}

        {message.kind === "error" && (
          <div className="flex items-center gap-1.5 rounded-[10px] border border-danger/30 bg-danger/10 px-3 py-2 text-[12.5px] text-danger">
            <XIcon size={13} className="flex-shrink-0" />
            {message.text}
          </div>
        )}

        {message.kind === "deck" && (
          <div className="flex animate-fade-in-up items-center gap-3 rounded-[10px] border border-line bg-panel px-3.5 py-3 shadow-[var(--shadow-soft)]">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[6px] border-[1.5px] border-ink bg-orange/20 text-orange">
              <DecksIcon size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-[12.5px] font-medium text-ink">{message.title}</p>
              <p className="m-0 text-[11px] text-ink-muted">
                {message.cardCount} flashcard{message.cardCount === 1 ? "" : "s"} saved as a deck
              </p>
            </div>
            <button className={secondaryButton} onClick={() => onViewDeck(message.deckId)}>
              <span>View deck</span>
            </button>
            <button className={primaryButton} onClick={() => onStudyDeck(message.deckId)}>
              <span>Study</span>
              <ArrowRightIcon size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
