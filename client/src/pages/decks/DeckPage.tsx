import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router";
import { PencilIcon, TrashIcon } from "../../components/icons";
import { InlineForm } from "../../components/InlineForm";
import { PageHeader } from "../../components/PageHeader";
import { ErrorNotice, LoadingText } from "../../components/Status";
import { useDecks } from "../../hooks/useDecks";
import { ghostButton } from "../../lib/ui";
import type { DeckOutletContext } from "../../types";

// Keyed by deck id so navigating deck -> subdeck starts from a clean slate
// (edit form closed, tabs refetched) instead of reusing the previous deck's state.
export function DeckPage() {
  const { deckId } = useParams();
  return <DeckView key={deckId} deckId={Number(deckId)} />;
}

function DeckView({ deckId }: { deckId: number }) {
  const navigate = useNavigate();
  const { decks, isLoading, error, refetch, createDeck, updateDeck, deleteDeck } = useDecks();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const deck = decks.find((d) => d.id === deckId);

  if (isLoading || isDeleting) {
    return (
      <>
        <PageHeader title="Decks" />
        <div className="px-5 py-6">
          <LoadingText label={isDeleting ? "Deleting deck..." : "Loading deck..."} />
        </div>
      </>
    );
  }

  if (error || !deck) {
    return (
      <>
        <PageHeader title="Decks" />
        <div className="px-5 py-6">
          {error ? (
            <ErrorNotice message={error} onRetry={refetch} />
          ) : (
            <>
              <p className="mb-2 mt-0 text-[12px] text-ink-muted">Deck not found.</p>
              <Link to="/decks" className="text-[12px] text-ink-dim hover:text-ink">
                Back to decks
              </Link>
            </>
          )}
        </div>
      </>
    );
  }

  const isSubdeck = deck.parent_deck_id !== null;
  const parent = isSubdeck ? decks.find((d) => d.id === deck.parent_deck_id) : undefined;
  const subdecks = decks.filter((d) => d.parent_deck_id === deck.id);

  const handleDelete = async () => {
    const nested = isSubdeck ? "" : "subdecks, ";
    if (
      !window.confirm(
        `Delete "${deck.title}"? This also deletes its ${nested}flashcards, notes and quiz, and can't be undone.`,
      )
    ) {
      return;
    }

    setActionError(null);
    setIsDeleting(true);
    try {
      await deleteDeck(deck.id);
      navigate(isSubdeck ? `/decks/${deck.parent_deck_id}` : "/decks", { replace: true });
    } catch (err: unknown) {
      setIsDeleting(false);
      setActionError(err instanceof Error ? err.message : "Failed to delete deck.");
    }
  };

  const base = `/decks/${deck.id}`;
  const tabs = [
    { label: "Flashcards", to: base },
    { label: "Notes", to: `${base}/notes` },
    // Subdecks can't have their own subdecks.
    ...(isSubdeck ? [] : [{ label: "Subdecks", to: `${base}/subdecks` }]),
    { label: "Study", to: `${base}/study` },
  ];

  const crumb = "text-ink-muted no-underline hover:text-ink";

  return (
    <>
      <PageHeader
        title={
          <>
            <Link to="/decks" className={crumb}>
              Decks
            </Link>
            {parent && (
              <>
                <span className="text-ink-faint">/</span>
                <Link to={`/decks/${parent.id}`} className={crumb + " truncate"}>
                  {parent.title}
                </Link>
              </>
            )}
            <span className="text-ink-faint">/</span>
            <span className="truncate">{deck.title}</span>
          </>
        }
      >
        {/* Backend only allows editing top-level decks. */}
        {!isSubdeck && !isEditing && (
          <button className={ghostButton} onClick={() => setIsEditing(true)}>
            <PencilIcon size={13} />
            <span>Edit</span>
          </button>
        )}
        <button className={ghostButton + " hover:!text-danger"} onClick={handleDelete}>
          <TrashIcon size={13} />
          <span>Delete</span>
        </button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pb-3 pt-6">
          {isEditing ? (
            <div className="max-w-120">
              <InlineForm
                fields={[
                  { name: "title", label: "Title", required: true, maxLength: 120 },
                  { name: "description", label: "Description", multiline: true, maxLength: 500 },
                ]}
                initialValues={{ title: deck.title, description: deck.description }}
                submitLabel="Save changes"
                onSubmit={async (v) => {
                  await updateDeck(deck.id, v.title, v.description);
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <>
              <h1 className="font-display m-0 text-[22px] font-medium tracking-tight text-ink">{deck.title}</h1>
              <p className="m-0 mt-1.5 max-w-180 text-[13px] leading-relaxed text-ink-muted">
                {deck.description || "No description yet."}
              </p>
            </>
          )}
          {actionError && <p className="m-0 mt-3 text-[12px] text-danger">{actionError}</p>}
        </div>

        <div className="flex items-center gap-0.5 border-b border-hairline px-5 pb-3">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end
              className={({ isActive }) =>
                "rounded-[7px] px-2.5 py-1.5 text-[12.5px] no-underline " +
                (isActive ? "bg-elevated text-ink" : "text-ink-muted hover:text-ink")
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        <div className="px-5 py-5">
          <Outlet context={{ deck, subdecks, createDeck } satisfies DeckOutletContext} />
        </div>
      </div>
    </>
  );
}
