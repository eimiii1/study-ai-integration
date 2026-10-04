import { Link } from "react-router";
import DeckPreviewCard from "./DeckPreviewCard";

const mockDecks = [
  { id: 1, name: "Data Structures", subdeckCount: 4, cardCount: 32, lastStudied: "Studied yesterday" },
  { id: 2, name: "Biology", subdeckCount: 2, cardCount: 18, lastStudied: "Studied 3 days ago" },
  { id: 3, name: "Spanish Verbs", subdeckCount: 1, cardCount: 45, lastStudied: "Studied last week" },
];

export default function DeckPreviewGrid() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">Recent decks</h2>
        <Link to="/decks" className="text-sm text-gilt hover:underline">
          See all decks
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mockDecks.map((deck) => (
          <DeckPreviewCard
            key={deck.id}
            name={deck.name}
            subdeckCount={deck.subdeckCount}
            cardCount={deck.cardCount}
            lastStudied={deck.lastStudied}
          />
        ))}
      </div>
    </section>
  );
}