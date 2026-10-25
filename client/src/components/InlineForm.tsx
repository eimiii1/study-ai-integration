import { useState, type FormEvent } from "react";
import { inputClass, primaryButton, secondaryButton } from "../lib/ui";

export interface FormField {
  name: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  maxLength?: number;
}

interface InlineFormProps {
  fields: FormField[];
  initialValues?: Record<string, string>;
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  onCancel: () => void;
}

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
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of fields) initial[field.name] = initialValues[field.name] ?? "";
    return initial;
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const missing = fields.find((f) => f.required && !values[f.name]?.trim());
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const trimmed: Record<string, string> = {};
      for (const key of Object.keys(values)) trimmed[key] = values[key].trim();
      await onSubmit(trimmed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in-up rounded-[10px] border border-line bg-panel p-3.5 shadow-[var(--shadow-soft)]"
    >
      <div className="mb-3.5 flex flex-col gap-3.5">
        {fields.map((field, i) => {
          const length = values[field.name]?.length ?? 0;
          return (
            <label key={field.name} className="flex flex-col gap-1.5">
              <span className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-ink-dim">
                  {field.label}
                  {field.required && <span className="ml-0.5 text-danger">*</span>}
                </span>
                {field.maxLength && (
                  <span
                    className={
                      "text-[10.5px] tabular-nums " +
                      (length > field.maxLength ? "text-danger" : "text-ink-faint")
                    }
                  >
                    {length}/{field.maxLength}
                  </span>
                )}
              </span>
              {field.multiline ? (
                <textarea
                  name={field.name}
                  rows={3}
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  autoFocus={i === 0}
                  maxLength={field.maxLength}
                  className={inputClass + " resize-y"}
                />
              ) : (
                <input
                  name={field.name}
                  type="text"
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [field.name]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  autoFocus={i === 0}
                  maxLength={field.maxLength}
                  className={inputClass}
                />
              )}
            </label>
          );
        })}
      </div>

      {error && (
        <p className="m-0 mb-3 flex items-center gap-1.5 rounded-[6px] border border-danger/30 bg-danger/10 px-2.5 py-1.75 text-[12px] text-danger">
          {error}
        </p>
      )}

      <div className="flex items-center gap-1.5">
        <button type="submit" disabled={isSaving} className={primaryButton}>
          {isSaving && (
            <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-app/40 border-t-app" />
          )}
          <span>{isSaving ? "Saving..." : submitLabel}</span>
        </button>
        <button type="button" onClick={onCancel} className={secondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}
