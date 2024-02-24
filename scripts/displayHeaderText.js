/**
 * The function `displayHeader` asynchronously retrieves the count of Pokemons and displays it in the
 * headline text.
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
  
export async function displayHeader(){
    const headlineText = document.getElementById("headlineText")
    try{
    const count = await getPokemonCount()
   
    headlineText.textContent= `${count.toLocaleString()} Pokemons for you to choose your favorite`
    }
    catch(error){
      console.error(error)
      
    }
  }