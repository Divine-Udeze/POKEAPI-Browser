import { useState, useEffect } from 'react';
import { getPokemonList } from '../api/pokemon';
import type { PokemonListItem } from '../types/pokemon';

interface UsePokemonListResult {
  pokemonList: PokemonListItem[];
  loading: boolean;
  error: string | null;
}

export function usePokemonList(limit = 151): UsePokemonListResult {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();


    async function fetchList() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPokemonList(limit, 0, controller.signal);
          setPokemonList(data.results);
      } catch (err) {
        if (err instanceof DOMException && err.name ==='AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load Pokemon list');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchList();

    return () => {
      controller.abort();
    };
  }, [limit]);

  return { pokemonList, loading, error };
}