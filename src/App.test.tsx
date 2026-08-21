import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockListResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
  ],
};

const mockDetailResponse = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
  types: [{ slot: 1, type: { name: 'grass', url: '' } }],
  stats: [],
  abilities: [],
};

describe('App', () => {
  it('shows the empty state when search matches nothing', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockListResponse),
      })
    ) as unknown as typeof fetch;

    render(<App />);

    const user = userEvent.setup();
    const input = await screen.findByRole('textbox');
    await user.type(input, 'zzzzz');

    expect(screen.getByText('No Pokémon found.')).toBeInTheDocument();
  });

  it('shows the detail view when a card is clicked', async () => {
    globalThis.fetch = vi.fn((url: string) => {
      if (url.includes('/pokemon?')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockListResponse),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDetailResponse),
      });
    }) as unknown as typeof fetch;

    render(<App />);

    const user = userEvent.setup();
    const card = await screen.findByText('bulbasaur');
    await user.click(card);

    expect(await screen.findByText('grass')).toBeInTheDocument();
  });
});
