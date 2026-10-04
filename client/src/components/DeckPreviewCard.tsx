type DeckPreviewCardProps = {
  name: string;
  subdeckCount: number;
  cardCount: number;
  lastStudied: string;
};

export default function DeckPreviewCard({ name, subdeckCount, cardCount, lastStudied }: DeckPreviewCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-sm bg-inkwell p-6 text-chalk transition hover:-translate-y-0.5 hover:ring-1 hover:ring-gilt">
      <h3 className="font-serif text-xl">{name}</h3>
      <div className="flex gap-4 text-sm text-chalk/60">
        <span>{subdeckCount} subdecks</span>
        <span>{cardCount} cards</span>
      </div>
      <span className="mt-auto text-xs text-chalk/40">{lastStudied}</span>
    </article>
  );
}