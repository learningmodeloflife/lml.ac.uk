function typeWriter(textElement, text, i, fnCallback) {
    if (i < text.length) {
      textElement.innerHTML = text.substring(0, i+1) + '<span class="typewriter-cursor"></span>';
  
      setTimeout(function() {
        typeWriter(textElement, text, i + 1, fnCallback)
      }, 300);
    } else if (typeof fnCallback == 'function') {
      setTimeout(fnCallback, 700);
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    let element = document.querySelector('.typewriter');
    let textElement = element.querySelector('.typewriter-text');
    let text = textElement.textContent;
    textElement.style.visibility = 'hidden';
    let cursorElement = element.querySelector('.typewriter-cursor');
    
    // Add a delay before starting the animation
    setTimeout(function() {
      textElement.textContent = '';
      textElement.style.visibility = 'visible';
      typeWriter(textElement, text, 0, function() {
        cursorElement.style.display = 'none';
      });
    }, 1000); // 1000 milliseconds = 1 second delay
  });