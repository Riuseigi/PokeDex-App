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
   
    const promises = [];
    for (let i = startIndex; i <= endIndex; i++) {
      promises.push(getPokemonInfo(i));
    }
    await Promise.all(promises)
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
 * The function `getPokemonInfo` fetches information about a Pokemon from the PokeAPI and stores it in
 * a cache, then displays the Pokemon's data on a card.
 * @param id - The `id` parameter is the ID of the Pokemon that you want to fetch information for. It
 * is used to construct the URL for the API request to the PokeAPI.
 * @returns The function `getPokemonInfo` does not have an explicit return statement. However, it does
 * call the `displayCard` function with the `pokemonData` object as an argument.
 */
async function fetchPokemonData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}



async function getPokemonInfo(id) {
  const pokemonCache = new Map();
  try {
    if (pokemonCache.has(id)) {
      return pokemonCache.get(id);
    }
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
 
    const data = await fetchPokemonData(url);
  
    const pokemonData = {
      name: data.name,
      id: data.id,
      attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
      defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
      speed: data.stats.find(stat => stat.stat.name === 'speed').base_stat,
      specialAttack: data.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
      specialDefense: data.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
     
      specialMove: data.moves[0].move.name,
      types: data.types.map(type => type.type.name),
      frontDefaultSprite: data.sprites.other['official-artwork'].front_default,
      cry: data.cries.latest
  };
    pokemonCache.set(id, pokemonData);
    displayCard(pokemonData);

   
  } catch (error) {
    
    console.error('Error fetching Pokemon info:', error);
    throw error;
    
  }
}

async function getPokemonDataForFilter(id) {
  const pokemonCache = new Map();
  try {
    if (pokemonCache.has(id)) {
      return pokemonCache.get(id);
    }
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
  
    const data = await fetchPokemonData(url);
    
    const pokemonData = {
      name: data.name,
      attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
      defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
      types: data.types.map(type => type.type.name),
      frontDefaultSprite: data.sprites.other['official-artwork'].front_default
    };
    pokemonCache.set(id, pokemonData);
    return pokemonData;

   
  } catch (error) {
    
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
  const pokemonCry  = pokemonData.cry;
  console.log(pokemonCry)

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
    pokemonCard.addEventListener("click",() => {
      var modal = document.getElementById("myModal");
      modal.innerHTML = "";
      const modalCard = document.createElement("div")
      modalCard.classList.add("modal-content")
      modal.appendChild(modalCard)
      const cryAudio = new Audio(pokemonCry);
     
    
      
      const modalContent = `
      <span class="close">&times;</span>
      <div class="modal-content__card">
        
      <div id="imageSprite" class="modal-content__imageSprite">
      <img class="pokeball" src="./img/pokeball-background.svg" alt="" srcset="">
        <img class="pokemon" src="${spriteUrl}" alt="" >
        
        </div>
        
        <div class="pokemonInfo ">
          <div class="pokemonID">
            <h1 class="pokemonName">Pikachu<span class="id">#25</span></h1>
        </div>
          <div class="modal-types">
            <div class="modal-type">Water</div>
            <div class="modal-type">Fire</div>
          </div>
           
            <h1 class="headText">About</h1>
            <div class="pokemon_about">
                
                <div class="pokemon_weight">

                  <div class="icon">
                    <img src="./img/weight.svg" alt="">
                    <p>8,5kg</p>
                  </div>
                  <div class="label">Weight</div>
                </div>
                <div class="pokemon_height">
                  <div class="icon">
                    <img src="./img/height.svg" alt="weight icon" >
                    <p>8,5kg</p>
                    </div>
                  <div class="label">Height</div>
                </div>
                <div class="special-moves">
                  <img src="./img/move.svg" alt="">
                  <p class="move">Static</p>
                  <div class="label">Move</div>
                </div>
            </div>
            <p class="pokemon_description">When it is angered, it immediately discharges the energy stored in the pouches in its cheeks.</p>
            <h1 class="headText">Base Stats</h1>
            <div class="base-stats">
                
              <div class="stat">
                <div class="stats-label">ATK <span>34</span></div>
                
                <div class="bar"><div class="progress" style="width: 80%;"></div></div>
              </div>
              <div class="stat">
                <div class="stats-label">DEF <span>34</span></div>
                <div class="bar"><div class="progress" style="width: 70%;"></div></div>
              </div>
              <div class="stat">
                <div class="stats-label">SPD <span>34</span></div>
                <div class="bar"><div class="progress" style="width: 60%;"></div></div>
              </div>

              <div class="stat">
                <div class="stats-label">SATK <span>34</span></div>
                <div class="bar"><div class="progress" style="width: 90%;"></div></div>
              </div>
              <div class="stat">
                <div class="stats-label">SDEF <span>34</span></div>
                
                <div class="bar"><div class="progress" style="width: 85%;"></div></div>
              </div>
            </div>
        </div>
     
    </div>
 `


      modal.style.display = "block";
      document.body.style.overflow = "hidden";
      cryAudio.play();
      document.addEventListener('DOMContentLoaded', function() {
        // Your JavaScript code here
        const modalContentElement = document.querySelector('.modal-content');
        modalContentElement.style.backgroundColor = 'red'; // Or any other style change
      });
     
      
      modalCard.innerHTML = modalContent;
      modalCard.style.backgroundColor = backgroundColor;



      //close btn
      const closeBtn = modal.querySelector(".close");
      closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto"
        cryAudio.pause()
      });
    });
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

function getBackgroundPokemonColor(type){
  switch (type.toLowerCase()) {
    case 'normal':
      return 'rgba(168, 168, 120, 0.2)';
    case 'fire':
      return 'rgba(240, 128, 48, 0.2)';
    case 'water':
      return 'rgba(104, 144, 240, 0.2)';
    case 'electric':
      return 'rgba(248, 208, 48, 0.2)';
    case 'grass':
      return 'rgba(120, 200, 80, 0.2)';
    case 'ice':
      return 'rgba(152, 216, 216, 0.2)';
    case 'fighting':
      return 'rgba(192, 48, 40, 0.2)';
    case 'poison':
      return 'rgba(160, 64, 160, 0.2)';
    case 'ground':
      return 'rgba(224, 192, 104, 0.2)';
    case 'flying':
      return 'rgba(168, 144, 240, 0.2)';
    case 'psychic':
      return 'rgba(248, 88, 136, 0.2)';
    case 'bug':
      return 'rgba(168, 184, 32, 0.2)';
    case 'rock':
      return 'rgba(184, 160, 56, 0.2)';
    case 'ghost':
      return 'rgba(112, 88, 152, 0.2)';
    case 'dragon':
      return 'rgba(112, 56, 248, 0.2)';
    case 'dark':
      return 'rgba(112, 88, 72, 0.2)';
    case 'steel':
      return 'rgba(184, 184, 208, 0.2)';
    case 'fairy':
      return 'rgba(238, 153, 172, 0.2)';
    default:
      return 'rgba(0, 0, 0, 0.2)'; // Return black with 20% opacity for unknown types
  }
}

//Filteration
const pokemonTypeFilter = document.getElementById("pokemonTypeFilter");
pokemonTypeFilter.addEventListener("change",function() {
  const selectedType = this.value;
  pokemonFilter(selectedType)
});
const pokemonNames = [];
async function pokemonFilter(pokemonType) {
  pokemonContainer.innerHTML = "";
  pokemonNames.length = 0; // Clear the pokemonNames array

  try {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=2000`;

    const data = await fetchPokemonData(url);
    const allPokemon = data.results;

    // Filter Pokemon by type
    allPokemon.forEach(pokemon => {
      const id = pokemon.url.split('/').slice(-2, -1)[0];
      pokemonNames.push(id);
    });

    const promises = pokemonNames.map(async id => {
      const pokemonData = await getPokemonDataForFilter(id);
      const hasDesiredType = pokemonData.types.some(type => type === pokemonType);
      if (hasDesiredType || pokemonType === "all") {
        displayCard(pokemonData);
      }
    });

    await Promise.all(promises);

    loadMoreBtn.style.display = "none";
  } catch (error) {
    console.error("Error filtering Pokemons:", error);
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
