import { getPokemonInfo } from "./getPokemonInfo.js";
import { getPokemonColors } from "./getPokemonColors.js";

// List of legendary Pokémon names
const legendaryNames = [
  "articuno",
  "zapdos",
  "moltres",
  "mewtwo",
  "mew",
  "raikou",
  "entei",
  "suicune",
  "lugia",
  "ho-oh",
  "celebi",
  "regirock",
  "regice",
  "registeel",
  "latias",
  "latios",
  "kyogre",
  "groudon",
  "rayquaza",
  "jirachi",
  "deoxys",
  "uxie",
  "mesprit",
  "azelf",
  "dialga",
  "palkia",
  "heatran",
  "regigigas",
  "giratina",
  "cresselia",
  "phione",
  "manaphy",
  "darkrai",
  "shaymin",
  "arceus",
  "victini",
  "cobalion",
  "terrakion",
  "virizion",
  "tornadus",
  "thundurus",
  "reshiram",
  "zekrom",
  "landorus",
  "kyurem",
  "xerneas",
  "yveltal",
  "zygarde",
  "diancie",
  "hoopa",
  "volcanion",
  "tapu-koko",
  "tapu-lele",
  "tapu-bulu",
  "tapu-fini",
  "cosmog",
  "cosmoem",
  "solgaleo",
  "lunala",
  "nihilego",
  "buzzwole",
  "pheromosa",
  "xurkitree",
  "celesteela",
  "kartana",
  "guzzlord",
  "necrozma",
  "magearna",
  "marshadow",
  "zeraora",
  "meltan",
  "melmetal",
  "zacian",
  "zamazenta",
  "eternatus",
];

let legendaryPokemon = [];

/**
 * Asynchronously fetches a list of legendary Pokémon from the PokeAPI.
 *
 * @return {Array} A list of legendary Pokémon.
 */
async function fetchLegendaryPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1000");

  const data = await response.json();
  const legendaryPokemon = data.results.filter((pokemon) =>
    legendaryNames.includes(pokemon.name)
  );
  legendaryPokemon.sort(
    (a, b) =>
      parseInt(a.url.split("/").slice(-2, -1)[0]) -
      parseInt(b.url.split("/").slice(-2, -1)[0])
  );
  return legendaryPokemon;
}

/**
 * Fetch detailed information for each legendary Pokémon.
 *
 * @return {Array} A list of legendary Pokémon with detailed information.
 */
async function getLegendaryPokemon() {
  const legendaryPokemon = await fetchLegendaryPokemon();
  if (legendaryPokemon.length === 0) {
    console.error("No legendary Pokémon data found.");
    return []; // Return an empty array if no data is found
  }
  const promises = legendaryPokemon.map(async (pokemon) => {
    const pokemonData = await getPokemonInfo(pokemon.name);
    return pokemonData;
  });
  const pokemonDetails = await Promise.all(promises);
  return pokemonDetails;
}
/**
 * Display Pokemon details in a formatted HTML carousel item.
 *
 * @param {Object} pokemon - The Pokemon object containing details such as name, attack, defense, speed, etc.
 * @return {string} The formatted HTML for displaying Pokemon details.
 */
function displayPokemonDetails(pokemon) {
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
    cry,
  } = pokemon;

  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const firstType = types[0];
  const pokemonColor = getPokemonColors(firstType);
  const typesDiv = types
    .map(
      (type) =>
        `<div class="type" style="background-color:${
          getPokemonColors(type).color
        };">${type}</div>`
    )
    .join(" ");
  const pokemonDetails = `
    <div class="carousel-item">
      <div class="pokemonSprite-container">
        <img src="./img/pokeball-background.svg" alt="" class="pokeballBG" />
        <img src="${frontDefaultSprite}" alt="Pokemon ${name}" class="pokemonSprite" />
      </div>
      <div class="pokemonInfo">
        <h1 class="pokemonName">${formattedName}<span style="background-color:${
    pokemonColor.color
  }">${id}</span></h1>
        <div class="types">${typesDiv}</div>
        <p class="pokemon-description" style="color:${
          pokemonColor.color
        }">${description}</p>
        <div class="base-stats">
          ${renderStat("ATK", attack, pokemonColor)}
          ${renderStat("DEF", defense, pokemonColor)}
          ${renderStat("SPD", speed, pokemonColor)}
          ${renderStat("SATK", specialAttack, pokemonColor)}
          ${renderStat("SDEF", specialDefense, pokemonColor)}
        </div>
      </div>
    </div>`;
  playCryAudio(cry);
  return pokemonDetails;
}

/**
 * Play the Pokémon's cry audio.
 *
 * @param {string} cry - The URL of the Pokémon's cry audio.
 */
function playCryAudio(cry) {
  const cryAudio = new Audio(cry);
  cryAudio.play();
  cryAudio.volume = 0.3;
}

/**
 * Renders a stat with the given label, value, and color.
 *
 * @param {string} label - the label for the stat
 * @param {string} value - the value of the stat
 * @param {object} color - the color object containing color and backgroundColor properties
 * @return {string} the HTML representation of the stat
 */
function renderStat(label, value, color) {
  return `
    <div class="stat">
      <div class="stats-label" style="color:${color.color}">
        ${label} <span>${value}</span>
      </div>
      <div class="bar" style="background-color:${color.backgroundColor}">
        <div class="progress" style="width: ${value}%; background-color: ${color.color};"></div>
      </div>
    </div>`;
}

/**
 * Creates card navigation for legendary Pokémon.
 */
async function createCardNavigation() {
  const pokemons = await getLegendaryPokemon();
  const navigationContainer = document.querySelector(".carousel-navigation");
  pokemons.forEach((pokemon) => {
    const { name, spriteUrl } = pokemon;
    const pokemonName = name.charAt(0).toUpperCase() + name.slice(1);
    const pokemonCardContent = document.createElement("div");
    pokemonCardContent.classList.add("pokemonCard");
    pokemonCardContent.dataset.pokemon = JSON.stringify(pokemon);
    pokemonCardContent.innerHTML = `
      <div class="imageContainer">
        <img src="${spriteUrl}" alt="${pokemonName}" draggable="false" />
      </div>
      <div class="pokemonNameCard"><span>${pokemonName}</span></div>`;
    navigationContainer.appendChild(pokemonCardContent);
    pokemonCardContent.addEventListener("click", (event) =>
      handleCardClick(event)
    );
  });
}

/**
 * Handles the card click event to update the display with the clicked Pokémon's details.
 *
 * @param {Event} event - The click event object.
 */
function handleCardClick(event) {
  const clickedPokemon = JSON.parse(event.currentTarget.dataset.pokemon);
  const clickedIndex = legendaryPokemon.findIndex(
    (pokemon) => pokemon.name === clickedPokemon.name
  );
  currentPage = clickedIndex;
  const carouselContainer = document.querySelector(".carousel-container");
  const carouselItemContent = displayPokemonDetails(clickedPokemon);
  carouselContainer.innerHTML = carouselItemContent;
}

// Carousel navigation functionality
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentPage = 0;
let cryAudio;

const navigationContainer = document.querySelector(".carousel-navigation");
const carouselContainer = document.querySelector(".carousel-container");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

navigationContainer.addEventListener("mousedown", startDrag);
navigationContainer.addEventListener("touchstart", startDrag);
navigationContainer.addEventListener("mousemove", drag);
navigationContainer.addEventListener("touchmove", drag);
navigationContainer.addEventListener("mouseup", endDrag);
navigationContainer.addEventListener("mouseleave", endDrag);
navigationContainer.addEventListener("touchend", endDrag);

prevBtn.addEventListener("click", () => navigateCarousel(-1));
nextBtn.addEventListener("click", () => navigateCarousel(1));

/**
 * Starts the drag operation.
 *
 * @param {Event} event - The event object.
 */
function startDrag(event) {
  startPos =
    event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
  isDragging = true;
  prevTranslate = currentTranslate;
}

/**
 * Handles the drag event.
 *
 * @param {Event} event - The drag event object.
 */
function drag(event) {
  if (isDragging) {
    const currentPosition =
      event.type === "touchmove" ? event.touches[0].clientX : event.clientX;
    currentTranslate = prevTranslate + currentPosition - startPos;
    setTranslate();
  }
}

/**
 * Sets the translate properties of the navigation container to create a scroll effect.
 */
function setTranslate() {
  navigationContainer.style.overflowX = "hidden";
  navigationContainer.style.scrollBehavior = "auto";
  navigationContainer.scrollLeft = -currentTranslate;
}

/**
 * Ends the drag operation.
 */
function endDrag() {
  isDragging = false;
  prevTranslate = currentTranslate;
  navigationContainer.style.scrollBehavior = "smooth";
}

/**
 * Navigates the carousel.
 *
 * @param {number} direction - The direction to navigate (-1 for previous, 1 for next).
 */
function navigateCarousel(direction) {
  if (
    (direction === -1 && currentPage > 0) ||
    (direction === 1 && currentPage < legendaryPokemon.length - 1)
  ) {
    currentPage += direction;
    if (cryAudio) cryAudio.pause();
    updateDisplay();
    if (direction === 1 && cryAudio) cryAudio.play();
  }
}

/**
 * Updates the display with details of the current legendary Pokémon.
 */
function updateDisplay() {
  const display = displayPokemonDetails(legendaryPokemon[currentPage]);
  carouselContainer.innerHTML = display;
}

/**
 * Fetch and display legendary Pokémon.
 */
async function loadLegendaryPokemon() {
  try {
    legendaryPokemon = await getLegendaryPokemon();
    updateDisplay();
  } catch (error) {
    console.error(`Can't load the Pokémon: ${error}`);
  }
}

createCardNavigation();
loadLegendaryPokemon();
