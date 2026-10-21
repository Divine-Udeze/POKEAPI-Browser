import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoriteButton } from './FavoriteButton';

const favorite = {
  id: 1,
  pokemon_name: 'bulbasaur',
  user_id: 'alice',
  date_added: '2026-10-19T00:00:00Z',
  note: null,
};

describe('FavoriteButton', () => {
  it('adds the pokemon when it is not a favorite yet', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    const onRemove = vi.fn().mockResolvedValue(undefined);

    render(
      <FavoriteButton
        pokemonName="bulbasaur"
        favorites={[]}
        onAdd={onAdd}
        onRemove={onRemove}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    expect(onAdd).toHaveBeenCalledWith('bulbasaur');
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('removes the favorite when it is already favorited', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    const onRemove = vi.fn().mockResolvedValue(undefined);

    render(
      <FavoriteButton
        pokemonName="bulbasaur"
        favorites={[favorite]}
        onAdd={onAdd}
        onRemove={onRemove}
      />
    );

    const user = userEvent.setup();
    const button = screen.getByRole('button', { pressed: true });
    await user.click(button);

    expect(onRemove).toHaveBeenCalledWith(1);
    expect(onAdd).not.toHaveBeenCalled();
  });
});