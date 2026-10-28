import { useState } from "react";
import { useLocation } from "react-router";
import { DeckTile } from "../../components/DeckTile";
import { PlusIcon } from "../../components/icons";
import { InlineForm } from "../../components/InlineForm";
import { PageHeader } from "../../components/PageHeader";
import { ErrorNotice, LoadingText } from "../../components/Status";
import { useDecks } from "../../hooks/useDecks";
import { primaryButton } from "../../lib/ui";

export function DecksPage() {
  const { decks, isLoading, error, refetch, createDeck } = useDecks();
  // The dashboard's "New deck" button lands here with this
  // flag set so the form is already open instead of making you click again.
  const location = useLocation();
  const [isCreating, setIsCreating] = useState(
    Boolean((location.state as { openCreate?: boolean } | null)?.openCreate),
  );

  const topLevelDecks = decks.filter((deck) => deck.parent_deck_id === null);

  return (
    <>
      <PageHeader title="Decks">
        {!isCreating && (
          <button className={primaryButton} onClick={() => setIsCreating(true)}>
            <PlusIcon size={13} />
            <span>New deck</span>
          </button>
        )}
      </PageHeader>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {isCreating && (
          <div className="mb-5 max-w-120">
            <InlineForm
              fields={[
                { name: "title", label: "Title", placeholder: "Organic Chemistry — Unit 4", required: true, maxLength: 120 },
                { name: "description", label: "Description", placeholder: "What's this deck about?", multiline: true, maxLength: 500 },
              ]}
              submitLabel="Create deck"
              onSubmit={async (v) => {
                await createDeck(v.title, v.description);
                setIsCreating(false);
              }}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        )}

        {isLoading ? (
          <LoadingText label="Loading decks..." />
        ) : error ? (
          <ErrorNotice message={error} onRetry={refetch} />
        ) : (
          <>
            <h2 className="m-0 mb-3 text-[13px] font-medium text-ink">
              All decks <span className="font-normal text-ink-faint">({topLevelDecks.length})</span>
            </h2>
            {topLevelDecks.length === 0 ? (
              <p className="m-0 text-[12px] text-ink-faint">
                No decks yet — hit “New deck” to create your first one.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3 xl:grid-cols-4">
                {topLevelDecks.map((deck) => (
                  <DeckTile key={deck.id} deck={deck} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
