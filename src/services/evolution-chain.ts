import { pokeapi } from '@/helpers/http';
import { type EvolutionChain } from '@/models/evolution/chain';

const getEvolutionChain = async (url: string): Promise<EvolutionChain> => {
  return await pokeapi.get(url).json<EvolutionChain>();
};

export { getEvolutionChain };
