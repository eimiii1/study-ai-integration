import { useState } from "react";
import { Navigate, useOutletContext } from "react-router";
import { DeckTile } from "../../components/DeckTile";
import { PlusIcon } from "../../components/icons";
import { InlineForm } from "../../components/InlineForm";
import { ghostButton } from "../../lib/ui";
import type { DeckOutletContext } from "../../types";

export function SubdecksTab() {
  const { deck, subdecks, createDeck } = useOutletContext<DeckOutletContext>();
  const [isAdding, setIsAdding] = useState(false);

  // Subdecks can't nest further; bounce anyone who types the URL by hand.
  if (deck.parent_deck_id !== null) {
    return <Navigate to={`/decks/${deck.id}`} replace />;
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 text-[13px] font-medium text-ink">
          Subdecks <span className="font-normal text-ink-faint">({subdecks.length})</span>
        </h2>
        {!isAdding && (
          <button className={ghostButton} onClick={() => setIsAdding(true)}>
            <PlusIcon size={13} />
            <span>New subdeck</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-4 max-w-120">
          <InlineForm
            fields={[
              { name: "title", label: "Title", required: true },
              { name: "description", label: "Description", multiline: true },
            ]}
            submitLabel="Create subdeck"
            onSubmit={async (v) => {
              await createDeck(v.title, v.description, deck.id);
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {subdecks.length === 0 ? (
        <p className="m-0 text-[12px] text-ink-faint">
          No subdecks yet — split this deck into smaller topics.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3 xl:grid-cols-4">
          {subdecks.map((sub) => (
            <DeckTile key={sub.id} deck={sub} />
          ))}
        </div>
      )}
    </section>
  );
}
