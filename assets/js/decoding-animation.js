document.addEventListener('DOMContentLoaded', function() {
  const dnaMatrix = document.getElementById('decoding-animation');
  const srctext = dnaMatrix.textContent;
  dnaMatrix.textContent = null;
  const rect = dnaMatrix.getBoundingClientRect();
  const charHeight = 30;  
  const charWidth = charHeight * 0.8;
  const rows = 1;
  const cols = Math.floor(rect.width / charWidth);
  const nucleotides = ['A', 'C', 'T', 'G'];
  const binaryDigits = ['0', '1'];
  const chars = [];
  const delayOffset = 0.5;
  const delayWindow = 1;
  const blendDuration = 0.5;
  const animationRadius = 100; // Radius in pixels
  const animationChance = 1; // Chance of animation on mouseover

  dnaMatrix.style.height = `${charHeight * rows}px`;
  
  function startDecodingSequence(char, delayInitial) {
    if (!char.classList.contains('decoding')) {
      char.classList.add('decoding');
      const randomNucleotide = nucleotides[Math.floor(Math.random() * nucleotides.length)];
      char.textContent = randomNucleotide;
      char.style.color = 'rgb(60%, 60%, 60%)';
      const delay = delayInitial + Math.random() * delayWindow;
      char.style.animation = `blendOut ${blendDuration}s linear ${delay}s 1 forwards`;

      char.addEventListener('animationend', function animationSequence() {
        const randomBinary = binaryDigits[Math.floor(Math.random() * binaryDigits.length)];
        char.textContent = randomBinary;
        char.style.animation = `blendIn ${blendDuration}s linear 0s 1 forwards`;
        char.addEventListener('animationend', () => {
          const delay = delayOffset + Math.random() * delayWindow;
          char.style.animation = `blendOut ${blendDuration}s linear ${delay}s 1 forwards`;
          char.addEventListener('animationend', () => {
            char.textContent = char.dataset.final_char;
            char.style.color = 'rgb(0, 0, 0)';
            char.style.animation = `blendIn ${blendDuration}s linear 0s 1 forwards`;
            char.addEventListener('animationend', () => {
              char.classList.remove('decoding');
            }, { once: true });
          }, { once: true });
        }, { once: true });
      }, { once: true });
    }
  }

  function createDNAMatrix() {
    const middleRow = Math.floor((rows - 1) / 2);
    const startCol = Math.max(0, Math.floor((cols - srctext.length) / 2));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const randomNucleotide = nucleotides[Math.floor(Math.random() * nucleotides.length)];
        const char = document.createElement('span');
        char.classList.add('decoding-char');
        char.textContent = randomNucleotide;
        char.style.fontSize = `${charHeight*0.9}px`;
        char.style.left = `${j * charWidth}px`;
        char.style.top = `${i * charHeight}px`;
        char.style.width = `${charWidth}px`;
        char.style.height = `${charHeight}px`;
        char.style.display = 'inline-block';
               
        // Set final_char based on the centered position
        if (i === middleRow && j >= startCol && j < startCol + srctext.length) {
          char.dataset.final_char = srctext[j - startCol];
        } else {
          char.dataset.final_char = ' ';
        }

        startDecodingSequence(char, delayOffset);  // Start initial animation
        
        dnaMatrix.appendChild(char);
        chars.push(char);
      }
    }
  }

  function animateNearbyChars(event) {
    const rect = dnaMatrix.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    chars.forEach(char => {
      const charRect = char.getBoundingClientRect();
      const charCenterX = charRect.left + charRect.width / 2 - rect.left;
      const charCenterY = charRect.top + charRect.height / 2 - rect.top;

      const distance = Math.sqrt(
        Math.pow(mouseX - charCenterX, 2) + Math.pow(mouseY - charCenterY, 2)
      );

      if (distance <= animationRadius) {
        if (animationChance * (distance/animationRadius) > Math.random()) {
          startDecodingSequence(char, 0);
        }
      }
    });
  }

  dnaMatrix.addEventListener('mousemove', animateNearbyChars);

  createDNAMatrix();
});