type CreateDeckModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateDeckModal({ open, onClose }: CreateDeckModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-[0_1px_2px_rgba(10,10,10,0.03),0_12px_32px_-12px_rgba(10,10,10,0.15)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Create deck</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-canvas hover:text-ink"
          >
            ✕
          </button>
        </div>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: wire up create deck API
          }}
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted">Title</span>
            <input
              name="title"
              type="text"
              required
              className="rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none transition focus:border-ink"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted">Description</span>
            <textarea
              name="description"
              rows={3}
              className="resize-none rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none transition focus:border-ink"
            />
          </label>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-canvas hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-ink/85"
            >
              Create deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}