import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePokemonDetail } from './usePokemonDetail';

describe('usePokemonDetail', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('does not fetch when name is null', () => {
    globalThis.fetch = vi.fn() as unknown as typeof fetch;

    const { result } = renderHook(() => usePokemonDetail(null));

    expect(result.current.pokemon).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('returns pokemon detail on successful fetch', async () => {
    const mockDetail = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: { front_default: 'https://example.com/pikachu.png' },
      types: [{ slot: 1, type: { name: 'electric', url: '' } }],
      stats: [],
      abilities: [],
    };

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDetail),
      })
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => usePokemonDetail('pikachu'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.pokemon).toEqual(mockDetail);
    expect(result.current.error).toBeNull();
  });

  it('sets an error message when the fetch fails', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({}),
      })
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => usePokemonDetail('not-a-pokemon'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).not.toBeNull();
    expect(result.current.pokemon).toBeNull();
  });
});
