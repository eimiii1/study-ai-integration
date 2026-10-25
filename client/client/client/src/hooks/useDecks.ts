import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import type { Deck } from "../types";

type UseDecksResult = {
  decks: Deck[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createDeck: (
    title: string,
    description?: string,
    parentDeckId?: number,
  ) => Promise<Deck>;
  updateDeck: (id: number, title: string, description: string) => Promise<void>;
  deleteDeck: (id: number) => Promise<void>;
};

export const useDecks = (): UseDecksResult => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fetchKey, setFetchKey] = useState(0);

  // Used after mutations to re-sync with the server (fresh card/subdeck counts)
  // without flashing a spinner. Only ever called from event handlers.
  const sync = useCallback(async () => {
    try {
      setDecks(await apiFetch("/api/decks"));
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load decks.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchDecks = async () => {
      try {
        const data = await apiFetch("/api/decks");
        if (!cancelled) {
          setDecks(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load decks.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDecks();
    return () => {
      cancelled = true;
    };
  }, [fetchKey]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setFetchKey((k) => k + 1);
  }, []);

  const createDeck = useCallback(
    async (title: string, description = "", parentDeckId?: number) => {
      const newDeck: Deck = await apiFetch("/api/decks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          ...(parentDeckId !== undefined ? { parent_deck_id: parentDeckId } : {}),
        }),
      });
      await sync();
      return newDeck;
    },
    [sync],
  );

  const updateDeck = useCallback(
    async (id: number, title: string, description: string) => {
      await apiFetch(`/api/decks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description }),
      });
      await sync();
    },
    [sync],
  );

  // No local state update here on purpose: the caller navigates away right
  // after, and every page that lists decks refetches when it mounts.
  const deleteDeck = useCallback(async (id: number) => {
    await apiFetch(`/api/decks/${id}`, { method: "DELETE" });
  }, []);

  return { decks, isLoading, error, refetch, createDeck, updateDeck, deleteDeck };
};
