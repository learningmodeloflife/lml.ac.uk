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

    function createPartialChar(index, lineIndex) {
        const char = document.createElement('span');
        char.className = 'dna-binary-char';
        const initialPosition = (index * charWidth);
        char.style.left = `${initialPosition}px`;
        char.style.top = `${lineIndex * 25}px`; // Adjust vertical spacing
        resetCharacter(char);
        char.style.animation = `moveAcross 40s linear 0s forwards`; // adjust speed
        animationContainer.appendChild(char);
        return char;
    }

    function resetCharacter(char) {
        char.textContent = dnaChars[Math.floor(Math.random() * dnaChars.length)];
        char.dataset.type = 'dna';
        char.dataset.originalChar = char.textContent;
        char.style.color = 'rgba(0, 0, 0, 0.6)';
        char.style.opacity = 0;
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


        const containerWidth = containerRect.width;
        const blendDistance = containerWidth * 0.1; // 10% of container width for blending

        if (rect.left < containerRect.left + blendDistance) {
            // Blend in from left
            const progress = (rect.left - containerRect.left) / blendDistance;
            char.style.opacity = progress;
            char.textContent = char.dataset.originalChar;
            char.style.color = 'rgba(0, 0, 0, 0.6)';
        } else if (rect.left < transitionStart) {
            // Fully visible DNA character
            char.style.opacity = 1;
            char.textContent = char.dataset.originalChar;
            char.style.color = 'rgba(0, 0, 0, 0.6)';
        } else if (rect.left >= transitionStart && rect.left < transitionEnd) {
            // Transition from DNA to binary
            const progress = (rect.left - transitionStart) / (transitionEnd - transitionStart);
            const cumulativeProbability = progress//Math.pow(progress, 2);
            if (char.dataset.type === 'dna' && Math.random() < cumulativeProbability) {
                const newBinaryChar = binaryChars[Math.floor(Math.random() * binaryChars.length)];
                char.dataset.originalChar = newBinaryChar;
                char.style.color = 'rgba(0, 0, 0, 0.6)';
                char.dataset.type = 'binary';
                char.style.fontWeight = 'bold';
                setTimeout(() => {
                    char.style.fontWeight = 'normal';
                }, 300); // Change back to normal weight after 300ms
            }
            char.textContent = char.dataset.originalChar;
            char.style.opacity = 1;
        } else if (rect.left >= transitionEnd && rect.right < containerRect.right - blendDistance) {
            // Fully visible binary character
            char.textContent = char.dataset.originalChar;
            char.style.opacity = 1;
            if (char.dataset.type === 'dna') {
                const newBinaryChar = binaryChars[Math.floor(Math.random() * binaryChars.length)];
                char.dataset.originalChar = newBinaryChar;
                char.style.color = 'rgba(0, 0, 0, 0.6)';
                char.dataset.type = 'binary';
            }
        } else {
            // Blend out to right
            const progress = (containerRect.right - rect.right) / blendDistance;
            char.style.opacity = progress;
            char.textContent = char.dataset.originalChar;
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
    // Create initial set of characters for each line
    for (let line = 0; line < lineCount; line++) {
        for (let i = 0; i < charCount; i++) {
            createPartialChar(i, line);
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