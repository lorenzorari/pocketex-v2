'use client';

import React, { useEffect, useMemo } from 'react';
import { Breeding } from '@/features/pokemon-details/components/Breeding';
import { EvolutionChainPanel } from '@/features/pokemon-details/components/evolution-chain';
import PokemonDetailHero from '@/features/pokemon-details/components/Hero';
import { Stats } from '@/features/pokemon-details/components/stats';
import { Training } from '@/features/pokemon-details/components/Training';
import { TypeEffectiveness } from '@/features/pokemon-details/components/TypeEffectiveness';
import { usePokemon } from '@/hooks/pokemon/usePokemon';
import { usePokemonSpecies } from '@/hooks/pokemon/usePokemonSpecies';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { type PokemonType } from '@/models/types';
import { PrimaryTypeCtx } from './contexts/usePrimaryType';

interface Params {
  id: string;
}

interface Props {
  params: Promise<Params>;
}

const DetailsPage = ({ params }: Props) => {
  const { id } = React.use(params);
  const { pokemon } = usePokemon(id);
  const { pokemonSpecies: species, getGenus } = usePokemonSpecies(id);
  const pokemonTypes = useMemo<string[]>(() => pokemon?.types?.map(({ type }) => type.name) || [], [pokemon?.types]);

  useEffect(() => {
    if (pokemon?.name) {
      document.title = `${pokemon.name} | Pocketex`;
    }
  }, [pokemon]);

  const getDescription = () => {
    const text = species?.flavorTextEntries?.find(({ language }) => language.name === 'en')?.flavorText;

    if (!text) return '';

    return text
      ?.replace(/u'\f'/, ' ')
      .replace(/\u00AD/g, '')

      .replace(/\u000C/g, ' ')
      .replace(/u' -\n'/, ' - ')
      .replace(/u'-\n'/, '-')
      .replace(/(\r\n|\n|\r)/gm, ' ');
  };

  return (
    <PrimaryTypeCtx value={pokemonTypes?.[0] as PokemonType}>
      <DefaultLayout>
        {pokemon && (
          <>
            <PokemonDetailHero
              genus={getGenus()}
              pokemon={pokemon}
              pokemonTypes={pokemonTypes as PokemonType[]}
              description={getDescription()}
            />
            {species && (
              <div className="relative z-10 rounded-t-[40px] bg-white px-5 py-10 shadow-[0px_100px_484px_0px_rgba(0,0,0,0.4)] lg:-mt-16 lg:px-10 lg:py-[60px] xl:px-32">
                <div className="mb-10 grid gap-10 md:grid-cols-[repeat(auto-fit,minmax(340px,1fr))]">
                  <Breeding species={species} />
                  <Training pokemon={pokemon} species={species} />
                  <TypeEffectiveness types={pokemonTypes} />
                  {pokemon.stats && <Stats stats={pokemon.stats} />}
                </div>
                <EvolutionChainPanel evolutionChainUrl={species.evolutionChain?.url} />
              </div>
            )}
          </>
        )}
      </DefaultLayout>
    </PrimaryTypeCtx>
  );
};

export default DetailsPage;
