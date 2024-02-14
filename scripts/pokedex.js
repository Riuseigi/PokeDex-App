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



const headlineText = document.getElementById("headlineText")

async function displayHeader(){
  try{
  const count = await getPokemonCount()
 
  headlineText.textContent= `${count.toLocaleString()} Pokemons for you to choose your favorite`
  }
  catch(error){
    console.error(error)
  }
}
//Call the function
displayHeader()


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
async function getPokemonInfo() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/registeel');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    console.log(data)
    const pokemonData = {
      name: data.name,
      attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
      defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
      types: data.types.map(type => type.type.name),
      frontDefaultSprite: data.sprites.other['official-artwork'].front_default
    };
    return pokemonData;
  } catch (error) {
    console.error('Error fetching Pikachu info:', error);
    throw error;
  }
}





/**
 * The function `displayCard` is an asynchronous function that retrieves Pokemon information and
 * updates the DOM to display the Pokemon's name, attack, defense, sprite, and types.
 */
async function displayCard(){
//Dom initialization
const pokemonName = document.getElementById("pokemonName");
const pokemonAttack = document.getElementById("pokemonAttack");
const pokemonDefense = document.getElementById("pokemonDefense");
const type1 = document.getElementById("type1");
const pokemonSprite = document.getElementById("pokemonSprite");
const pokemonTypes = document.getElementById("pokemonTypes");

const pokemonCard = document.getElementById("pokemonCard")


pokemonTypes.innerHTML = ""
  try {
    
    const data = await getPokemonInfo();
    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const attack = data.attack;
    const defense = data.defense;
    const spriteUrl = data.frontDefaultSprite;
    
    pokemonName.textContent = name;
    pokemonAttack.textContent = attack;
    pokemonDefense.textContent = defense;
    pokemonSprite.src = spriteUrl;
    const firstType = data.types[0]; // Assuming types is an array of type strings
    const backgroundColor = getPokemonColor(firstType);
    pokemonCard.style.background = `linear-gradient(to right, #F6F7F9 59%, ${backgroundColor} 50%)`;
    data.types.forEach((element) => {
        const type = document.createElement("div")
        type.textContent = element;
        type.classList.add("type1")
        const color = getPokemonColor(element)
        type.style.backgroundColor = color;
        
        pokemonTypes.appendChild(type);
    })
    
    
  } catch (error) {
    
  }
}
displayCard()




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
