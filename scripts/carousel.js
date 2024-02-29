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
const createCardNavigation = async (pokemon) =>{
    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const spriteUrl = pokemon.spriteUrl;
     //Initialize all the pokemonData comes from pokeAPI
     const attack = pokemon.attack;
     const defense = pokemon.defense;
     const speed = pokemon.speed;
     const specialAttack = pokemon.specialAttack;
     const specialDefense = pokemon.specialDefense;
    const artworkImage = pokemon.frontDefaultSprite;
     const id = pokemon.id;
     const description = pokemon.description;
     const pokemonCry  = pokemon.cry;
     const pokemonWeight = pokemon.weight;
     const pokemonHeight = pokemon.height;
     const firstType = pokemon.types[0]; // Assuming types is an array of type strings
     const pokemonColor = getPokemonColors(firstType);
     const specialMove = pokemon.specialMove.charAt(0).toUpperCase() + pokemon.specialMove.slice(1).replace(/-/g, ' ');
     const cryAudio = new Audio(pokemonCry);
     // this takes the color of the types and return a div element
     const typesDiv = pokemon.types.map((element) => {
       const type = document.createElement("div")
       type.textContent = element;
       
       const color = getPokemonColors(element)
       type.style.backgroundColor = color;
       return `<div class="type" style="background-color:${color.color};">${element}</div>`
   }).join(" ");
    const pokemonCardContent = document.createElement("div");
    pokemonCardContent.classList.add("pokemonCard")
    const cardContentInnerHtml = `
    <div class="imageContainer">
      <img src="${spriteUrl}" alt="" draggable="false"/>
    </div>
    <div class="pokemonNameCard"><span>${pokemonName}</span></div>
    `
    pokemonCardContent.innerHTML = cardContentInnerHtml;

    navigationContainer.appendChild(pokemonCardContent)

    pokemonCardContent.addEventListener("click",() => {
      const carouselContainer = document.querySelector(".carousel-container")
    cryAudio.play()
      const carouselItemContent = `<div class="carousel-item">
      <div class="pokemonSprite-container">
        <img
          src="./img/pokeball-background.svg"
          alt=""
          srcset="pokeball Backgrounnd"
          class="pokeballBG"
        />
        <img
          src="${artworkImage}"
          alt="Pokemon 1"
          class="pokemonSprite"
        />
      </div>

      <div class="pokemonInfo">
       
        <h1 class="pokemonName">${pokemonName}<span style=" background-color:${pokemonColor.color}">${id}</span></h1>
        <div class="types">${typesDiv}</div>
        <p class="pokemon-description" style="color:${pokemonColor.color}">
          ${description}
        </p>

        <div class="base-stats">
          <div class="stat">
            <div class="stats-label" style="color:${pokemonColor.color}">
              ATK <span>${attack}</span>
            </div>
            <div
              class="bar"
              style="background-color:${pokemonColor.backgroundColor}"
            >
              <div
                class="progress"
                style="width: ${attack}%; background-color: ${pokemonColor.color};"
              ></div>
            </div>
          </div>
          <div class="stat">
            <div class="stats-label" style="color:${pokemonColor.color}">
              DEF <span>${defense}</span>
            </div>
            <div
              class="bar"
              style="background-color:${pokemonColor.backgroundColor}"
            >
              <div
                class="progress"
                style="width: ${defense}%; background-color: ${pokemonColor.color};"
              ></div>
            </div>
          </div>
          <div class="stat">
            <div class="stats-label" style="color:${pokemonColor.color}">
              SPD <span>${speed}</span>
            </div>
            <div
              class="bar"
              style="background-color:${pokemonColor.backgroundColor}"
            >
              <div
                class="progress"
                style="width: ${speed}%; background-color: ${pokemonColor.color};"
              ></div>
            </div>
          </div>
          <div class="stat">
            <div class="stats-label" style="color:${pokemonColor.color}">
              SATK <span>${specialAttack}</span>
            </div>
            <div
              class="bar"
              style="background-color:${pokemonColor.backgroundColor}"
            >
              <div
                class="progress"
                style="width: ${specialAttack}%; background-color: ${pokemonColor.color};"
              ></div>
            </div>
          </div>
          <div class="stat">
            <div class="stats-label" style="color:${pokemonColor.color}">
              SDEF <span>${specialDefense}</span>
            </div>
            <div
              class="bar"
              style="background-color:${pokemonColor.backgroundColor}"
            >
              <div
                class="progress"
                style="width: ${specialDefense}%; background-color: ${pokemonColor.color};"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>`
    carouselContainer.innerHTML = carouselItemContent;
    })
    cryAudio.stop()
}


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

