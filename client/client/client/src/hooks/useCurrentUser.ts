import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import type { User } from "../types";

type UseCurrentUserResult = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

export const useCurrentUser = (): UseCurrentUserResult => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      try {
        const data = await apiFetch("/api/me");
        if (!cancelled) {
          setUser({ id: data.id, username: data.username, email: data.email });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load user.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, isLoading, error };
};
