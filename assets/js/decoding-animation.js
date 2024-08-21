document.addEventListener('DOMContentLoaded', function() {
  const dnaMatrix = document.getElementById('decoding-animation');
  const srctext = dnaMatrix.textContent;
  dnaMatrix.textContent = null;
  const rect = dnaMatrix.getBoundingClientRect();
  const charWidth = 16;
  const rows = 3;
  const cols = Math.floor(rect.width / charWidth);
  const nucleotides = ['A', 'C', 'T', 'G'];
  const binaryDigits = ['0', '1'];
  const chars = [];
  const delayOffset = 1;
  const delayWindow = 2;
  const blendDuration = 1;
        
  function createDNAMatrix() {
    const middleRow = Math.floor((rows - 1) / 2);
    const startCol = Math.max(0, Math.floor((cols - srctext.length) / 2));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const randomNucleotide = nucleotides[Math.floor(Math.random() * nucleotides.length)];
        const char = document.createElement('span');
        char.classList.add('decoding-char', 'decoding');
        char.textContent = randomNucleotide;
        
        char.style.left = `${j * charWidth}px`;
        char.style.top = `${i * 20}px`;
        
        const delay = delayOffset + Math.random()*delayWindow;
        char.style.animation = `blendOut ${blendDuration}s linear ${delay}s 1 forwards`;
        
        // Set final_char based on the centered position
        if (i === middleRow && j >= startCol && j < startCol + srctext.length) {
          char.dataset.final_char = srctext[j - startCol];
        } else {
          char.dataset.final_char = ' ';
        }

        char.addEventListener('animationend', () => {
          const randomBinary = binaryDigits[Math.floor(Math.random() * binaryDigits.length)];
          char.textContent = randomBinary;
          char.style.animation = `blendIn ${blendDuration}s linear 0s 1 forwards`;
          char.addEventListener('animationend', () => {
            const delay = delayOffset + Math.random()*delayWindow;
              char.style.animation = `blendOut ${blendDuration}s linear ${delay}s 1 forwards`;
            char.addEventListener('animationend', () => {
              char.textContent = char.dataset.final_char;
              char.style.animation = `blendIn ${blendDuration}s linear 0s 1 forwards`;
              char.addEventListener('animationend', () => {
                char.classList.remove('decoding');
              }, { once: true });
            }, { once: true });
          }, { once: true });
        }, { once: true });
        
        dnaMatrix.appendChild(char);
        chars.push(char);
      }
    }
  }

  createDNAMatrix();
});