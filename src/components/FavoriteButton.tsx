import type { Favorite } from "../api/favorites";

interface Props {
  pokemonName: string;
  favorites: Favorite[];
  onAdd: (name: string) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}

export function FavoriteButton({ pokemonName, favorites, onAdd, onRemove }: Props) {
  const existing = favorites.find((f) => f.pokemon_name === pokemonName);
  return (
    <button
      onClick={() => (existing ? onRemove(existing.id) : onAdd(pokemonName))}
      aria-pressed={!!existing}
    >
      {existing ? "★ Favorited" : "☆ Favorite"}
    </button>
  );
}