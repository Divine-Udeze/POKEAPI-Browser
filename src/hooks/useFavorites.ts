import { useCallback, useEffect, useState } from "react";
import * as api from "../api/favorites";

export function useFavorites(enabled: boolean, onUnauthorized: () => void) {
  const [favorites, setFavorites] = useState<api.Favorite[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback(
    (e: unknown) => {
      if (e instanceof api.ApiError && e.status === 401) {
        onUnauthorized();
        return;
      }
      setError(e instanceof Error ? e.message : "Something went wrong");
    },
    [onUnauthorized],
  );

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    api
      .listFavorites()
      .then((data) => {
        if (cancelled) return;
        setFavorites(data);
        setError(null);
        setLoaded(true);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        handleError(e);
        setLoaded(true);
      });
    return () => {
      cancelled = true;
      // clear on logout so the next user never sees the previous user's list
      setFavorites([]);
      setLoaded(false);
    };
  }, [enabled, handleError]);

  const run = useCallback(
    async <T>(fn: () => Promise<T>) => {
      setError(null);
      try {
        return await fn();
      } catch (e) {
        handleError(e);
        return undefined;
      }
    },
    [handleError],
  );

  const add = async (name: string, note?: string) => {
    const fav = await run(() => api.createFavorite(name, note));
    if (fav) setFavorites((prev) => [...prev, fav]);
  };

  const remove = async (id: number) => {
    const ok = await run(async () => {
      await api.deleteFavorite(id);
      return true;
    });
    if (ok) setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const editNote = async (id: number, note: string | null) => {
    const fav = await run(() => api.updateFavoriteNote(id, note));
    if (fav) setFavorites((prev) => prev.map((f) => (f.id === id ? fav : f)));
  };

  return { favorites, loading: enabled && !loaded, error, add, remove, editNote };
}