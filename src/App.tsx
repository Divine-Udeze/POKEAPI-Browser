import { useState, useMemo,  useCallback } from 'react';
import { usePokemonList } from './hooks/usePokemonList';
import { usePokemonDetail } from './hooks/usePokemonDetail';
import { useFavorites } from './hooks/useFavorites';
import { clearToken, getToken } from './api/favorites';
import { SearchBar } from './components/SearchBar';
import { PokemonCard } from './components/PokemonCard';
import { LoginForm } from './components/LoginForm';
import { FavoriteButton } from './components/FavoriteButton';
import { FavoritesList } from './components/FavoritesList';

function App() {
  const { pokemonList, loading, error } = usePokemonList();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  // NEW: auth state, starting logged in if a token is already saved
  const [loggedIn, setLoggedIn] = useState(() => !!getToken());
  const handleUnauthorized = useCallback(() => setLoggedIn(false), []);
  const {
    favorites,
    loading: favLoading,
    error: favError,
    add,
    remove,
    editNote,
  } = useFavorites(loggedIn, handleUnauthorized);

  const handleLogout = () => {
    clearToken();
    setLoggedIn(false);
  };

  const filtered = useMemo(
    () => pokemonList.filter((p) => p.name.includes(search.toLowerCase())),
    [pokemonList, search]
  );

  // Clear the selection if the search filtered it out
if (selected && !filtered.some((p) => p.name === selected)) {
  setSelected(null);
}

  const { pokemon: detail, loading: detailLoading, error: detailError } = usePokemonDetail(selected);

  if (loading) return <p className="text-center mt-10">Loading Pokémon...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">PokéAPI Browser</h1>

      {/* NEW: login / logout */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-end">
        {loggedIn ? (
          <button onClick={handleLogout} className="rounded border px-3 py-1 text-sm">
            Log out
          </button>
        ) : (
          <LoginForm onLoggedIn={() => setLoggedIn(true)} />
        )}
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {filtered.length === 0 ? (
        <p className="text-center mt-6 text-gray-500">No Pokémon found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 max-w-4xl mx-auto">
          {filtered.map((p) => (
            <PokemonCard key={p.name} name={p.name} onClick={() => setSelected(p.name)} />
          ))}
        </div>
      )}

      {selected && (
        // NEW: added "relative" so the absolute close button sits inside this box
        <div className="relative mt-8 max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <button
            onClick={() => setSelected(null)}
            aria-label="Close detail view"
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
          {detailLoading && <p>Loading details...</p>}
          {detailError && <p className="text-red-600">{detailError}</p>}
          {detail && (
            <div className="text-center">
              {detail.sprites.front_default && (
                <img src={detail.sprites.front_default} alt={detail.name} className="mx-auto" />
              )}
              <h2 className="text-xl font-bold capitalize mt-2">{detail.name}</h2>
              <p className="text-sm text-gray-500 capitalize">
                {detail.types.map((t) => t.type.name).join(', ')}
              </p>

              {/* NEW: favorite toggle, only when logged in */}
              {loggedIn && (
                <div className="mt-4">
                  <FavoriteButton
                    pokemonName={detail.name}
                    favorites={favorites}
                    onAdd={add}
                    onRemove={remove}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* NEW: favorites list, only when logged in */}
      {loggedIn && (
        <section className="mt-10 max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">My favorites</h2>
          {favError && <p role="alert" className="text-red-600">{favError}</p>}
          {favLoading ? (
            <p>Loading favorites...</p>
          ) : (
            <FavoritesList favorites={favorites} onRemove={remove} onEditNote={editNote} />
          )}
        </section>
      )}
    </div>
  );
}

export default App;