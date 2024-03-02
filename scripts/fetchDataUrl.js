import { displayErrorImage } from './displayErrorMessage.js';
/**
 * The function `fetchPokemonData` fetches data from the given url using the fetch API.
 * If the response is not ok, it will display an error message and throw an error.
 * @param {string} url - The url to fetch data from
 * @returns {Promise<Object>} - The parsed JSON response from the url
 */
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
