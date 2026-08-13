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
    let cancelled = false;

    async function fetchList() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPokemonList(limit, 0);
        if (!cancelled) {
          setPokemonList(data.results);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load Pokémon list');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchList();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { pokemonList, loading, error };