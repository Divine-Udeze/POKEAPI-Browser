import { useState, useMemo } from 'react';
import { usePokemonList } from './hooks/usePokemonList';
import { usePokemonDetail } from './hooks/usePokemonDetail';
import { SearchBar } from './components/SearchBar';
import { PokemonCard } from './components/PokemonCard';

function App() {
  const { pokemonList, loading, error } = usePokemonList();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(
    () => pokemonList.filter((p) => p.name.includes(search.toLowerCase())),
    [pokemonList, search]
  );

  const { pokemon: detail, loading: detailLoading, error: detailError } = usePokemonDetail(selected);

  if (loading) return <p className="text-center mt-10">Loading Pokémon...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">PokéAPI Browser</h1>
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
        <div className="mt-8 max-w-md mx-auto bg-white rounded-lg shadow p-6">
          {detailLoading && <p>Loading details...</p>}
          {detailError && <p className="text-red-600">{detailError}</p>}
          {detail && (
            <div className="text-center">
              <img src={detail.sprites.front_default ?? ''} alt={detail.name} className="mx-auto" />
              <h2 className="text-xl font-bold capitalize mt-2">{detail.name}</h2>
              <p className="text-sm text-gray-500 capitalize">
                {detail.types.map((t) => t.type.name).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
