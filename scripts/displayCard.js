import { getPokemonColors } from './getPokemonColors.js';

const pokemonContainer = document.getElementById("pokemonContainer");

export async function displayCard(pokemonData) {
  try {
    //use Destructuring to get the properties from the pokemonData object
    const { name, attack, defense, speed, specialAttack, specialDefense, frontDefaultSprite: spriteUrl, id, description, cry: pokemonCry, weight: pokemonWeight, height: pokemonHeight, types, specialMove } = pokemonData;

    // create the pokemonCard
    const pokemonCard = document.createElement('div');
    // add class
    pokemonCard.classList.add("pokemonCard");
    // make first letter uppercase
    const pokemonName = name.charAt(0).toUpperCase() + name.slice(1);
    // get first type
    const firstType = types[0];
    // get pokemon colors
    const pokemonColor = getPokemonColors(firstType);
    // get types to apply on the type container
    const typesDiv = types.map((element) => {
      const color = getPokemonColors(element);
      return `<div class="type" style="background-color:${color.color};">${element}</div>`;
    }).join(" ");
    // content of the card and apply the data attributes
    const pokemonCardInnerHTML = `
      <div class="pokemon-info">
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
      </div>`;
    // add the animation using AOS
    pokemonCard.innerHTML = pokemonCardInnerHTML;
    pokemonCard.setAttribute("data-aos", "fade-up");

    // create the modal when clicked the specific card
    pokemonCard.addEventListener("click", () => {
     
      const modal = document.getElementById("myModal");
      //reset the modal
      modal.innerHTML = "";
      //create modalCard
      const modalCard = document.createElement("div");
      modalCard.classList.add("modal-content");
      modal.appendChild(modalCard);
      //display the type div in the modal
      const typesDivModal = types.map((element) => {
        const color = getPokemonColors(element);
        return `<div class="modal-type" style="background-color:${color.color};">${element}</div>`;
      }).join(" ");
      // content of the modal 
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
      //display the modal
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
      // add cry audio for pokemon
      const cryAudio = new Audio(pokemonCry);
      cryAudio.play();
      cryAudio.volume = 0.5;
      // set the content of the modal
      modalCard.innerHTML = modalContent;
      modalCard.style.backgroundColor = pokemonColor.color;
      //close the modal
      const closeBtn = modal.querySelector(".close");
      closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        cryAudio.pause();
      });
    });
    // call the AOS animation
    AOS.init();
    // add background color to the pokemon card depending on their type
    pokemonCard.style.background = `linear-gradient(to right, #F6F7F9 59%, ${pokemonColor.color} 50%)`;
    //validate and append the pokemon card
    if (pokemonContainer) {
      pokemonContainer.appendChild(pokemonCard);
    } else {
      console.error("pokemonContainer not found");
    }
  } catch (error) {
    console.error(`Can't fetch the Data: ${error}`);
  }
}
