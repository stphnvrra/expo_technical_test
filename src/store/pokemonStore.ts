import { create } from 'zustand';
import { pokemonApi } from '../api/pokemonApi';
import { PokemonDetail, PokemonListItem } from '../types/pokemon';

interface PokemonStoreState {
  // Data List
  pokemonList: PokemonListItem[];
  allPokemonCount: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  
  // Details Cache
  pokemonDetails: Record<number, PokemonDetail>;
  pokemonDescriptions: Record<number, string>;
  
  // Statuses
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Search & Filters
  searchQuery: string;
  selectedType: string | null;
  searchResult: PokemonListItem | null; // For direct API search hits
  isSearchingApi: boolean;
  
  // Actions
  fetchInitialList: () => Promise<void>;
  fetchMore: () => Promise<void>;
  refreshList: () => Promise<void>;
  fetchPokemonDetail: (idOrName: string | number) => Promise<PokemonDetail>;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: string | null) => void;
  clearError: () => void;
  executeApiSearch: (query: string) => Promise<void>;
}

export const usePokemonStore = create<PokemonStoreState>((set, get) => ({
  pokemonList: [],
  allPokemonCount: 0,
  offset: 0,
  limit: 20,
  hasMore: true,
  pokemonDetails: {},
  pokemonDescriptions: {},
  isLoading: false,
  isLoadingMore: false,
  isRefreshing: false,
  error: null,
  searchQuery: '',
  selectedType: null,
  searchResult: null,
  isSearchingApi: false,

  fetchInitialList: async () => {
    // If we already have list, don't show full screen loader unless it's empty
    const currentList = get().pokemonList;
    set({ isLoading: currentList.length === 0, error: null });
    
    try {
      const { results, count } = await pokemonApi.getPokemonList(get().limit, 0);
      set({
        pokemonList: results,
        allPokemonCount: count,
        offset: results.length,
        hasMore: results.length < count,
        isLoading: false,
      });
    } catch (err: unknown) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch Pokémon list', 
        isLoading: false 
      });
    }
  },

  fetchMore: async () => {
    const { isLoading, isLoadingMore, hasMore, offset, limit, pokemonList, searchQuery } = get();
    
    // Prevent double loading or pagination during search
    if (isLoading || isLoadingMore || !hasMore || searchQuery.length > 0) return;
    
    set({ isLoadingMore: true, error: null });
    try {
      const { results, count } = await pokemonApi.getPokemonList(limit, offset);
      set({
        pokemonList: [...pokemonList, ...results],
        offset: offset + results.length,
        hasMore: (offset + results.length) < count,
        isLoadingMore: false,
      });
    } catch (err: unknown) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to load more Pokémon', 
        isLoadingMore: false 
      });
    }
  },

  refreshList: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const { results, count } = await pokemonApi.getPokemonList(get().limit, 0);
      set({
        pokemonList: results,
        allPokemonCount: count,
        offset: results.length,
        hasMore: results.length < count,
        isRefreshing: false,
      });
    } catch (err: unknown) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to refresh Pokémon list', 
        isRefreshing: false 
      });
    }
  },

  fetchPokemonDetail: async (idOrName: string | number) => {
    const { pokemonDetails, pokemonDescriptions } = get();
    
    // Check cache first if query is a number ID
    if (typeof idOrName === 'number' && pokemonDetails[idOrName]) {
      return pokemonDetails[idOrName];
    }
    
    // If name matches, see if it is in cache
    if (typeof idOrName === 'string') {
      const lowercaseName = idOrName.toLowerCase().trim();
      const cached = Object.values(pokemonDetails).find(
        (p) => p.name.toLowerCase() === lowercaseName
      );
      if (cached) return cached;
    }

    // Otherwise, fetch from API
    try {
      // Fetch details and descriptions in parallel
      const [detail, description] = await Promise.all([
        pokemonApi.getPokemonDetail(idOrName),
        pokemonApi.getPokemonDescription(idOrName)
      ]);

      // Update Cache
      set({
        pokemonDetails: { ...pokemonDetails, [detail.id]: detail },
        pokemonDescriptions: { ...pokemonDescriptions, [detail.id]: description }
      });
      return detail;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch details';
      throw new Error(msg);
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    
    // Clear the direct API search result if query is empty
    if (!query) {
      set({ searchResult: null, error: null });
    }
  },

  setSelectedType: (type: string | null) => {
    set({ selectedType: type });
  },

  clearError: () => {
    set({ error: null });
  },

  executeApiSearch: async (query: string) => {
    if (!query.trim()) return;
    set({ isSearchingApi: true, error: null, searchResult: null });
    try {
      const detail = await pokemonApi.getPokemonDetail(query);
      const item: PokemonListItem = {
        id: detail.id,
        name: detail.name,
        url: `https://pokeapi.co/api/v2/pokemon/${detail.id}/`,
        imageUrl: detail.sprites.other?.['official-artwork']?.front_default || detail.sprites.front_default || '',
        types: detail.types.map(t => t.type.name),
      };
      
      // Also cache it
      const { pokemonDetails } = get();
      set({
        searchResult: item,
        pokemonDetails: { ...pokemonDetails, [detail.id]: detail },
        isSearchingApi: false
      });
    } catch {
      // API search fail, i.e., name not matched
      set({ 
        searchResult: null, 
        isSearchingApi: false, 
        error: 'No Pokémon found matching that name or ID.' 
      });
    }
  }
}));
