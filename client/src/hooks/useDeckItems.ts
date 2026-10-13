import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

type Resource = "flashcards" | "notes";

type UseDeckItemsResult<T, I> = {
  items: T[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  create: (input: I) => Promise<void>;
  update: (id: number, input: I) => Promise<void>;
  remove: (id: number) => Promise<void>;
};

/**
 * Flashcards and notes share the exact same CRUD shape under
 * /api/decks/<deck_id>/<resource>, so one hook serves both.
 * Mutations throw on failure so forms can show the error; after each one we
 * re-sync from the server so the list always matches what's saved.
 */
export function useDeckItems<T extends { id: number }, I>(
  deckId: number,
  resource: Resource,
): UseDeckItemsResult<T, I> {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const base = `/api/decks/${deckId}/${resource}`;

  const [fetchKey, setFetchKey] = useState(0);

  // Re-sync after mutations without flashing a spinner (event handlers only).
  const sync = useCallback(async () => {
    try {
      setItems(await apiFetch(base));
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Failed to load ${resource}.`);
    }
  }, [base, resource]);

  useEffect(() => {
    let cancelled = false;

    const fetchItems = async () => {
      try {
        const data = await apiFetch(base);
        if (!cancelled) {
          setItems(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : `Failed to load ${resource}.`);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchItems();
    return () => {
      cancelled = true;
    };
  }, [base, resource, fetchKey]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setFetchKey((k) => k + 1);
  }, []);

  const create = useCallback(
    async (input: I) => {
      await apiFetch(base, { method: "POST", body: JSON.stringify(input) });
      await sync();
    },
    [base, sync],
  );

  const update = useCallback(
    async (id: number, input: I) => {
      await apiFetch(`${base}/${id}`, { method: "PUT", body: JSON.stringify(input) });
      await sync();
    },
    [base, sync],
  );

  const remove = useCallback(
    async (id: number) => {
      await apiFetch(`${base}/${id}`, { method: "DELETE" });
      await sync();
    },
    [base, sync],
  );

  return { items, isLoading, error, refetch, create, update, remove };
}
