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
      return;
    }
const currentName = name;
const controller = new AbortController();

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      setPokemon(null);
      try {
        const data = await getPokemonDetail(currentName, controller.signal);
          setPokemon(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError' ) {
          return
        }
          setError(err instanceof Error ? err.message : `Failed to load ${currentName}`);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDetail();

    return () => {
      controller.abort();
    };
  }, [name]);

  if(!name) {
    return { pokemon: null, loading: false, error: null };
  }

  return { pokemon, loading, error };
}