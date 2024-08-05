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

  try {
    const pokemonData = await getPokemonInfo(id);
    if (!pokemonData || Object.keys(pokemonData).length === 0) {
      throw new Error(`Received an empty response for Pokémon ID ${id}`);
    }
    pokemonCache[id] = pokemonData;
    return pokemonData;
  } catch (error) {
    console.error(`Error fetching data for Pokémon ID ${id}:`, error);
    return null; // Return null if there's an error fetching the Pokémon data
  }
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

    const pokemons = await Promise.all(promises);

    pokemons.forEach((pokemon) => {
      if (pokemon) {
        displayCard(pokemon);
      } else {
        console.warn(
          `Skipping Pokémon ID ${i} due to an error or empty response.`
        );
      }
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
