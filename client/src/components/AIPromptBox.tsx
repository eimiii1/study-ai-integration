const actions = [
  { label: "Upload", icon: "upload" },
  { label: "Paste", icon: "paste" },
  { label: "YouTube", icon: "youtube" },
];

const icons = {
  upload: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 16V4M7 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  paste: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="7" y="4" width="10" height="4" rx="1" />
      <rect x="5" y="8" width="14" height="13" rx="1.5" />
    </svg>
  ),
  youtube: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </svg>
  ),
};

export default function AIPromptBox() {
  return (
    <section className="flex flex-col items-center gap-8 pt-6 text-center">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[1.75rem] font-semibold tracking-tight">What shall we study?</h1>
        <p className="text-sm text-muted">Describe a topic and I'll build a deck for it.</p>
      </div>

      <div className="w-full max-w-xl rounded-2xl border border-line bg-canvas/40 p-4 transition focus-within:border-ink/30">
        <textarea
          rows={2}
          placeholder="I want to study..."
          className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted"
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-muted transition hover:border-ink hover:text-ink"
              >
                {icons[a.icon as keyof typeof icons]}
                {a.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-paper transition hover:bg-ink/85"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}