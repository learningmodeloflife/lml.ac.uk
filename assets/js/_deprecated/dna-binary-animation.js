document.addEventListener('DOMContentLoaded', function() {
    const animationContainer = document.getElementById('dna-binary-animation');
    const dnaChars = ['A', 'C', 'T', 'G'];
    const binaryChars = ['0', '1'];
    const charWidth = 20;
    const containerWidth = animationContainer.offsetWidth;
    const charCount = Math.floor(containerWidth / charWidth);
    const lineCount = 4;

    const durationMean = 40;
    const durationJitter = 15;
    const duration = Array.from({ length: lineCount }, (_, i) => durationMean + Math.pow(-1, i) * Math.floor(Math.random() * durationJitter));
    let isAnimationPaused = false;
    
    function createChar(index, lineIndex) {
        const char = document.createElement('span');
        char.className = 'dna-binary-char';
        char.style.left = `-${charWidth}px`;
        char.style.top = `${lineIndex * 25}px`; // Adjust vertical spacing
        resetCharacter(char);
        char.style.animation = `moveAcross ${duration[lineIndex]}s linear ${-index * (duration[lineIndex] / charCount)}s infinite`; // adjust speed
        animationContainer.appendChild(char);
        return char;
    }

    function resetCharacter(char) {
        char.textContent = dnaChars[Math.floor(Math.random() * dnaChars.length)];
        char.dataset.type = 'dna';
        char.dataset.originalChar = char.textContent;
        char.dataset.threshold = Math.random();
        char.style.color = 'rgba(0, 0, 0, 0.6)';
        char.style.opacity = 0;
    }

    function updateChar(char) {
        const rect = char.getBoundingClientRect();
        const containerRect = animationContainer.getBoundingClientRect();
        const transitionStart = containerRect.left + containerRect.width * (1/3);
        const transitionEnd = containerRect.left + containerRect.width * (2/3);
    
        // Reset character if it's about to re-enter from the left
        if (rect.right < containerRect.left) {
            resetCharacter(char);
            return;
        }
    
        const containerWidth = containerRect.width;
        const blendDistance = containerWidth * 0.1; // 10% of container width for blending
    
        if (rect.left <= containerRect.left + blendDistance) {
            // Blend in from left
            const progress = (rect.left - containerRect.left) / blendDistance;
            char.style.opacity = progress;
        } else if (rect.right >= containerRect.right - blendDistance) {
            // Blend out to right
            const progress = (containerRect.right - rect.right) / blendDistance;
            char.style.opacity = progress;
        } else {
            // Fully visible character
            char.style.opacity = 1;
        }
    
        if (rect.left >= transitionStart && rect.left <= transitionEnd) {
            const progress = (rect.left - transitionStart) / (transitionEnd - transitionStart);
            if (char.dataset.type === 'dna' && char.dataset.threshold <= progress) {
                const newBinaryChar = binaryChars[Math.floor(Math.random() * binaryChars.length)];
                char.dataset.originalChar = newBinaryChar;
                char.dataset.type = 'binary';
            
                char.style.fontWeight = 'bold';
                setTimeout(() => {
                    char.style.fontWeight = 'normal';
                }, 300); // Change back to normal weight after 300ms
            }
        }
    
        // Always show the original character (which may have been updated)
        char.textContent = char.dataset.originalChar;
        char.style.color = 'rgba(0, 0, 0, 0.6)';
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