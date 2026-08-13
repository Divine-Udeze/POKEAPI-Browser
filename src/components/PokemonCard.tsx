 interface PokemonCardProps {
  name: string;
  onClick: () => void;
}

export function PokemonCard({ name, onClick }: PokemonCardProps) {
  return (
    <button
      onClick={onClick}
      className="capitalize p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
    >
      {name}
    </button>
  );
}
