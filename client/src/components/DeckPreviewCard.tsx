type DeckPreviewCardProps = {
  title: string;
  description: string | null;
};

export default function DeckPreviewCard({ title, description }: DeckPreviewCardProps) {
  return (
    <article className="group flex flex-col justify-between gap-4 rounded-2xl border border-line bg-paper p-5 transition hover:border-ink">
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="line-clamp-2 text-sm text-muted">
          {description || "No description yet."}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">Deck</span>
        <span className="text-sm font-medium text-ink opacity-0 transition group-hover:opacity-100">
          Open →
        </span>
      </div>
    </article>
  );
}