import { displayErrorImage } from './displayErrorMessage.js';
//fetch the data using the url
export async function fetchPokemonData(url) {
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