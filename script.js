document.getElementById("year").innerHTML = new Date().getFullYear();
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.navLinks').classList.toggle('active');
    document.querySelector('.hamburger').classList.toggle('active');
  });
  