import { getPokemonInfo } from "./getPokemonInfo.js";
import { getPokemonColors } from "./getPokemonColors.js";
let legendaryPokemon = [];
/**
 * Asynchronously fetches a list of legendary Pokémon from the PokeAPI.
 *
 * @return {Array} A list of legendary Pokémon.
 */
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
  return pokemonDetails;
}
getLegendaryPokemon()




const navigationContainer = document.querySelector(".carousel-navigation")
console.log(navigationContainer)
/**
 * Display Pokemon details in a formatted HTML carousel item.
 *
 * @param {Object} pokemon - The Pokemon object containing details such as name, attack, defense, speed, etc.
 * @return {string} The formatted HTML for displaying Pokemon details.
 */
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
    cry 
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
    const cryAudio = new Audio(cry);
    cryAudio.play();
    cryAudio.volume = 0.3;
    
  return pokemonDetails;
};

/**
 * Renders a stat with the given label, value, and color.
 *
 * @param {string} label - the label for the stat
 * @param {string} value - the value of the stat
 * @param {object} color - the color object containing color and backgroundColor properties
 * @return {string} the HTML representation of the stat
 */
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
const carouselContainer = document.querySelector(".carousel-container");
/**
 * Asynchronously creates card navigation for legendary pokemons.
 *
 * @return {Promise<void>} A promise that resolves once the card navigation is created
 */
const createCardNavigation = async () => {
  const pokemons = await getLegendaryPokemon();
  pokemons.forEach(pokemon => {
    const { name, spriteUrl,} = pokemon;
    const pokemonName = name.charAt(0).toUpperCase() + name.slice(1);

    const pokemonCardContent = document.createElement("div");
    pokemonCardContent.classList.add("pokemonCard");
    pokemonCardContent.dataset.pokemon = JSON.stringify(pokemon); // Store the pokemon object as a data attribute
    const cardContentInnerHtml = `
      <div class="imageContainer">
        <img src="${spriteUrl}" alt="" draggable="false"/>
      </div>
      <div class="pokemonNameCard"><span>${pokemonName}</span></div>
    `;
    pokemonCardContent.innerHTML = cardContentInnerHtml;

    navigationContainer.appendChild(pokemonCardContent);

    pokemonCardContent.addEventListener("click", (event) => {
      // Find the index of the clicked Pokemon in legendaryPokemon array
      const clickedPokemon = JSON.parse(event.currentTarget.dataset.pokemon);

      // Update the currentPage to the index of the clicked Pokemon
      const clickedIndex = legendaryPokemon.findIndex(pokemon => pokemon.name === clickedPokemon.name);
      currentPage = clickedIndex;
      // Update the display with the clicked Pokemon details
      const carouselItemContent = displayPokemonDetails(clickedPokemon);
      carouselContainer.innerHTML = carouselItemContent;
    
    });
  });
};
createCardNavigation();


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

/**
 * Handle the start of a drag event.
 *
 * @param {Event} event - the event object
 */
function startDrag(event) {
    if (event.type === 'touchstart') {
        startPos = event.touches[0].clientX;
    } else {
        startPos = event.clientX;
    }
    isDragging = true;
    prevTranslate = currentTranslate;
}

/**
 * Handles the drag event and updates the current translation based on the event type and position.
 *
 * @param {Event} event - The drag event object
 * @return {void} 
 */
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

/**
 * Sets the translate properties of the navigation container to create a scroll effect.
 *
 */
function setTranslate() {
    navigationContainer.style.overflowX = 'hidden';
    navigationContainer.style.scrollBehavior = 'auto';
    navigationContainer.scrollLeft = -currentTranslate;
}

/**
 * Ends the drag operation and updates the state.
 *
 */
function endDrag() {
    isDragging = false;
    prevTranslate = currentTranslate;
    navigationContainer.style.scrollBehavior = 'smooth';
}

//Carousel Effect

// Previous and Next button functionality
let cryAudio;
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let currentPage = 0;

/**
 * Updates the display with details of the current legendary Pokemon.
 *
 * @param None
 * @return None
 */
const updateDisplay = () => {
  const display = displayPokemonDetails(legendaryPokemon[currentPage]);
  carouselContainer.innerHTML = display;
};

prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    if (cryAudio) cryAudio.pause();
    updateDisplay();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < legendaryPokemon.length - 1) {
    currentPage++;
    updateDisplay();
    if (cryAudio) cryAudio.play();
  }
});

// Fetch and display legendary Pokemon
async function loadLegendaryPokemon() {
  try {
    legendaryPokemon = await getLegendaryPokemon();
    updateDisplay();
  } catch (error) {
    console.error(`Can't load the pokemon: ${error}`);
  }
}

// Fetch and display legendary Pokemon

loadLegendaryPokemon();
