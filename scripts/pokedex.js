import { fetchPokemonData } from "./fetchDataUrl.js";
import { getPokemonInfo } from "./getPokemonInfo.js";
import { displayHeader } from "./displayHeaderText.js";
import { displayCard } from "./displayCard.js";
import { initializePokedex } from "./loadpokemon.js";
import { showLoader } from "./loader.js";

//Call the function to display the Header
displayHeader();

//load pokemon per page
initializePokedex();

//Filteration
const pokemonTypeFilter = document.getElementById("pokemonTypeFilter");
pokemonTypeFilter.addEventListener("change", async function () {
  const selectedType = this.value;
  await pokemonFilter(selectedType);
});

const pokemonNames = [];

/**
 * The `pokemonFilter` function filters and displays Pokemon based on a specified type using data
 * fetched from the PokeAPI.
 * @param pokemonType - The `pokemonType` parameter is the type of Pokemon you want to filter by. It
 * can be a specific type like "fire", "water", "grass", etc., or it can be set to "all" to display all
 * types of Pokemon.
 */
async function pokemonFilter(pokemonType) {
  pokemonContainer.innerHTML = "";
  loadMoreBtn.style.display = "none";
  pokemonNames.length = 0;

  showLoader();
  console.log(showLoader);

  try {
    pokemonTypeFilter.disabled = true;
    let url = `https://pokeapi.co/api/v2/pokemon?limit=2000`;

    const data = await fetchPokemonData(url);

    if (!data || !data.results) {
      throw new Error("Invalid response from the server.");
    }

    const allPokemon = data.results;

    if (allPokemon.length === 0) {
      console.warn("No Pokémon found.");
      return;
    }

    // Filter Pokemon by type
    await Promise.all(
      allPokemon.map(async (pokemon) => {
        const id = pokemon.url.split("/").slice(-2, -1)[0];
        try {
          const pokemonData = await getPokemonInfo(id);
          const hasDesiredType =
            pokemonData.types &&
            pokemonData.types.some((type) => type === pokemonType);

          if (hasDesiredType || pokemonType === "all") {
            displayCard(pokemonData);
          }
        } catch (error) {
          console.error(`Error fetching data for Pokémon ID ${id}:`, error);
        }
      })
    );
  } catch (error) {
    console.error("Error filtering Pokemons:", error);
  } finally {
    pokemonTypeFilter.disabled = false;
  }
}

// Search Pokemonsssss
const searchPokemon = document.querySelector("#searchPokemon");
const filterationForm = document.querySelector(".filteration");

filterationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  pokemonContainer.innerHTML = "";

  try {
    //convert the input into lower case
    const pokemon = searchPokemon.value.toLowerCase();
    //get the pokemon Data
    const pokemonCard = await getPokemonInfo(pokemon);
    //display on the card
    displayCard(pokemonCard);
    loadMoreBtn.style.display = "none";
  } catch (error) {
    console.error(`Cant fetch the pokemon: ${error}`);
  }
});
