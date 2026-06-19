export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonTypeInfo {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonAbilityInfo {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStatInfo {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonTypeInfo[];
  abilities: PokemonAbilityInfo[];
  stats: PokemonStatInfo[];
}

export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  types: string[]; // Aggregated types for fast list render
}

export interface PokemonState {
  pokemonList: PokemonListItem[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedType: string | null;
  offset: number;
  hasMore: boolean;
  isRefreshing: boolean;
}
