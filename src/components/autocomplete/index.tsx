'use client';

import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { type RefObject, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { POKEMON_QUANTITY } from '@/constants';
import { usePokemonAutocomplete } from '@/hooks/pokemon/usePokemonAutocomplete';
import { isStringEmpty } from '@/utils/string';
import AutocompleteError from './error';
import Suggestions from './suggestions';
import { type PokemonAutocompleteItem } from './types';

interface Props {
  suggestionsSize?: number;
  className?: string;
  placeholder?: string;
}

const Autocomplete = ({ suggestionsSize = 5, placeholder }: Props) => {
  const router = useRouter();
  const { pokemonAutocompleteItems } = usePokemonAutocomplete();
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<PokemonAutocompleteItem[]>([]);
  const [suggestionSelected, setSuggestionSelected] = useState<number>(-1);
  const [error, setError] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLFormElement | null>(null);

  useOnClickOutside(inputRef as RefObject<HTMLFormElement>, () => setIsOpen(false));

  const navigateToDetails = (pokemonId: string | number) => {
    if (typeof pokemonId === 'string') {
      pokemonId = pokemonId.toLocaleLowerCase();
    }

    router.push(`/pokemon/${pokemonId}`);
  };

  const reset = () => {
    setSuggestions([]);
    setSearchValue('');
    setError('');
  };

  const isValueValidated = (value: string) => {
    if (value === '') return false;

    if (!suggestions.length) {
      if (isNaN(+value)) setError(`${value} is not a Pokémon.`);
      else setError(`No Pokémon has this id, please choose an id from 1 to ${POKEMON_QUANTITY}.`);

      return false;
    }

    const { name, id } = suggestions[0];
    value = value.toLowerCase();

    if (suggestionSelected === -1 && name !== value && id.toString() !== value) {
      setSuggestions([]);
      setError(`${value} is not a Pokémon`);
      return false;
    }

    return true;
  };

  const handleChangeSearch = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    if (value.length === 0) return reset();

    if (error) setError('');

    const filteredData = (pokemonAutocompleteItems || []).filter(({ name, id }) => {
      const nameLowercased = name.toLowerCase();
      const valueLowercased = value.toLowerCase();

      if (isNaN(+value)) return nameLowercased.includes(valueLowercased);

      return id.toString().includes(value);
    });

    setSuggestions(filteredData.slice(0, suggestionsSize));
    setSearchValue(value);
    setSuggestionSelected(-1);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!isValueValidated(searchValue)) return;

    if (suggestionSelected !== -1) return navigateToDetails(suggestions[suggestionSelected].name);

    navigateToDetails(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        if (suggestionSelected < suggestions.length - 1) {
          e.preventDefault();
          setSuggestionSelected((v) => v + 1);
        }
        break;

      case 'ArrowUp':
        if (suggestionSelected >= 0) {
          e.preventDefault();
          setSuggestionSelected((v) => v - 1);
        }
        break;

      case 'Enter':
        handleSubmit(e);
    }
  };

  const handleClickSuggestion = (suggestion: PokemonAutocompleteItem) => {
    navigateToDetails(suggestion.id);
  };

  return (
    <form
      ref={inputRef}
      onSubmit={handleSubmit}
      className="animate-fade-in relative w-full opacity-0 [animation-delay:1s]"
    >
      <div className="flex items-center rounded-full bg-white pr-4 transition-all">
        <input
          className="w-full rounded-[inherit] bg-transparent py-2 pl-4 outline-hidden placeholder:text-xs md:placeholder:text-sm"
          type="text"
          placeholder={placeholder}
          onChange={handleChangeSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          value={searchValue}
        />

        <button>
          <IconSearch className="w-5" />
        </button>
      </div>

      {isOpen && !isStringEmpty(searchValue) && (
        <Suggestions
          suggestions={suggestions}
          suggestionSelected={suggestionSelected}
          onClickSuggestion={handleClickSuggestion}
        />
      )}

      <AutocompleteError error={error} src="/assets/svg/cross.svg" />
    </form>
  );
};

export default Autocomplete;
