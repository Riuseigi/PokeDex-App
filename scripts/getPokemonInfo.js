import { createPokemonData } from './createPokemonData.js';
import { fetchPokemonData } from './fetchDataUrl.js';

//returns a pokemon data of specific pokemon
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
  
  