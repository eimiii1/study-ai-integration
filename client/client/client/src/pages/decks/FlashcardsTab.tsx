import { useState } from "react";
import { useLocation, useOutletContext } from "react-router";
import { PencilIcon, PlusIcon, TrashIcon } from "../../components/icons";
import { InlineForm, type FormField } from "../../components/InlineForm";
import { ErrorNotice, LoadingText } from "../../components/Status";
import { useDeckItems } from "../../hooks/useDeckItems";
import { ghostButton, iconButton } from "../../lib/ui";
import type { DeckOutletContext, Flashcard, FlashcardInput } from "../../types";

const fields: FormField[] = [
  { name: "front", label: "Front", placeholder: "Question or term", multiline: true, required: true, maxLength: 300 },
  { name: "back", label: "Back", placeholder: "Answer or definition", multiline: true, required: true, maxLength: 300 },
];

export function FlashcardsTab() {
  const { deck } = useOutletContext<DeckOutletContext>();
  const { items: cards, isLoading, error, refetch, create, update, remove } =
    useDeckItems<Flashcard, FlashcardInput>(deck.id, "flashcards");

  // Hero can route here asking to add a flashcard straight away.
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(
    Boolean((location.state as { openAdd?: boolean } | null)?.openAdd),
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this flashcard?")) return;
    setActionError(null);
    try {
      await remove(id);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to delete flashcard.");
    }
  };

  if (isLoading) return <LoadingText label="Loading flashcards..." />;
  if (error) return <ErrorNotice message={error} onRetry={refetch} />;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 text-[13px] font-medium text-ink">
          Flashcards <span className="font-normal text-ink-faint">({cards.length})</span>
        </h2>
        {!isAdding && (
          <button className={ghostButton} onClick={() => setIsAdding(true)}>
            <PlusIcon size={13} />
            <span>Add flashcard</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-4 max-w-120">
          <InlineForm
            fields={fields}
            submitLabel="Add flashcard"
            onSubmit={async (v) => {
              await create({ front: v.front, back: v.back });
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {actionError && <p className="m-0 mb-3 text-[12px] text-danger">{actionError}</p>}

      {cards.length === 0 ? (
        <p className="m-0 text-[12px] text-ink-faint">
          No flashcards yet — add one to start building this deck.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) =>
            editingId === card.id ? (
              <InlineForm
                key={card.id}
                fields={fields}
                initialValues={{ front: card.front, back: card.back }}
                submitLabel="Save changes"
                onSubmit={async (v) => {
                  await update(card.id, { front: v.front, back: v.back });
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <article
                key={card.id}
                className="rounded-[10px] border border-line bg-panel p-3.25"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="m-0 whitespace-pre-wrap text-[12.5px] font-bold text-ink">
                    {card.front}
                  </p>
                  <div className="flex flex-shrink-0 items-center gap-0.5">
                    <button
                      className={iconButton}
                      aria-label="Edit flashcard"
                      onClick={() => setEditingId(card.id)}
                    >
                      <PencilIcon size={13} />
                    </button>
                    <button
                      className={iconButton + " hover:!text-danger"}
                      aria-label="Delete flashcard"
                      onClick={() => handleDelete(card.id)}
                    >
                      <TrashIcon size={13} />
                    </button>
                  </div>
                </div>
                <p className="m-0 whitespace-pre-wrap border-t border-hairline pt-2 text-[12px] leading-relaxed text-ink-dim">
                  {card.back}
                </p>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}
