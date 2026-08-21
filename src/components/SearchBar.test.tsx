import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders with the current value', () => {
    render(<SearchBar value="pika" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText('Search Pokémon...');
    expect(input).toHaveValue('pika');
  });

  it('calls onChange when the user types', async () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    const input = screen.getByPlaceholderText('Search Pokémon...');

    const user = userEvent.setup();
    await user.type(input, 'char');

    expect(handleChange).toHaveBeenCalledWith('c');
  });
});
