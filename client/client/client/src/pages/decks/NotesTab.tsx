import { useState } from "react";
import { useLocation, useOutletContext } from "react-router";
import { PencilIcon, PlusIcon, TrashIcon } from "../../components/icons";
import { InlineForm, type FormField } from "../../components/InlineForm";
import { ErrorNotice, LoadingText } from "../../components/Status";
import { useDeckItems } from "../../hooks/useDeckItems";
import { ghostButton, iconButton } from "../../lib/ui";
import type { DeckOutletContext, Note, NoteInput } from "../../types";

const fields: FormField[] = [
  { name: "title", label: "Title", required: true, maxLength: 120 },
  { name: "content", label: "Content", multiline: true, required: true, maxLength: 4000 },
];

export function NotesTab() {
  const { deck } = useOutletContext<DeckOutletContext>();
  const { items: notes, isLoading, error, refetch, create, update, remove } =
    useDeckItems<Note, NoteInput>(deck.id, "notes");

  // Hero can route here asking to add a note straight away.
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(
    Boolean((location.state as { openAdd?: boolean } | null)?.openAdd),
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this note?")) return;
    setActionError(null);
    try {
      await remove(id);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to delete note.");
    }
  };

  if (isLoading) return <LoadingText label="Loading notes..." />;
  if (error) return <ErrorNotice message={error} onRetry={refetch} />;

  return (
    <section className="max-w-180">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 text-[13px] font-medium text-ink">
          Notes <span className="font-normal text-ink-faint">({notes.length})</span>
        </h2>
        {!isAdding && (
          <button className={ghostButton} onClick={() => setIsAdding(true)}>
            <PlusIcon size={13} />
            <span>Add note</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-4">
          <InlineForm
            fields={fields}
            submitLabel="Add note"
            onSubmit={async (v) => {
              await create({ title: v.title, content: v.content });
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {actionError && <p className="m-0 mb-3 text-[12px] text-danger">{actionError}</p>}

      {notes.length === 0 ? (
        <p className="m-0 text-[12px] text-ink-faint">
          No notes yet — jot down anything that belongs with this deck.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {notes.map((note) =>
            editingId === note.id ? (
              <InlineForm
                key={note.id}
                fields={fields}
                initialValues={{ title: note.title, content: note.content }}
                submitLabel="Save changes"
                onSubmit={async (v) => {
                  await update(note.id, { title: v.title, content: v.content });
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <article
                key={note.id}
                className="rounded-[10px] border border-line bg-panel p-3.25"
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <h3 className="m-0 text-[12.5px] font-bold text-ink">{note.title}</h3>
                  <div className="flex flex-shrink-0 items-center gap-0.5">
                    <button
                      className={iconButton}
                      aria-label="Edit note"
                      onClick={() => setEditingId(note.id)}
                    >
                      <PencilIcon size={13} />
                    </button>
                    <button
                      className={iconButton + " hover:!text-danger"}
                      aria-label="Delete note"
                      onClick={() => handleDelete(note.id)}
                    >
                      <TrashIcon size={13} />
                    </button>
                  </div>
                </div>
                <p className="m-0 whitespace-pre-wrap text-[12px] leading-relaxed text-ink-dim">
                  {note.content}
                </p>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}
