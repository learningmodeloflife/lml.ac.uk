document.addEventListener('DOMContentLoaded', function() {
  
  const container = document.getElementById('decoding-animation');
  const content = container.textContent;
  container.textContent = null;
  
  const rect = container.getBoundingClientRect();
  
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
  
  const resetRadius = 100; // Radius in pixels
  const resetChance = 1.0; // Chance of animation on mouseover

  container.style.height = `${charHeight * rows}px`;
  
  function sampleLetter(letters) {
    return letters[Math.floor(Math.random() * letters.length)];
  }

  async function runDecoding(char, delayInitial) {
    if (!char.classList.contains('decoding')) {
      char.classList.add('decoding');
      char.classList.replace('decoded-text', 'encoded-text');
      char.textContent = sampleLetter(nucleotides);
      
      const blendOut = {
        opacity: [1, 0]
      };
      const blendIn = {
        opacity: [0, 1]
      };
      
      const durationNucleotide = delayInitial + Math.random() * delayWindow;
      const durationBinary = delayOffset + Math.random() * delayWindow;
      //Nucleotide to Binary transition
      await char.animate(blendOut, { duration: durationNucleotide*1000, delay: 0, iterations: 1, fill: 'forwards' }).finished;
      char.textContent = sampleLetter(binaryDigits);
      await char.animate(blendIn, { duration: durationBinary*1000, delay: 0, iterations: 1, fill: 'forwards' }).finished;
      
      //Binary to Final Character transition
      await char.animate(blendOut, { duration: blendDuration*1000, delay: durationBinary*1000, iterations: 1, fill: 'forwards' }).finished;
      char.textContent = char.dataset.final_char;
      char.classList.replace('encoded-text', 'decoded-text');
      await char.animate(blendIn, { duration: blendDuration*1000, delay: 0, iterations: 1, fill: 'forwards' }).finished;
      char.classList.remove('decoding');
      
    }
  }

  function createText() {
    const middleRow = Math.floor((rows - 1) / 2);
    const startCol  = Math.max(0, Math.floor((cols - content.length) / 2));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const char = document.createElement('span');
        char.classList.add('decoding-char', 'decoded-text');
        
        char.style.fontSize = `${charHeight*0.9}px`;
        char.style.left = `${j * charWidth}px`;
        char.style.top = `${i * charHeight}px`;
        char.style.width = `${charWidth}px`;
        
        char.style.height = `${charHeight}px`;
        char.style.display = 'inline-block';
               
        // Set final_char based on the centered position
        if (i === middleRow && j >= startCol && j < startCol + content.length) {
          char.dataset.final_char = content[j - startCol];
        } else {
          char.dataset.final_char = ' ';
        }

        runDecoding(char, delayOffset);  // Start initial animation
        
        container.appendChild(char);
        chars.push(char);
      }
    }
  }

  function resetNearbyChars(event) {
    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    chars.forEach(char => {
      const charRect = char.getBoundingClientRect();
      const charCenterX = charRect.left + charRect.width / 2 - rect.left;
      const charCenterY = charRect.top + charRect.height / 2 - rect.top;

      const distance = Math.sqrt(
        Math.pow(mouseX - charCenterX, 2) + Math.pow(mouseY - charCenterY, 2)
      );

      if (distance <= resetRadius) {
        if (resetChance * (distance/resetRadius) > Math.random()) {
          runDecoding(char, 0);
        }
      }
    });
  }
  container.addEventListener('mousemove', resetNearbyChars);

  createText();
});