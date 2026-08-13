import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PokemonCard } from './PokemonCard';

describe('PokemonCard', () => {
  it('renders the pokemon name', () => {
    render(<PokemonCard name="pikachu" onClick={vi.fn()} />);
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<PokemonCard name="pikachu" onClick={handleClick} />);

    const user = userEvent.setup();
    await user.click(screen.getByText('pikachu'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
