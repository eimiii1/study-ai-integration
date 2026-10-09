type DeckPreviewCardProps = {
  title: string;
};

export default function DeckPreviewCard({ title }: DeckPreviewCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-5 transition hover:border-ink">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
    </article>
  );
}