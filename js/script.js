// Get all the gameboard cells
const cells = document.querySelectorAll('.cell');

// Get control buttons and elements
const resetButton = document.querySelector('.btn.reset-btn');
const resultSpan = document.getElementById('result');
const themeToggleButton = document.getElementById('theme-toggle');
const modeToggleButton = document.getElementById('mode-toggle');
const difficultySelect = document.getElementById('difficulty');

// Initialize game state
let gameState = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
let currentPlayer = 'X';
let gameOver = false;
let isPlayerVsComputer = false;
let difficulty = 'easy';

// Event handler for cell clicks
function handleCellClick(event) {
    if (gameOver) return;
    const cellIndex = event.target.id;
    if (gameState[cellIndex] === ' ') {
        gameState[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add(`player-${currentPlayer.toLowerCase()}`);
        checkForWin();
        if (!gameOver) {
            if (isPlayerVsComputer && currentPlayer === 'X') {
                currentPlayer = 'O';
                resultSpan.textContent = `Computer's turn`;
                setTimeout(computerMove, 500); // Small delay for better UX
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                resultSpan.textContent = `Player ${currentPlayer}'s turn`;
            }
        }
    }
}

// Computer's move logic based on difficulty
function computerMove() {
    if (gameOver) return;
    let availableCells = [];
    gameState.forEach((cell, index) => {
        if (cell === ' ') availableCells.push(index);
    });

    let cellIndex;
    if (difficulty === 'easy') {
        cellIndex = easyMove(availableCells);
    } else if (difficulty === 'medium') {
        cellIndex = mediumMove(availableCells);
    } else if (difficulty === 'hard') {
        cellIndex = hardMove();
    }

    if (cellIndex !== undefined) {
        gameState[cellIndex] = 'O';
        const cell = document.getElementById(cellIndex);
        cell.textContent = 'O';
        cell.classList.add('player-o');
        checkForWin();
        if (!gameOver) {
            currentPlayer = 'X';
            resultSpan.textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}

// Easy mode: random selection from available cells
function easyMove(availableCells) {
    return availableCells[Math.floor(Math.random() * availableCells.length)];
}

// Medium mode: prioritize center, then random
function mediumMove(availableCells) {
    if (availableCells.includes(4)) {
        return 4; // Take center if available
    }
    return easyMove(availableCells); // Otherwise, random
}

// Hard mode: basic AI, can be expanded to use MiniMax algorithm
function hardMove() {
    // Try to win
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (gameState[a] === 'O' && gameState[b] === 'O' && gameState[c] === ' ') return c;
        if (gameState[a] === 'O' && gameState[c] === 'O' && gameState[b] === ' ') return b;
        if (gameState[b] === 'O' && gameState[c] === 'O' && gameState[a] === ' ') return a;
    }
    // Block opponent's winning move
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (gameState[a] === 'X' && gameState[b] === 'X' && gameState[c] === ' ') return c;
        if (gameState[a] === 'X' && gameState[c] === 'X' && gameState[b] === ' ') return b;
        if (gameState[b] === 'X' && gameState[c] === 'X' && gameState[a] === ' ') return a;
    }
    // Otherwise, choose the best strategic position
    return mediumMove(availableCells);
}

// Check for win or draw
function checkForWin() {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c] && gameState[a] !== ' ') {
            gameOver = true;
            resultSpan.textContent = `Player ${gameState[a]} wins! 🎉`;
            highlightWinningCells([a, b, c]);
            return;
        }
    }
    if (!gameState.includes(' ')) {
        gameOver = true;
        resultSpan.textContent = 'It\'s a draw! 🤝';
    }
}

// Highlight the winning cells
function highlightWinningCells(condition) {
    condition.forEach(index => {
        document.getElementById(index).classList.add('win');
    });
}

// Reset the game to the initial state
function resetGame() {
    gameState = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    currentPlayer = 'X';
    gameOver = false;
    resultSpan.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('player-x', 'player-o', 'win');
    });
}

// Toggle between light and dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggleButton.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
}

// Toggle between Player vs Player and Player vs Computer modes
function toggleMode() {
    isPlayerVsComputer = !isPlayerVsComputer;
    modeToggleButton.textContent = isPlayerVsComputer ? 'Player vs Player' : 'Player vs Computer';
    difficultySelect.style.display = isPlayerVsComputer ? 'inline-block' : 'none';
    resetGame();
}

// Handle difficulty level change
function handleDifficultyChange(event) {
    difficulty = event.target.value;
}

// Add event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});
resetButton.addEventListener('click', resetGame);
themeToggleButton.addEventListener('click', toggleTheme);
modeToggleButton.addEventListener('click', toggleMode);
difficultySelect.addEventListener('change', handleDifficultyChange);

// Initial setup
difficultySelect.style.display = 'none';

// Win conditions array
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
