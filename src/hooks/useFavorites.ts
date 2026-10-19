import { useCallback, useEffect, useState } from "react";
import * as api from "../api/favorites";

export function useFavorites(enabled: boolean, onUnauthorized: () => void) {
  const [favorites, setFavorites] = useState<api.Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async <T,>(fn: () => Promise<T>) => {
      setError(null);
      try {
        return await fn();
      } catch (e) {
        if (e instanceof api.ApiError && e.status === 401) {
          onUnauthorized();
          return undefined;
        }
        setError(e instanceof Error ? e.message : "Something went wrong");
        return undefined;
      }
    },
    [onUnauthorized],
  );

  const refresh = useCallback(async () => {
    if (!enabled) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await run(api.listFavorites);
    if (data) setFavorites(data);
    setLoading(false);
  }, [enabled, run]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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

  return { favorites, loading, error, add, remove, editNote, refresh };
}