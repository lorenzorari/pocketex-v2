import { pokeapi } from '@/helpers/http';
import { type PokemonPagination } from '@/models/pokemon/pagination';
import { type Species } from '@/models/species';

const BASE_URL = 'pokemon-species';

const getSpecies = async (pokemonId: string): Promise<Species> => {
  return await pokeapi.get(`${BASE_URL}/${pokemonId}`).json<Species>();
};

const getSpeciesPagination = async (offset: number = 0, limit: number = 20) => {
  const params = offset || limit ? `?offset=${offset}&limit=${limit}` : '';
  const url = `${BASE_URL}${params}`;

  return await pokeapi.get(url).json<PokemonPagination>();
};

export { getSpecies, getSpeciesPagination };
