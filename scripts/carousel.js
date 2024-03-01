import { getPokemonInfo } from "./getPokemonInfo.js";
import { getPokemonColors } from "./getPokemonColors.js";
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
    pokemonDetails.forEach(pokemonDetails =>{
        createCardNavigation(pokemonDetails)

    })
}
getLegendaryPokemon()




const navigationContainer = document.querySelector(".carousel-navigation")
console.log(navigationContainer)
const displayPokemonDetails = (pokemon) => {
  const { 
    name, 
    attack, 
    defense, 
    speed, 
    specialAttack, 
    specialDefense, 
    frontDefaultSprite, 
    id, 
    description, 
    types,
  } = pokemon;

  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const firstType = types[0];
  const pokemonColor = getPokemonColors(firstType);
  
  const typesDiv = types.map((type) => {
    const color = getPokemonColors(type);
    return `<div class="type" style="background-color:${color.color};">${type}</div>`;
  }).join(" ");

  const pokemonDetails = `
    <div class="carousel-item">
      <div class="pokemonSprite-container">
        <img
          src="./img/pokeball-background.svg"
          alt=""
          class="pokeballBG"
        />
        <img
          src="${frontDefaultSprite}"
          alt="Pokemon 1"
          class="pokemonSprite"
        />
      </div>
      <div class="pokemonInfo">
        <h1 class="pokemonName">${formattedName}<span style=" background-color:${pokemonColor.color}">${id}</span></h1>
        <div class="types">${typesDiv}</div>
        <p class="pokemon-description" style="color:${pokemonColor.color}">
          ${description}
        </p>
        <div class="base-stats">
          ${renderStat('ATK', attack, pokemonColor)}
          ${renderStat('DEF', defense, pokemonColor)}
          ${renderStat('SPD', speed, pokemonColor)}
          ${renderStat('SATK', specialAttack, pokemonColor)}
          ${renderStat('SDEF', specialDefense, pokemonColor)}
        </div>
      </div>
    </div>`;

  return pokemonDetails;
};

const renderStat = (label, value, color) => {
  return `
    <div class="stat">
      <div class="stats-label" style="color:${color.color}">
        ${label} <span>${value}</span>
      </div>
      <div class="bar" style="background-color:${color.backgroundColor}">
        <div class="progress" style="width: ${value}%; background-color: ${color.color};"></div>
      </div>
    </div>`;
};

const createCardNavigation = async (pokemon) =>{
  const { name, spriteUrl, cry } = pokemon;
  const pokemonName = name.charAt(0).toUpperCase() + name.slice(1);


  const pokemonCardContent = document.createElement("div");
  pokemonCardContent.classList.add("pokemonCard")
  const cardContentInnerHtml = `
    <div class="imageContainer">
      <img src="${spriteUrl}" alt="" draggable="false"/>
    </div>
    <div class="pokemonNameCard"><span>${pokemonName}</span></div>
    `
  pokemonCardContent.innerHTML = cardContentInnerHtml;

  navigationContainer.appendChild(pokemonCardContent);

  pokemonCardContent.addEventListener("click", () => {
    const carouselContainer = document.querySelector(".carousel-container");
    const carouselItemContent = displayPokemonDetails(pokemon);
    carouselContainer.innerHTML = carouselItemContent;
    const cryAudio = new Audio(cry);
    cryAudio.play();
  });
};



let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

navigationContainer.addEventListener('mousedown', startDrag);
navigationContainer.addEventListener('touchstart', startDrag);

navigationContainer.addEventListener('mousemove', drag);
navigationContainer.addEventListener('touchmove', drag);

navigationContainer.addEventListener('mouseup', endDrag);
navigationContainer.addEventListener('mouseleave', endDrag);
navigationContainer.addEventListener('touchend', endDrag);

function startDrag(event) {
    if (event.type === 'touchstart') {
        startPos = event.touches[0].clientX;
    } else {
        startPos = event.clientX;
    }
    isDragging = true;
    prevTranslate = currentTranslate;
}

function drag(event) {
    if (isDragging) {
        let currentPosition;
        if (event.type === 'touchmove') {
            currentPosition = event.touches[0].clientX;
        } else {
            currentPosition = event.clientX;
        }
        currentTranslate = prevTranslate + currentPosition - startPos;
        setTranslate();
    }
}

function setTranslate() {
    navigationContainer.style.overflowX = 'hidden';
    navigationContainer.style.scrollBehavior = 'auto';
    navigationContainer.scrollLeft = -currentTranslate;
}

function endDrag() {
    isDragging = false;
    prevTranslate = currentTranslate;
    navigationContainer.style.scrollBehavior = 'smooth';
}

//initialize the pokemon

