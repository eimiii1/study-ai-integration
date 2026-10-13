import { useState, type FormEvent } from "react";
import { primaryButton } from "../lib/ui";

export interface FormField {
  name: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}

interface InlineFormProps {
  fields: FormField[];
  initialValues?: Record<string, string>;
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  onCancel: () => void;
}

const inputClass =
  "w-full rounded-lg border border-line bg-input px-2.75 py-2 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-violet";

// One small form used for decks, subdecks, flashcards and notes (create + edit).
// The caller closes it by unmounting after onSubmit resolves.
export function InlineForm({
  fields,
  initialValues = {},
  submitLabel,
  onSubmit,
  onCancel,
}: InlineFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const values: Record<string, string> = {};
    for (const field of fields) {
      values[field.name] = String(formData.get(field.name) ?? "").trim();
    }

    const missing = fields.find((f) => f.required && !values[f.name]);
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[10px] border border-line bg-panel p-3.25"
    >
      <div className="mb-3 flex flex-col gap-3">
        {fields.map((field, i) => (
          <label key={field.name} className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium text-ink-dim">{field.label}</span>
            {field.multiline ? (
              <textarea
                name={field.name}
                rows={3}
                defaultValue={initialValues[field.name] ?? ""}
                placeholder={field.placeholder}
                autoFocus={i === 0}
                className={inputClass + " resize-y"}
              />
            ) : (
              <input
                name={field.name}
                type="text"
                defaultValue={initialValues[field.name] ?? ""}
                placeholder={field.placeholder}
                autoFocus={i === 0}
                className={inputClass}
              />
            )}
          </label>
        ))}
      </div>

      {error && <p className="m-0 mb-3 text-[12px] text-danger">{error}</p>}

      <div className="flex items-center gap-1.5">
        <button type="submit" disabled={isSaving} className={primaryButton}>
          {isSaving ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[6px] px-2.5 py-1.5 text-[12px] text-ink-dim hover:bg-elevated hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
