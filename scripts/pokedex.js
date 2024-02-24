
/* This code is adding a click event listener to an element with the class "hamburger". When the
element is clicked, it toggles the "active" class on both the element with the class "navLinks" and
the element with the class "hamburger". This is commonly used to create a toggle effect, such as
opening and closing a navigation menu when clicking on a hamburger icon. */
document.querySelector('.hamburger').addEventListener('click', function() {
  document.querySelector('.navLinks').classList.toggle('active');
  document.querySelector('.hamburger').classList.toggle('active');
});





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
//Call the function to display the Header
displayHeader();


//Initialization
const pokemonPerPage = 30;
let currentPage = 1;

// This function display the number of pokemon specified
async function fetchAndDisplayPokemons(page){
  try {
    const startIndex = (page - 1) * pokemonPerPage + 1;
    const endIndex = startIndex + pokemonPerPage - 1;
   
    const promises = [];
    for (let i = startIndex; i <= endIndex; i++) {
      promises.push(getPokemonInfo(i));
    }
    (await Promise.all(promises)).forEach(pokemon =>{
      displayCard(pokemon)
    })
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
 * The function `getPokemonCount` asynchronously fetches the count of Pokémon from the PokeAPI and
 * handles errors appropriately.
 * @returns The `getPokemonCount` function is returning the total count of Pokémon available in the
 * API.
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
    displayErrorImage()
    throw error;
   
  }
  
}


// get the response.json
async function fetchPokemonData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return await response.json();
  } catch (error) {
    displayErrorImage()
    console.error('Error fetching data:', error);
    throw error;
   
  }
}

// get the pokemonData
async function getPokemonInfo(id) {
  const pokemonCache = new Map();
  try {
    if (pokemonCache.has(id)) {
      return pokemonCache.get(id);
    }
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const data = await fetchPokemonData(url);
    const pokemonData = await createPokemonData(data);
    pokemonCache.set(id, pokemonData);
    
    return pokemonData;
  } catch (error) {
    console.error('Error fetching Pokemon info:', error);
    throw error;
  }
}

// create the pokemonData within this function
async function createPokemonData(data) {
  try {
    const pokemonData = {
      name: data.name,
      id: data.id,
      attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
      defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
      speed: data.stats.find(stat => stat.stat.name === 'speed').base_stat,
      specialAttack: data.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
      specialDefense: data.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
      types: data.types.map(type => type.type.name),
      frontDefaultSprite: data.sprites.other['official-artwork'].front_default,
      cry: data.cries.latest,
      weight: data.weight, 
      height: data.height 
    };
  
    // Check if moves array is not empty before accessing move property
    if (data.moves.length > 0) {
      pokemonData.specialMove = data.moves.find(move => move.version_group_details[0].move_learn_method.name === 'level-up').move.name;
    } else {
      pokemonData.specialMove = "Unknown"; // or any default value
    }
  
    const speciesUrl = data.species.url;
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
    const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || '';
    const cleanedDescription = description.replace(/[\u0000-\u001F]/g, ' ');
    pokemonData.description = cleanedDescription;
    
    return pokemonData;
  } catch (error) {
    console.error(`Cant create pokemon data: ${error}`)
  }
  
}




//Display the pokemon in Card and Modal
const pokemonContainer = document.getElementById("pokemonContainer");
async function displayCard(pokemonData){
   
  try {
   
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add("pokemonCard");
  
    const pokemonName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    //Initialize all the pokemonData comes from pokeAPI
    const attack = pokemonData.attack;
    const defense = pokemonData.defense;
    const speed = pokemonData.speed;
    const specialAttack = pokemonData.specialAttack;
    const specialDefense = pokemonData.specialDefense;
    const spriteUrl = pokemonData.frontDefaultSprite;
    const id = pokemonData.id;
    const description = pokemonData.description;
    const pokemonCry  = pokemonData.cry;
    const pokemonWeight = pokemonData.weight;
    const pokemonHeight = pokemonData.height;
    const firstType = pokemonData.types[0]; // Assuming types is an array of type strings
    const pokemonColor = getPokemonColors(firstType);
    const specialMove = pokemonData.specialMove.charAt(0).toUpperCase() + pokemonData.specialMove.slice(1).replace(/-/g, ' ');

    // this takes the color of the types and return a div element
    const typesDiv = pokemonData.types.map((element) => {
      const type = document.createElement("div")
      type.textContent = element;
      type.classList.add("type1")
      const color = getPokemonColors(element)
      type.style.backgroundColor = color;
      return `<div class="type" style="background-color:${color.color};">${element}</div>`
  }).join(" ");
  
  
    // Card Content
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

    // PokemonCard set animation
    pokemonCard.setAttribute("data-aos","fade-up");

    //Modal Card
    pokemonCard.addEventListener("click",() => {
      var modal = document.getElementById("myModal");

      // not iterate the pokemon modal
      modal.innerHTML = "";

      // create modal card Element
      const modalCard = document.createElement("div");
      modalCard.classList.add("modal-content");
      modal.appendChild(modalCard);
      
      //add the pokemon sound
      const cryAudio = new Audio(pokemonCry);
      //dipslay the pokemon type and apply according to type
      const typesDivModal = pokemonData.types.map((element) => {
        const type = document.createElement("div");
        type.textContent = element;
        type.classList.add("type1");
        type.style.backgroundColor = pokemonColor.color;
        return `<div class="modal-type" style="background-color:${pokemonColor.color};">${element}</div>`;
      }).join(" ");
    
      //add content of my modal and apply the pokemon Data
      const modalContent = `
        <span class="close">&times;</span>
        <div class="modal-content__card">
          <div id="imageSprite" class="modal-content__imageSprite">
            <img class="pokeball" src="./img/pokeball-background.svg" alt="" srcset="">
            <img class="pokemon" src="${spriteUrl}" alt="">
          </div>
          <div class="pokemonInfo ">
            <div class="pokemonID">
              <div class="pokemonName">${pokemonName}<span class="id" style="background-color:${pokemonColor.color}">${id}</span></div>
            </div>
            <div class="modal-types">
              ${typesDivModal}
            </div>
            <h1 class="headText" style="color:${pokemonColor.color}">About</h1>
            <div class="pokemon_about">
              <div class="pokemon_weight">
                <div class="icon">
                  <img src="./img/weight.svg" alt="">
                  <p>${pokemonWeight}g</p>
                </div>
                <div class="label">Weight</div>
              </div>
              <div class="pokemon_height">
                <div class="icon">
                  <img src="./img/height.svg" alt="weight icon" >
                  <p>${pokemonHeight}cm</p>
                </div>
                <div class="label">Height</div>
              </div>
              <div class="special-moves">
                <img src="./img/move.svg" alt="">
                <p class="move">${specialMove}</p>
                <div class="label">Move</div>
              </div>
            </div>
            <p class="pokemon_description">${description}</p>
            <h1 class="headText" style="color:${pokemonColor.color}">Base Stats</h1>
            <div class="base-stats">
              <div class="stat">
                <div class="stats-label" style="color:${pokemonColor.color}">ATK <span>${attack}</span></div>
                <div class="bar" style="background-color:${pokemonColor.backgroundColor}"><div class="progress" style="width: ${attack}%; background-color: ${pokemonColor.color};"></div></div>
              </div>
              <div class="stat">
                <div class="stats-label" style="color:${pokemonColor.color}">DEF <span>${defense}</span></div>
                <div class="bar" style="background-color:${pokemonColor.backgroundColor}"><div class="progress" style="width: ${defense}%; background-color: ${pokemonColor.color};"></div></div>
              </div>
              <div class="stat">
                <div class="stats-label" style="color:${pokemonColor.color}">SPD <span>${speed}</span></div>
                <div class="bar" style="background-color:${pokemonColor.backgroundColor}"><div class="progress" style="width: ${speed}%; background-color: ${pokemonColor.color};"></div></div>
              </div>
              <div class="stat">
                <div class="stats-label" style="color:${pokemonColor.color}">SATK <span>${specialAttack}</span></div>
                <div class="bar" style="background-color:${pokemonColor.backgroundColor}"><div class="progress" style="width: ${specialAttack}%; background-color: ${pokemonColor.color};"></div></div>
              </div>
              <div class="stat">
                <div class="stats-label" style="color:${pokemonColor.color}">SDEF <span>${specialDefense}</span></div>
                <div class="bar" style="background-color:${pokemonColor.backgroundColor}"><div class="progress" style="width: ${specialDefense}%; background-color: ${pokemonColor.color};"></div></div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // display the modal also play the pokemon sound
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
      cryAudio.play();
    
      modalCard.innerHTML = modalContent;
      // set the background according to the pokemon type
      modalCard.style.backgroundColor = pokemonColor.color;
    


      //close btn
      const closeBtn = modal.querySelector(".close");
      closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        cryAudio.pause();
      });
    });
    //this function is for animation on displaying the card
    AOS.init();
   
    
    
    pokemonCard.style.background = `linear-gradient(to right, #F6F7F9 59%, ${pokemonColor.color} 50%)`;

    //Validate the pokemon Card
    if (pokemonContainer) {
      pokemonContainer.appendChild(pokemonCard);
    } else {
      console.error("pokemonContainer not found");
    }
  } catch (error) {
      console.error(`Can fetch the Data :${error}`)
      

  }
}



function getPokemonColors(type) {
  switch (type.toLowerCase()) {
    case 'normal':
      return { color: '#A8A878', backgroundColor: 'rgba(168, 168, 120, 0.2)' };
    case 'fire':
      return { color: '#F08030', backgroundColor: 'rgba(240, 128, 48, 0.2)' };
    case 'water':
      return { color: '#6890F0', backgroundColor: 'rgba(104, 144, 240, 0.2)' };
    case 'electric':
      return { color: '#F8D030', backgroundColor: 'rgba(248, 208, 48, 0.2)' };
    case 'grass':
      return { color: '#78C850', backgroundColor: 'rgba(120, 200, 80, 0.2)' };
    case 'ice':
      return { color: '#98D8D8', backgroundColor: 'rgba(152, 216, 216, 0.2)' };
    case 'fighting':
      return { color: '#C03028', backgroundColor: 'rgba(192, 48, 40, 0.2)' };
    case 'poison':
      return { color: '#A040A0', backgroundColor: 'rgba(160, 64, 160, 0.2)' };
    case 'ground':
      return { color: '#E0C068', backgroundColor: 'rgba(224, 192, 104, 0.2)' };
    case 'flying':
      return { color: '#A890F0', backgroundColor: 'rgba(168, 144, 240, 0.2)' };
    case 'psychic':
      return { color: '#F85888', backgroundColor: 'rgba(248, 88, 136, 0.2)' };
    case 'bug':
      return { color: '#A8B820', backgroundColor: 'rgba(168, 184, 32, 0.2)' };
    case 'rock':
      return { color: '#B8A038', backgroundColor: 'rgba(184, 160, 56, 0.2)' };
    case 'ghost':
      return { color: '#705898', backgroundColor: 'rgba(112, 88, 152, 0.2)' };
    case 'dragon':
      return { color: '#7038F8', backgroundColor: 'rgba(112, 56, 248, 0.2)' };
    case 'dark':
      return { color: '#705848', backgroundColor: 'rgba(112, 88, 72, 0.2)' };
    case 'steel':
      return { color: '#B8B8D0', backgroundColor: 'rgba(184, 184, 208, 0.2)' };
    case 'fairy':
      return { color: '#EE99AC', backgroundColor: 'rgba(238, 153, 172, 0.2)' };
    default:
      return { color: '#000000', backgroundColor: 'rgba(0, 0, 0, 0.2)' }; // Return black for unknown types
  }
}

//Filteration
const pokemonTypeFilter = document.getElementById("pokemonTypeFilter");
pokemonTypeFilter.addEventListener("change", async function() {
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
  pokemonNames.length = 0;
  try {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=2000`;

    const data = await fetchPokemonData(url);
    const allPokemon = data.results;

    // Filter Pokemon by type
    await Promise.all(
      allPokemon.map(async pokemon => {
        const id = pokemon.url.split('/').slice(-2, -1)[0];
        const pokemonData = await getPokemonInfo(id);
        const hasDesiredType = pokemonData.types && pokemonData.types.some(type => type === pokemonType);

        if (hasDesiredType || pokemonType === "all") {
          displayCard(pokemonData);
        }
      })
    );

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
  event.preventDefault();
  pokemonContainer.innerHTML = "";

  try {
    //convert the input into lower case
    const pokemon = searchPokemon.value.toLowerCase();
    //get the pokemon Data
   const pokemonCard = await getPokemonInfo(pokemon);
   //display on the card
   displayCard(pokemonCard)
    loadMoreBtn.style.display = "none";
  } catch (error) {
    console.error(`Cant fetch the pokemon: ${error}`);
  }
});

const loadMoreBtn = document.getElementById('loadMoreBtn');
let hasError = false
displayErrorImage =() => {
 pokemonContainer.innerHTML = `<img src="./img/teamRocket.png" alt="" class="errorImage">
  `
  loadMoreBtn.style.display = "none";
}
