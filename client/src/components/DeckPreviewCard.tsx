type DeckPreviewCardProps = {
  title: string;
  description: string | null;
  subdeckCount: number;
  cardCount: number;
};

export default function DeckPreviewCard({ title, description, subdeckCount, cardCount }: DeckPreviewCardProps) {
  return (
    <article className="group flex flex-col justify-between gap-4 rounded-2xl border border-line bg-paper p-5 transition hover:border-ink">
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="line-clamp-2 text-sm text-muted">
          {description || "No description yet."}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs font-medium text-muted">
          <span>{subdeckCount} subdecks</span>
          <span>{cardCount} cards</span>
        </div>
        <span className="text-sm font-medium text-ink opacity-0 transition group-hover:opacity-100">
          Open →
        </span>
      </div>
    </article>
  );
}