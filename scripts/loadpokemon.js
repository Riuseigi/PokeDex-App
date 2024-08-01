// Initialization
import { getPokemonInfo } from "./getPokemonInfo.js";
import { displayCard } from "./displayCard.js";
const loader = document.getElementById("loader");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const pokemonTypeFilter = document.getElementById("pokemonTypeFilter");

// Memoization cache
const pokemonCache = {};

// Load Pokémon per page
const pokemonPerPage = 30;
let currentPage = 1;

/**
 * Display the loader element.
 */
function showLoader() {
  loader.style.display = "block";
}

/**
 * Hide the loader element.
 */
function hideLoader() {
  loader.style.display = "none";
}

/**
 * Get Pokémon info with memoization.
 * @param {number} id - The ID of the Pokémon.
 * @returns {Promise<Object>} - The Pokémon data.
 */
async function memoizedGetPokemonInfo(id) {
  if (pokemonCache[id]) {
    return pokemonCache[id];
  }

  const pokemonData = await getPokemonInfo(id);
  pokemonCache[id] = pokemonData;
  return pokemonData;
}

/**
 * Fetch and display Pokémon.
 * @param {number} page - The current page number.
 */
async function fetchAndDisplayPokemons(page) {
  try {
    showLoader();
    loadMoreBtn.style.display = "none";
    const startIndex = (page - 1) * pokemonPerPage + 1;
    const endIndex = startIndex + pokemonPerPage - 1;

    const promises = [];
    for (let i = startIndex; i <= endIndex; i++) {
      promises.push(memoizedGetPokemonInfo(i));
    }

    (await Promise.all(promises)).forEach((pokemon) => {
      displayCard(pokemon);
    });

    hideLoader();
    loadMoreBtn.style.display = "block";

    // Enable the Pokémon type filter after fetching all Pokémon
    pokemonTypeFilter.disabled = false;
  } catch (error) {
    console.error("Error fetching and displaying Pokémon:", error);
    hideLoader(); // Ensure loader is hidden if there is an error
  }
}

/**
 * Load more Pokémon.
 */
async function loadMorePokemons() {
  currentPage++;
  await fetchAndDisplayPokemons(currentPage);
}

/**
 * Initialize the Pokédex.
 */
export async function initializePokedex() {
  try {
    // Disable the Pokémon type filter initially
    pokemonTypeFilter.disabled = true;

    await fetchAndDisplayPokemons(currentPage);
    loadMoreBtn.addEventListener("click", loadMorePokemons);
  } catch (error) {
    console.error("Error initializing Pokédex:", error);
  }
}
