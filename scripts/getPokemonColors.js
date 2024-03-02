/**
 * Returns the color and background for a given type of Pokemon.
 * @param {string} type - The type of the Pokemon
 * @returns {Object} - An object containing the color and background for the given type
 */
export function getPokemonColors(type) {
  // Switch case to return the color and background based on the type of Pokemon
  switch (type.toLowerCase()) {
    case 'normal':
      return { color: '#A8A878', backgroundColor: 'rgba(168, 168, 120, 0.2)' };
    case 'fire':
      return { color: '#F08030', backgroundColor: 'rgba(240, 128, 48, 0.2)' };
    case 'water':
      return { color: '#6890F0', backgroundColor: 'rgba(104, 144, 240, 0.2)' };
    case 'electric':
      return { color: '#F8D030', backgroundColor: 'rgba(248, 208, 48, 0.2)' };
    case 'grass':
      return { color: '#78C850', backgroundColor: 'rgba(120, 200, 80, 0.2)' };
    case 'ice':
      return { color: '#98D8D8', backgroundColor: 'rgba(152, 216, 216, 0.2)' };
    case 'fighting':
      return { color: '#C03028', backgroundColor: 'rgba(192, 48, 40, 0.2)' };
    case 'poison':
      return { color: '#A040A0', backgroundColor: 'rgba(160, 64, 160, 0.2)' };
    case 'ground':
      return { color: '#E0C068', backgroundColor: 'rgba(224, 192, 104, 0.2)' };
    case 'flying':
      return { color: '#A890F0', backgroundColor: 'rgba(168, 144, 240, 0.2)' };
    case 'psychic':
      return { color: '#F85888', backgroundColor: 'rgba(248, 88, 136, 0.2)' };
    case 'bug':
      return { color: '#A8B820', backgroundColor: 'rgba(168, 184, 32, 0.2)' };
    case 'rock':
      return { color: '#B8A038', backgroundColor: 'rgba(184, 160, 56, 0.2)' };
    case 'ghost':
      return { color: '#705898', backgroundColor: 'rgba(112, 88, 152, 0.2)' };
    case 'dragon':
      return { color: '#7038F8', backgroundColor: 'rgba(112, 56, 248, 0.2)' };
    case 'dark':
      return { color: '#705848', backgroundColor: 'rgba(112, 88, 72, 0.2)' };
    case 'steel':
      return { color: '#B8B8D0', backgroundColor: 'rgba(184, 184, 208, 0.2)' };
    case 'fairy':
      return { color: '#EE99AC', backgroundColor: 'rgba(238, 153, 172, 0.2)' };
    default:
      return { color: '#000000', backgroundColor: 'rgba(0, 0, 0, 0.2)' }; // Return black for unknown types
  }
}