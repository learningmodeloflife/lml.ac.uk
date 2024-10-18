document.addEventListener('DOMContentLoaded', function() {
    var currentPath = window.location.pathname;
    var navLinks = document.querySelectorAll('.nav-link');
    console.log("nav js called")
    navLinks.forEach(function(link) {
      console.log(link)
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
        console.log("--> active")
      }
    });
  });