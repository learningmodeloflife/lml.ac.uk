function getFilePath(url) {
    try {
        if (url.startsWith("/")) {
            return url;
        }
        let parsedUrl = new URL(url);
        return parsedUrl.pathname;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var currentPath = window.location.pathname;
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      linkpath = getFilePath(link.getAttribute('href'))
      console.log(linkpath)
      if (linkpath === currentPath) {
        link.classList.add('active');
        console.log("--> active")
      }
    });
  });


