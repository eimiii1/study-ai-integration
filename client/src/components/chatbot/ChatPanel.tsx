import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { apiFetch, apiUpload } from "../../lib/api";
import { ghostButton, inputClass, primaryButton, secondaryButton } from "../../lib/ui";
import type { ChatMessage } from "../../types";
import { ChatbotIcon, ChevronDownIcon, UploadIcon } from "../icons";
import { ChatBubble } from "./ChatBubble";

const MAX_PDF_BYTES = 15 * 1024 * 1024;

async function createDeckFromPdf(file: File): Promise<{ deckId: number; title: string; cardCount: number }> {
  const formData = new FormData();
  formData.append("pdf", file);
  const data = await apiUpload("/api/chatbot/deck-from-pdf", formData);

  const deckId = typeof data?.id === "number" ? data.id : null;
  const cardCount = typeof data?.card_count === "number" ? data.card_count : 0;
  if (!deckId || cardCount === 0) {
    throw new Error("The deck came back but didn't look complete. Please try again.");
  }

  return {
    deckId,
    cardCount,
    title: typeof data?.title === "string" && data.title ? data.title : file.name.replace(/\.pdf$/i, ""),
  };
}

let messageCounter = 0;
const newId = () => `m${Date.now()}-${messageCounter++}`;

const INTRO_TEXT =
  "Hey! I'm your study chatbot — ask me anything, or attach a PDF with the PDF button and " +
  "I'll read through its definitions and save them as flashcards in a new deck, ready to " +
  "quiz on (with the usual furniture rewards) just like any deck you build by hand.";

const INTRO_MESSAGE: ChatMessage = {
  id: newId(),
  role: "bot",
  kind: "text",
  text: INTRO_TEXT,
};

export function ChatPanel() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE]);
  const [textValue, setTextValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  // Starts as a small box on the home page, like a landing search bar — it
  // only takes over the screen once the user actually sends something (a
  // message or a PDF), not just for showing up on the page.
  const [isExpanded, setIsExpanded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));

  const appendMessage = (message: ChatMessage) => {
    setMessages((m) => [...m, message]);
    scrollToBottom();
  };

  const replaceMessage = (id: string, message: ChatMessage) => {
    setMessages((m) => m.map((msg) => (msg.id === id ? message : msg)));
    scrollToBottom();
  };

  const isBusy = isSending || isCreatingDeck;

  const handleSendText = async (e: FormEvent) => {
    e.preventDefault();
    const text = textValue.trim();
    if (!text || isBusy) return;
    setTextValue("");
    setIsExpanded(true);

    // Only real back-and-forth turns go to the model as conversation history —
    // file/pending/error/quiz messages are UI-only, not something the model
    // needs to see.
    const history = messages
      .filter((m) => m.kind === "text")
      .map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
    history.push({ role: "user", content: text });

    appendMessage({ id: newId(), role: "user", kind: "text", text });
    const pendingId = newId();
    appendMessage({ id: pendingId, role: "bot", kind: "pending", text: "Thinking..." });

    setIsSending(true);
    try {
      const data = await apiFetch("/api/chatbot/message", {
        method: "POST",
        body: JSON.stringify({ messages: history }),
      });
      const reply = typeof data?.reply === "string" ? data.reply : null;
      if (!reply) throw new Error("Got an empty reply. Please try again.");
      replaceMessage(pendingId, { id: pendingId, role: "bot", kind: "text", text: reply });
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Couldn't reach the chatbot.";
      replaceMessage(pendingId, { id: pendingId, role: "bot", kind: "error", text });
    } finally {
      setIsSending(false);
    }
  };

  const handleFile = async (file: File) => {
    if (isBusy) return;
    setIsExpanded(true);

    const looksLikePdf = file.name.toLowerCase().endsWith(".pdf") && (!file.type || file.type === "application/pdf");
    if (!looksLikePdf) {
      appendMessage({ id: newId(), role: "user", kind: "file", fileName: file.name });
      appendMessage({
        id: newId(),
        role: "bot",
        kind: "error",
        text: "That doesn't look like a PDF — only .pdf files are supported.",
      });
      return;
    }

    if (file.size > MAX_PDF_BYTES) {
      appendMessage({ id: newId(), role: "user", kind: "file", fileName: file.name });
      appendMessage({ id: newId(), role: "bot", kind: "error", text: "That PDF is too large — the limit is 15MB." });
      return;
    }

    appendMessage({ id: newId(), role: "user", kind: "file", fileName: file.name });
    const pendingId = newId();
    appendMessage({
      id: pendingId,
      role: "bot",
      kind: "pending",
      text: `Reading ${file.name} and pulling out its definitions...`,
    });

    setIsCreatingDeck(true);
    try {
      const { deckId, title, cardCount } = await createDeckFromPdf(file);
      replaceMessage(pendingId, { id: pendingId, role: "bot", kind: "deck", deckId, title, cardCount });
      // Jump straight into the quiz, same as the dashboard's "Study now" —
      // the deck itself stays in Your Decks either way.
      navigate(`/decks/${deckId}/study`, { state: { autoStart: true } });
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Couldn't build a deck from that PDF.";
      replaceMessage(pendingId, { id: pendingId, role: "bot", kind: "error", text });
    } finally {
      setIsCreatingDeck(false);
    }
  };

  const onFileInputChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const fileInput = (
    <input type="file" accept="application/pdf" ref={fileInputRef} onChange={onFileInputChange} className="hidden" />
  );

  const composer = (
    <form onSubmit={handleSendText} className="mx-auto flex max-w-150 items-center gap-2">
      {fileInput}
      <button
        type="button"
        className={secondaryButton}
        onClick={() => fileInputRef.current?.click()}
        disabled={isBusy}
      >
        <UploadIcon size={13} />
        <span>PDF</span>
      </button>
      <input
        className={inputClass + " flex-1"}
        placeholder={isDragging ? "Drop the PDF to upload it..." : "Message the chatbot, or attach a PDF..."}
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        disabled={isBusy}
        autoFocus={isExpanded}
      />
      <button className={primaryButton} type="submit" disabled={isBusy || !textValue.trim()}>
        Send
      </button>
    </form>
  );

  const dropProps = {
    onDragOver: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop,
  };

  if (!isExpanded) {
    // The home-page landing state: a compact card, not a takeover — decks
    // and stats below it stay visible and scrollable.
    return (
      <div {...dropProps}>
        <div className="mx-auto max-w-150 rounded-[10px] border-[1.5px] border-ink bg-panel p-4 shadow-[var(--shadow-sticker)]">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] border-[1.5px] border-ink bg-violet text-[#fbf8ee]">
              <ChatbotIcon size={14} />
            </span>
            <p className="m-0 text-[12.5px] leading-relaxed text-ink-dim">{INTRO_TEXT}</p>
          </div>
          {composer}
        </div>
      </div>
    );
  }

  return (
    <div {...dropProps}>
      {/* left-52 keeps the sidebar (w-52) visible — this covers the rest of the
          screen, not the whole browser viewport. */}
      <div className="fixed inset-y-0 left-52 right-0 z-30 flex flex-col bg-app">
        <div className="flex h-[46px] flex-shrink-0 items-center justify-between border-b-[1.5px] border-ink px-6">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
            <ChatbotIcon size={14} />
            <span>Chatbot</span>
          </div>
          <button className={ghostButton} onClick={() => setIsExpanded(false)}>
            <ChevronDownIcon size={13} />
            <span>Minimize</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mx-auto flex max-w-150 flex-col gap-3">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                onStudyDeck={(deckId) => navigate(`/decks/${deckId}/study`, { state: { autoStart: true } })}
                onViewDeck={(deckId) => navigate(`/decks/${deckId}`)}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="flex-shrink-0 border-t-[1.5px] border-line bg-app px-6 py-3">{composer}</div>
      </div>
    </div>
  );
}
