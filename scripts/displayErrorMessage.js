
//function display error message
export const displayErrorImage = () => {
    pokemonContainer.innerHTML = `<img src="./img/teamRocket.png" alt="Error loading pokemon" class="errorImage">`;
    loadMoreBtn.style.display = "none";
};
   