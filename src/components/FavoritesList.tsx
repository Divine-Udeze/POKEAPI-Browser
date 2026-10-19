import { useState } from "react";
import type { Favorite } from "../api/favorites";

interface Props {
  favorites: Favorite[];
  onRemove: (id: number) => Promise<void>;
  onEditNote: (id: number, note: string | null) => Promise<void>;
}

function Row({ fav, onRemove, onEditNote }: { fav: Favorite } & Omit<Props, "favorites">) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(fav.note ?? "");

  const save = async () => {
    await onEditNote(fav.id, draft.trim() || null);
    setEditing(false);
  };

  return (
    <li className="flex items-center justify-between gap-2 border-b py-2">
      <div>
        <p className="font-medium capitalize">{fav.pokemon_name}</p>
        {editing ? (
          <input value={draft} onChange={(e) => setDraft(e.target.value)} className="border px-2" />
        ) : (
          <p className="text-sm text-gray-600">{fav.note ?? "No note"}</p>
        )}
      </div>
      <div className="flex gap-2">
        {editing ? (
          <button onClick={save}>Save</button>
        ) : (
          <button onClick={() => setEditing(true)}>Edit note</button>
        )}
        <button onClick={() => onRemove(fav.id)}>Remove</button>
      </div>
    </li>
  );
}

export function FavoritesList({ favorites, onRemove, onEditNote }: Props) {
  if (favorites.length === 0) return <p>No favorites yet.</p>;
  return (
    <ul>
      {favorites.map((f) => (
        <Row key={f.id} fav={f} onRemove={onRemove} onEditNote={onEditNote} />
      ))}
    </ul>
  );
}