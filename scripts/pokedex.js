const pokemonContainer = document.getElementById("pokemonContainer");
let hasError = false




/* This code is adding a click event listener to an element with the class "hamburger". When the
element is clicked, it toggles the "active" class on both the element with the class "navLinks" and
the element with the class "hamburger". This is commonly used to create a toggle effect, such as
opening and closing a navigation menu when clicking on a hamburger icon. */
document.querySelector('.hamburger').addEventListener('click', function() {
  document.querySelector('.navLinks').classList.toggle('active');
  document.querySelector('.hamburger').classList.toggle('active');
});


/* The `pokemonTypeColors` object is a mapping of Pokémon types to their corresponding color codes.
Each type is represented as a key-value pair, where the type name is the key and the color code is
the value. This object is used in the `getPokemonColor` function to determine the background color
for each Pokémon type displayed on the card. */
const pokemonTypeColors = {
  Normal: '#A8A878',
  Fire: '#F08030',
  Water: '#6890F0',
  Electric: '#F8D030',
  Grass: '#78C850',
  Ice: '#98D8D8',
  Fighting: '#C03028',
  Poison: '#A040A0',
  Ground: '#E0C068',
  Flying: '#A890F0',
  Psychic: '#F85888',
  Bug: '#A8B820',
  Rock: '#B8A038',
  Ghost: '#705898',
  Dragon: '#7038F8',
  Dark: '#705848',
  Steel: '#B8B8D0',
  Fairy: '#EE99AC'
};



/**
 * The function `displayHeader` asynchronously retrieves the count of Pokemons and displays it in the
 * headline text.
 */

async function displayHeader(){
  const headlineText = document.getElementById("headlineText")
  try{
  const count = await getPokemonCount()
 
  headlineText.textContent= `${count.toLocaleString()} Pokemons for you to choose your favorite`
  }
  catch(error){
    console.error(error)
    
  }
}
//Call the function
displayHeader();


//Initialization
const pokemonPerPage = 30;
let currentPage = 1;

/**
 * The function fetches and displays a range of pokemons based on the given page number.
 * @param page - The page parameter represents the page number of the pokemons to fetch and display.
 */
async function fetchAndDisplayPokemons(page){
  try {
    const startIndex = (page - 1) * pokemonPerPage + 1;
    const endIndex = startIndex + pokemonPerPage - 1;
    console.log(startIndex)
    console.log(endIndex)
    for (let i = startIndex; i <= endIndex; i++) {
        await getPokemonInfo(i);
    }
} catch (error) {
  
    console.error('Error fetching and displaying pokemons:', error);
}
}


/**
 * The function `loadMorePokemons` increments the `currentPage` variable and then calls the
 * `fetchAndDisplayPokemons` function.
 */
async function loadMorePokemons(){
  currentPage++;
  await fetchAndDisplayPokemons(currentPage);
}

/**
 * The function `initializePokedex` initializes the Pokédex by fetching and displaying Pokémon data,
 * and setting up a click event listener for a "Load More" button.
 */
async function initializePokedex(){
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
initializePokedex();











/**
 * The function `getPokemonCount` fetches the count of Pokémon from the PokeAPI.
 * @returns the number of Pokémon count.
 */
async function getPokemonCount() {
  let pokemonCount;

  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    pokemonCount = data.count;
    return pokemonCount;
  } catch (error) {
    console.error('Error fetching Pokémon count:', error);
    
    throw error;
   
  }
  
}

/**
 * The function `getPokemonInfo` fetches information about a Pokémon named Registeel from the PokeAPI
 * and returns an object containing its name, attack and defense stats, types, and front default
 * sprite.
 * @returns The function `getPokemonInfo` is returning an object `pokemonData` which contains the
 * following properties:
 */
async function getPokemonInfo(id) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    
    const pokemonData = {
      name: data.name,
      attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
      defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
      types: data.types.map(type => type.type.name),
      frontDefaultSprite: data.sprites.other['official-artwork'].front_default
    };
    displayCard(pokemonData);
  } catch (error) {
    displayErrorImage()
    console.error('Error fetching Pokemon info:', error);
    throw error;
    
  }
}




/**
 * The function `displayCard` creates and displays a Pokemon card with information such as name,
 * attack, defense, sprite, and types.
 * @param pokemonData - The `pokemonData` parameter is an object that contains information about a
 * specific Pokemon. It includes properties such as `name`, `attack`, `defense`, `frontDefaultSprite`,
 * and `types`.
 */
const pokemonCard = document.createElement('div')
async function displayCard(pokemonData){
   
  try {
    
    const pokemonCard = document.createElement('div')
    pokemonCard.classList.add("pokemonCard")
    console.log(pokemonData.name)
    const pokemonName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    
    const attack = pokemonData.attack;
    const defense = pokemonData.defense;
    const spriteUrl = pokemonData.frontDefaultSprite;
    const typesDiv = pokemonData.types.map((element) => {
      const type = document.createElement("div")
      type.textContent = element;
      type.classList.add("type1")
      const color = getPokemonColor(element)
      type.style.backgroundColor = color;
      return `<div class="type" style="background-color:${color};">${element}</div>`
  }).join(" ");


    const pokemonCardInnerHTML= ` <div class="pokemon-info">
    <div class="pokemon-stats">
      <h2 id="pokemonName">${pokemonName}</h2>

      <div class="attack_container">
        <div><p id="pokemonAttack">${attack}</p></div>
        <p>Attack</p>
      </div>
      <div class="defense_container">
        <div id="pokemonDefense">${defense}</div>
        <p>Defense</p>
      </div>
      <div class="types" id="pokemonTypes">
      ${typesDiv}
      </div>
    </div>
    </div>
    <div class="pokemon_image">
    <img src="${spriteUrl}" alt="pokemon sprite" id="pokemonSprite" />
    </div>`

    pokemonCard.innerHTML  = pokemonCardInnerHTML;
    pokemonCard.setAttribute("data-aos","fade-up");
    
    AOS.init();
   
    const firstType = pokemonData.types[0]; // Assuming types is an array of type strings
    const backgroundColor = getPokemonColor(firstType);
    pokemonCard.style.background = `linear-gradient(to right, #F6F7F9 59%, ${backgroundColor} 50%)`;
    
    pokemonContainer.appendChild(pokemonCard)
    
  } catch (error) {
      console.error(`Can fetch the Data :${error}`)
      

  }
}




/**
 * The function `getPokemonColor` takes a type of Pokemon as input and returns the corresponding color
 * code.
 * @param type - The `type` parameter is a string that represents the type of a Pokémon.
 * @returns a color code in hexadecimal format based on the input type. If the input type matches one
 * of the known types, the corresponding color code is returned. If the input type is unknown, the
 * function returns black (#000000).
 */
function getPokemonColor(type){
  switch (type.toLowerCase()) {
    case 'normal':
      return '#A8A878';
    case 'fire':
      return '#F08030';
    case 'water':
      return '#6890F0';
    case 'electric':
      return '#F8D030';
    case 'grass':
      return '#78C850';
    case 'ice':
      return '#98D8D8';
    case 'fighting':
      return '#C03028';
    case 'poison':
      return '#A040A0';
    case 'ground':
      return '#E0C068';
    case 'flying':
      return '#A890F0';
    case 'psychic':
      return '#F85888';
    case 'bug':
      return '#A8B820';
    case 'rock':
      return '#B8A038';
    case 'ghost':
      return '#705898';
    case 'dragon':
      return '#7038F8';
    case 'dark':
      return '#705848';
    case 'steel':
      return '#B8B8D0';
    case 'fairy':
      return '#EE99AC';
    default:
      return '#000000'; // Return black for unknown types
  }
}




// Search Pokemon

const searchPokemon = document.querySelector("#searchPokemon")

const filterationForm = document.querySelector(".filteration")
const errorImage = document.querySelector(".errorImage")

filterationForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    pokemonContainer.innerHTML = "";
    
    try {
      
      const pokemon = searchPokemon.value.toLowerCase()
      const pokemonName = await getPokemonInfo(pokemon)
      if(pokemon ===""){
        pokemonContainer.innerHTML = `<img src="./img/teamRocket.png" alt="" class="errorImage">
        `
        loadMoreBtn.style.display = "none";
      } else{
        
      
      
      displayCard(pokemonName)
      
  
      loadMoreBtn.style.display = "none"
      }
      
    
    } catch (error) {
      console.error(error)
 
      
    }
  
})


const loadMoreBtn = document.getElementById('loadMoreBtn');
displayErrorImage =() => {
 pokemonContainer.innerHTML = `<img src="./img/teamRocket.png" alt="" class="errorImage">
  `
  loadMoreBtn.style.display = "none";
}
