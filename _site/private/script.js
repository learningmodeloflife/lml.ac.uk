document.addEventListener('DOMContentLoaded', () => {
    const scene = document.getElementById('scene');
    const ballCount = 80;

    // Function to generate random position within a given range
    function getRandomPosition(max) {
        return `${Math.floor(Math.random() * max)}px`;
    }

    for (let i = 0; i < ballCount; i++) {
        const ball = document.createElement('div');
        ball.className = 'ball';

        // Set random positions for start, mid, and end points
        const startX = getRandomPosition(800);
        const startY = getRandomPosition(800);
        const startZ = getRandomPosition(400);
        const midX = getRandomPosition(800);
        const midY = getRandomPosition(800);
        const midZ = getRandomPosition(400);
        const endX = getRandomPosition(800);
        const endY = getRandomPosition(800);
        const endZ = getRandomPosition(400);

        ball.style.setProperty('--start-x', startX);
        ball.style.setProperty('--start-y', startY);
        ball.style.setProperty('--start-z', startZ);
        ball.style.setProperty('--mid-x', midX);
        ball.style.setProperty('--mid-y', midY);
        ball.style.setProperty('--mid-z', midZ);
        ball.style.setProperty('--end-x', endX);
        ball.style.setProperty('--end-y', endY);
        ball.style.setProperty('--end-z', endZ
