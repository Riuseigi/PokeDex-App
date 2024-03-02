import { createPokemonData } from './createPokemonData.js';
import { fetchPokemonData } from './fetchDataUrl.js';

/**
 * Returns a pokemon data of a specific pokemon.
 * If the data is already in the cache, returns the cached data instead of fetching it again.
 * @param {string} id - The id of the pokemon to fetch.
 * @returns {Promise<Object>} - The pokemon data.
 */
export async function getPokemonInfo(id) {
  const pokemonCache = new Map();
  try {
    if (pokemonCache.has(id)) {
      return pokemonCache.get(id);
    }
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const data = await fetchPokemonData(url);
    const pokemonData = await createPokemonData(data);
    pokemonCache.set(id, pokemonData);
    
    return pokemonData;
  } catch (error) {
    console.error('Error fetching Pokemon info:', error);
    throw error;
  }
}
  
  