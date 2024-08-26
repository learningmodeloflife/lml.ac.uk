document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('decoding-animation');
  const content = container.textContent;
  container.textContent = null;
  
  const charHeight = 30;  
  const charWidth = charHeight * 0.8;
  
  const nucleotides = ['A', 'C', 'T', 'G'];
  const binaryDigits = ['0', '1'];
  
  const chars = [];
  const delayOffset = 0.8;
  const delayWindow = 1.3;
  const blendDuration = 0.5;
  
  const resetRadius = 100; // Radius in pixels
  const resetChance = 1.0; // Chance of animation on mouseover

  container.style.height = `${charHeight}px`;
  
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
    const containerWidth = container.offsetWidth;
    const textWidth = content.length * charWidth;
    const startX = Math.max(0, (containerWidth - textWidth) / 2);

    for (let i = 0; i < content.length; i++) {
      const char = document.createElement('span');
      char.classList.add('decoding-char', 'decoded-text');
      
      char.style.left = `${startX + i * charWidth}px`;
      char.style.width = `${charWidth}px`;
      char.style.height = `${charHeight}px`;
      char.style.fontSize = `${charHeight * 0.9}px`;
      
      char.dataset.final_char = content[i];
      char.dataset.index = i;
      
      runDecoding(char, delayOffset);
      
      container.appendChild(char);
      chars.push(char);
    }
  }

  function updateCharPositions() {
    const containerWidth = container.offsetWidth;
    const textWidth = content.length * charWidth;
    const startX = Math.max(0, (containerWidth - textWidth) / 2);

    // Batch DOM reads
    const updates = chars.map((char, index) => ({
      char,
      left: startX + index * charWidth
    }));

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      // Batch DOM writes
      updates.forEach(update => {
        update.char.style.left = `${update.left}px`;
      });
    });
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

  createText();
  container.addEventListener('mousemove', resetNearbyChars);

  let isResizing = false;

  function handleResize() {
    if (!isResizing) {
      isResizing = true;
      requestAnimationFrame(() => {
        updateCharPositions();
        isResizing = false;
      });
    }
  }

  window.addEventListener('resize', handleResize);
});