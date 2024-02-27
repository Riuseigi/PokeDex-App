import { getPokemonInfo } from "./getPokemonInfo.js";

async function fetchLegendaryPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1000');
    const data = await response.json();
    
    const legendaryNames = [
        'articuno', 'zapdos', 'moltres', 'mewtwo', 'mew', 'raikou', 'entei',
        'suicune', 'lugia', 'ho-oh', 'celebi', 'regirock', 'regice', 'registeel',
        'latias', 'latios', 'kyogre', 'groudon', 'rayquaza', 'jirachi', 'deoxys',
        'uxie', 'mesprit', 'azelf', 'dialga', 'palkia', 'heatran', 'regigigas',
        'giratina', 'cresselia', 'phione', 'manaphy', 'darkrai', 'shaymin',
        'arceus', 'victini', 'cobalion', 'terrakion', 'virizion', 'tornadus',
        'thundurus', 'reshiram', 'zekrom', 'landorus', 'kyurem', 'xerneas',
        'yveltal', 'zygarde', 'diancie', 'hoopa', 'volcanion', 'tapu-koko',
        'tapu-lele', 'tapu-bulu', 'tapu-fini', 'cosmog', 'cosmoem', 'solgaleo',
        'lunala', 'nihilego', 'buzzwole', 'pheromosa', 'xurkitree', 'celesteela',
        'kartana', 'guzzlord', 'necrozma', 'magearna', 'marshadow', 'zeraora',
        'meltan', 'melmetal', 'zacian', 'zamazenta', 'eternatus'
    ];
    
    const legendaryPokemon = data.results.filter(pokemon => legendaryNames.includes(pokemon.name));
    
    legendaryPokemon.sort((a, b) => parseInt(a.url.split('/').slice(-2, -1)[0]) - parseInt(b.url.split('/').slice(-2, -1)[0]));
    
    return legendaryPokemon;
}

// Example usage
async function getLegendaryPokemon() {
    const legendaryPokemon = await fetchLegendaryPokemon();
    const promises = legendaryPokemon.map(async (pokemon) => {
        const pokemonData = await getPokemonInfo(pokemon.name);
        return pokemonData;
    });
    const pokemonDetails = await Promise.all(promises);
    console.log(pokemonDetails);
}
getLegendaryPokemon()
