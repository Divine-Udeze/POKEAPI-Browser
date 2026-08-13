import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePokemonList } from './usePokemonList';

describe('usePokemonList', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('starts in a loading state', () => {
    global.fetch = vi.fn(() =>
      new Promise(() => {}) // never resolves, keeps it loading
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => usePokemonList());
    expect(result.current.loading).toBe(true);
    expect(result.current.pokemonList).toEqual([]);
  });

  it('returns the pokemon list on successful fetch', async () => {
    const mockResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.pokemonList).toEqual(mockResponse.results);
    expect(result.current.error).toBeNull();
  });

  it('sets an error message when the fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).not.toBeNull();
    expect(result.current.pokemonList).toEqual([]);
  });
});
