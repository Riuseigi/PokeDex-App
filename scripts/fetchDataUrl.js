import { displayErrorImage } from "./displayErrorMessage.js";

/**
 * The function `fetchPokemonData` fetches data from the given URL using the fetch API.
 * If the response is not ok, it will display an error message and throw an error.
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<Object>} - The parsed JSON response from the URL
 */
export async function fetchPokemonData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Network response was not ok. Status: ${response.status}`
      );
    }

    const responseBody = await response.text();
    if (!responseBody) {
      throw new Error("Received an empty response from the server.");
    }

    return JSON.parse(responseBody);
  } catch (error) {
    console.error("Error fetching data:", error);

    throw error;
  }
}
