// create the pokemonData within this function
export async function createPokemonData(data) {
    try {
      const pokemonData = {
        name: data.name,
        id: data.id,
        attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
        defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
        speed: data.stats.find(stat => stat.stat.name === 'speed').base_stat,
        specialAttack: data.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
        specialDefense: data.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
        types: data.types.map(type => type.type.name),
        frontDefaultSprite: data.sprites.other['official-artwork'].front_default,
        cry: data.cries.latest,
        weight: data.weight, 
        height: data.height 
      };
    
      // Check if moves array is not empty before accessing move property
      if (data.moves.length > 0) {
        pokemonData.specialMove = data.moves.find(move => move.version_group_details[0].move_learn_method.name === 'level-up').move.name;
      } else {
        pokemonData.specialMove = "Unknown"; // or any default value
      }
    
      const speciesUrl = data.species.url;
      const speciesResponse = await fetch(speciesUrl);
      const speciesData = await speciesResponse.json();
      const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || '';
      const cleanedDescription = description.replace(/[\u0000-\u001F]/g, ' ');
      pokemonData.description = cleanedDescription;
      
      return pokemonData;
    } catch (error) {
      console.error(`Cant create pokemon data: ${error}`)
    }
    
  }
  