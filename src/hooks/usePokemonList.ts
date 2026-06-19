import { useEffect, useMemo, useCallback } from 'react';
import { usePokemonStore } from '../store/pokemonStore';
import { PokemonListItem } from '../types/pokemon';

export const usePokemonList = () => {
  const {
    pokemonList,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    searchQuery,
    selectedType,
    searchResult,
    isSearchingApi,
    fetchInitialList,
    fetchMore,
    refreshList,
    setSearchQuery,
    setSelectedType,
    executeApiSearch,
    clearError,
  } = usePokemonStore();

  // Load the initial list on mount
  useEffect(() => {
    fetchInitialList();
  }, [fetchInitialList]);

  // Client-side filtering logic based on loaded list
  const displayedPokemon = useMemo((): PokemonListItem[] => {
    // If there is an active API search result (found by query)
    if (searchQuery.trim() && searchResult) {
      return [searchResult];
    }

    let filtered = [...pokemonList];

    // Filter by type if one is selected
    if (selectedType) {
      filtered = filtered.filter((p) => p.types.includes(selectedType.toLowerCase()));
    }

    // Filter by search query if present
    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      
      // Look for name match or exact numerical ID match
      filtered = filtered.filter(
        (p) => 
          p.name.toLowerCase().includes(normalizedQuery) || 
          p.id.toString() === normalizedQuery
      );
    }

    return filtered;
  }, [pokemonList, searchQuery, selectedType, searchResult]);

  // Debounced search logic to fetch from PokéAPI when local search returns no match
  const handleSearch = useCallback(
    async (text: string) => {
      setSearchQuery(text);
      
      if (!text.trim()) return;

      // Check if we have a match locally first
      const normalizedText = text.toLowerCase().trim();
      const localMatch = pokemonList.some(
        (p) => 
          p.name.toLowerCase().includes(normalizedText) || 
          p.id.toString() === normalizedText
      );

      // If no local match exists, trigger API search to find by exact ID or name
      if (!localMatch) {
        // Wait briefly to avoid spamming the API (debounce is handled in the UI input, but double checked here)
        executeApiSearch(normalizedText);
      }
    },
    [pokemonList, setSearchQuery, executeApiSearch]
  );

  return {
    pokemon: displayedPokemon,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    searchQuery,
    selectedType,
    isSearchingApi,
    loadMore: fetchMore,
    refresh: refreshList,
    setSearch: handleSearch,
    setType: setSelectedType,
    clearError,
  };
};
