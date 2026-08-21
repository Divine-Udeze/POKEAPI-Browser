interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      aria-label="Search Pokemon"
      placeholder="Search Pokémon..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full max-w-md mx-auto block px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
