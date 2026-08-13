import type { PokemonListResponse, PokemonDetail } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon list: ${response.status}`);
  }
  return response.json();
}

export async function getPokemonDetail(name: string): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon detail for "${name}": ${response.status}`);
  }
  return response.json();
}