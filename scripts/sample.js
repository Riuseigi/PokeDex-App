// Get the modal element
var modal = document.getElementById("myModal");

// Get the close button element
var closeBtn = document.querySelector(".close");

// When the user clicks the button, open the modal
document.getElementById("myBtn").addEventListener("click", function() {
  modal.style.display = "block";
});

// When the user clicks on the close button, close the modal
closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});

const pokemonContainer = document.getElementById("pokemonContainer")
// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});



