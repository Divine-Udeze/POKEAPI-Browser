import { useState, useEffect } from 'react';
import { getPokemonDetail } from '../api/pokemon';
import type { PokemonDetail } from '../types/pokemon';

interface UsePokemonDetailResult {
  pokemon: PokemonDetail | null;
  loading: boolean;
  error: string | null;
}

export function usePokemonDetail(name: string | null): UsePokemonDetailResult {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) {
      setPokemon(null);
      return;
    }

    let cancelled = false;

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPokemonDetail(name as string);
        if (!cancelled) {
          setPokemon(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : `Failed to load ${name}`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [name]);

  return { pokemon, loading, error };
}