import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import type { InventoryItem, RoomItem, WallSide } from "../types";

type UseRoomResult = {
  inventory: InventoryItem[];
  roomItems: RoomItem[];
  isLoading: boolean;
  error: string | null;
  placeError: string | null;
  refetch: () => void;
  placeItem: (
    furnitureId: number,
    x: number,
    y: number,
    wallSide: WallSide | null,
  ) => Promise<boolean>;
  moveItem: (
    roomItemId: number,
    x: number,
    y: number,
    wallSide: WallSide | null,
  ) => Promise<boolean>;
  toggleFlip: (roomItemId: number) => Promise<void>;
  setScale: (roomItemId: number, scale: number) => Promise<void>;
  removeItem: (roomItemId: number) => Promise<void>;
};

export function useRoom(): UseRoomResult {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [roomItems, setRoomItems] = useState<RoomItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const sync = useCallback(async () => {
    try {
      const [inv, room] = await Promise.all([
        apiFetch("/api/furniture/inventory"),
        apiFetch("/api/room"),
      ]);
      setInventory(inv);
      setRoomItems(room);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load your room.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      try {
        const [inv, room] = await Promise.all([
          apiFetch("/api/furniture/inventory"),
          apiFetch("/api/room"),
        ]);
        if (!cancelled) {
          setInventory(inv);
          setRoomItems(room);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load your room.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchKey]);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  // Returns true on success, false if the backend rejected the spot (wrong
  // zone, out of bounds, or already occupied) — the caller shows placeError.
  const placeItem = useCallback(
    async (furnitureId: number, x: number, y: number, wallSide: WallSide | null) => {
      try {
        await apiFetch("/api/room", {
          method: "POST",
          body: JSON.stringify({ furniture_id: furnitureId, x, y, wall_side: wallSide }),
        });
        setPlaceError(null);
        await sync();
        return true;
      } catch (err: unknown) {
        setPlaceError(err instanceof Error ? err.message : "Couldn't place that there.");
        return false;
      }
    },
    [sync],
  );

  const moveItem = useCallback(
    async (roomItemId: number, x: number, y: number, wallSide: WallSide | null) => {
      try {
        const updated = await apiFetch(`/api/room/${roomItemId}`, {
          method: "PUT",
          body: JSON.stringify({ x, y, wall_side: wallSide }),
        });
        setRoomItems((items) => items.map((i) => (i.room_item_id === roomItemId ? updated : i)));
        setPlaceError(null);
        return true;
      } catch (err: unknown) {
        setPlaceError(err instanceof Error ? err.message : "Couldn't move that there.");
        return false;
      }
    },
    [],
  );

  const toggleFlip = useCallback(async (roomItemId: number) => {
    const current = roomItems.find((i) => i.room_item_id === roomItemId);
    if (!current) return;
    const next = !current.flipped;
    setRoomItems((items) =>
      items.map((i) => (i.room_item_id === roomItemId ? { ...i, flipped: next } : i)),
    );
    try {
      await apiFetch(`/api/room/${roomItemId}`, {
        method: "PUT",
        body: JSON.stringify({ flipped: next }),
      });
    } catch {
      setRoomItems((items) =>
        items.map((i) => (i.room_item_id === roomItemId ? { ...i, flipped: !next } : i)),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomItems]);

  const setScale = useCallback(async (roomItemId: number, scale: number) => {
    const clamped = Math.max(60, Math.min(140, scale));
    setRoomItems((items) =>
      items.map((i) => (i.room_item_id === roomItemId ? { ...i, scale: clamped } : i)),
    );
    try {
      await apiFetch(`/api/room/${roomItemId}`, {
        method: "PUT",
        body: JSON.stringify({ scale: clamped }),
      });
    } catch {
      await sync();
    }
  }, [sync]);

  const removeItem = useCallback(
    async (roomItemId: number) => {
      await apiFetch(`/api/room/${roomItemId}`, { method: "DELETE" });
      await sync();
    },
    [sync],
  );

  return {
    inventory,
    roomItems,
    isLoading,
    error,
    placeError,
    refetch,
    placeItem,
    moveItem,
    toggleFlip,
    setScale,
    removeItem,
  };
}
