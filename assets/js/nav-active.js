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

function stripTrailing(string) {
    if (string.length > 1 && string.endsWith("/")) {
        return string.slice(0, -1);
    }
    else {
        return string
    }

}

document.addEventListener('DOMContentLoaded', function() {
    var currentPath = window.location.pathname;
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      linkpath = stripTrailing(getFilePath(link.getAttribute('href')))
      currentPath = stripTrailing(currentPath)
      console.log(linkpath + " | " + currentPath)
      if (linkpath === currentPath) {
        link.classList.add('active');
        console.log("--> active")
      }
    });
  });


