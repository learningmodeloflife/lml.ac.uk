document.addEventListener('DOMContentLoaded', function() {
    const animationContainer = document.getElementById('dna-binary-animation');
    const dnaChars = ['A', 'C', 'T', 'G'];
    const binaryChars = ['0', '1'];
    const charWidth = 20;
    const containerWidth = animationContainer.offsetWidth;
    const charCount = Math.floor(containerWidth / charWidth);
    const lineCount = 4;
    let isAnimationPaused = false;
    
    function createChar(index, lineIndex) {
        const char = document.createElement('span');
        char.className = 'dna-binary-char';
        char.style.left = `-${charWidth}px`;
        char.style.top = `${lineIndex * 25}px`; // Adjust vertical spacing
        resetCharacter(char);
        char.style.animation = `moveAcross 40s linear ${index * (40 / charCount)}s infinite`; // adjust speed
        animationContainer.appendChild(char);
        return char;
    }

    function resetCharacter(char) {
        char.textContent = dnaChars[Math.floor(Math.random() * dnaChars.length)];
        char.dataset.type = 'dna';
        char.dataset.originalChar = char.textContent;
        char.style.color = 'rgba(0, 0, 0, 0.8)';
    }

    function updateChar(char) {
        const rect = char.getBoundingClientRect();
        const containerRect = animationContainer.getBoundingClientRect();
        const transitionStart = containerRect.left + containerRect.width * (1/5);
        const transitionEnd = containerRect.left + containerRect.width * (2/3);

        // Reset character if it's about to re-enter from the left
        if (rect.right < containerRect.left) {
            resetCharacter(char);
            return;
        }

        if (rect.left < transitionStart) {
            // Keep as DNA character
            char.textContent = char.dataset.originalChar;
            char.style.color = 'rgba(0, 0, 0, 0.8)';
        } else if (rect.left >= transitionStart && rect.left < transitionEnd) {
            if (char.dataset.type === 'dna') {
                const progress = (rect.left - transitionStart) / (transitionEnd - transitionStart);
                // Calculate cumulative probability with a slower initial increase
                const cumulativeProbability = Math.pow(progress, 2); // Cubic increase for slower initial transition
                if (Math.random() < cumulativeProbability) {
                    const newBinaryChar = binaryChars[Math.floor(Math.random() * binaryChars.length)];
                    char.dataset.originalChar = newBinaryChar; // Update original character
                    char.style.color = 'rgba(0, 0, 0, 0.6)';
                    char.dataset.type = 'binary'; // Update the type once it becomes binary
                }
            }
        } else if (rect.left >= transitionEnd) {
            if (char.dataset.type === 'dna') {
                const newBinaryChar = binaryChars[Math.floor(Math.random() * binaryChars.length)];
                char.dataset.originalChar = newBinaryChar; // Update original character
                char.style.color = 'rgba(0, 0, 0, 0.6)';
                char.dataset.type = 'binary';
            }
        }

        // Always show the original character (which may have been updated)
        char.textContent = char.dataset.originalChar;
    }

    // Create initial set of characters for each line
    for (let line = 0; line < lineCount; line++) {
        for (let i = 0; i < charCount; i++) {
            createChar(i, line);
        }
    }

    // Update characters
    const updateInterval = setInterval(() => {
        if (!isAnimationPaused) {
            const chars = document.querySelectorAll('.dna-binary-char');
            chars.forEach(updateChar);
        }
    }, 100);

    // Toggle animation on click
    animationContainer.addEventListener('click', function() {
        isAnimationPaused = !isAnimationPaused;
        const chars = document.querySelectorAll('.dna-binary-char');
        chars.forEach(char => {
            if (isAnimationPaused) {
                char.style.animationPlayState = 'paused';
            } else {
                char.style.animationPlayState = 'running';
            }
        });
    });

    // Add cursor style to indicate clickability
    animationContainer.style.cursor = 'pointer';

    console.log('Animation script loaded and executed');
});