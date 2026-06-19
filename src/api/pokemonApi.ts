import client from './client';
import { 
  PokemonListResponse, 
  PokemonDetail, 
  PokemonListItem,
  NamedAPIResource
} from '../types/pokemon';
import { extractIdFromUrl } from '../utils/utils';

export const pokemonApi = {
  /**
   * Fetches a paginated list of Pokémon.
   * Resolves detailed data for each Pokémon in parallel to construct a rich list.
   */
  async getPokemonList(limit: number = 20, offset: number = 0): Promise<{ results: PokemonListItem[]; count: number }> {
    const response = await client.get<PokemonListResponse>(`pokemon?limit=${limit}&offset=${offset}`);
    const results = response.data.results;
    
    // Fetch details in parallel to obtain image URLs and type badges
    const detailedList = await Promise.all(
      results.map(async (pokemon: NamedAPIResource) => {
        try {
          const detailRes = await client.get<PokemonDetail>(`pokemon/${pokemon.name}`);
          const detail = detailRes.data;
          
          return {
            id: detail.id,
            name: detail.name,
            url: pokemon.url,
            imageUrl: detail.sprites.other?.['official-artwork']?.front_default || detail.sprites.front_default || '',
            types: detail.types.map(t => t.type.name),
          };
        } catch {
          // Fallback if detail fetch fails for an individual item
          const id = extractIdFromUrl(pokemon.url);
          return {
            id,
            name: pokemon.name,
            url: pokemon.url,
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            types: [],
          };
        }
      })
    );
    
    return {
      results: detailedList,
      count: response.data.count,
    };
  },

  /**
   * Fetches detailed data for a specific Pokémon by ID or Name.
   */
  async getPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
    const formattedQuery = typeof idOrName === 'string' ? idOrName.toLowerCase().trim() : idOrName;
    const response = await client.get<PokemonDetail>(`pokemon/${formattedQuery}`);
    return response.data;
  },

  /**
   * Fetches species details to extract description texts (flavor texts)
   */
  async getPokemonDescription(idOrName: string | number): Promise<string> {
    try {
      const formattedQuery = typeof idOrName === 'string' ? idOrName.toLowerCase().trim() : idOrName;
      const response = await client.get<{ flavor_text_entries: Array<{ flavor_text: string; language: NamedAPIResource }> }>(
        `pokemon-species/${formattedQuery}`
      );
      
      // Find the first English flavor text
      const englishEntry = response.data.flavor_text_entries.find(
        (entry) => entry.language.name === 'en'
      );
      
      if (englishEntry) {
        // Clean up format characters (newlines, page breaks, tabs) from description
        return englishEntry.flavor_text.replace(/\f/g, '\n').replace(/\u00ad/g, '').replace(/\u00ad\n/g, '').replace(/\n /g, ' ').replace(/ \n/g, ' ').replace(/\n/g, ' ').trim();
      }
      return 'No description available.';
    } catch {
      return 'Description data unavailable.';
    }
  }
};
