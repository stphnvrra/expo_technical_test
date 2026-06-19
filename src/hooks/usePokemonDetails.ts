import { useState, useEffect, useCallback } from 'react';
import { usePokemonStore } from '../store/pokemonStore';
import { PokemonDetail } from '../types/pokemon';

export const usePokemonDetails = (idOrName: string | number) => {
  const { fetchPokemonDetail, pokemonDetails, pokemonDescriptions } = usePokemonStore();
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonDetail(idOrName);
      setDetail(data);
      // Retrieve cached description
      const desc = pokemonDescriptions[data.id] || '';
      setDescription(desc);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load details');
    } finally {
      setIsLoading(false);
    }
  }, [idOrName, fetchPokemonDetail, pokemonDescriptions]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  return {
    detail,
    description,
    isLoading,
    error,
    retry: loadDetails,
  };
};
