//Initialization
import { getPokemonInfo } from './getPokemonInfo.js';
import { displayCard } from './displayCard.js';
const loader = document.getElementById('loader');
//load pokemon per page
const pokemonPerPage = 30;
let currentPage = 1;
/**
 * Display the loader element.
 *
 */
function showLoader() {
  loader.style.display = 'block';
}

// Hide the loader
function hideLoader() {
  loader.style.display = 'none';
}
// This function display the number of pokemon specified
async function fetchAndDisplayPokemons(page){
  try {
    showLoader();
    loadMoreBtn.style.display = "none";
    const startIndex = (page - 1) * pokemonPerPage + 1;
    const endIndex = startIndex + pokemonPerPage - 1;
   
    const promises = [];
    for (let i = startIndex; i <= endIndex; i++) {
      promises.push(getPokemonInfo(i));
    }
    (await Promise.all(promises)).forEach(pokemon =>{
      displayCard(pokemon)
    })
    hideLoader();
    loadMoreBtn.style.display = "block";
} catch (error) {

    console.error('Error fetching and displaying pokemons:', error);
}
}


//This function add the current page loaded
async function loadMorePokemons(){
  currentPage++;
  await fetchAndDisplayPokemons(currentPage);
}


// this function load the pokemon when click the button
export async function initializePokedex(){
  try {
    // const count = await getPokemonCount();
    // const totalPages = Math.ceil(count / pokemonPerPage);
    // console.log(totalPages)
    await fetchAndDisplayPokemons(currentPage);
    
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.addEventListener('click', loadMorePokemons);
} catch (error) {
    console.error('Error initializing Pokédex:', error);
    
}
}