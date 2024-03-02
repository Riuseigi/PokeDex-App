const pokemonContainer = document.getElementById("pokemonContainer");
import { getPokemonColors } from './getPokemonColors.js';
//Display the pokemon in Card and Modal
export async function displayCard(pokemonData){
   
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
      cryAudio.volume = 0.5;
    
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
