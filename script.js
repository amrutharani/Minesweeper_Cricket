const startBtn = document.getElementById("start-btn");
const gridContainer = document.getElementById("grid-container");
const playerTurn = document.getElementById("player-turn");
const score1El = document.getElementById("score1");
const score2El = document.getElementById("score2");

let gridSize = 8;
let difficulty = "medium";
let grid = [];
let mines = [];
let revealed = [];
let currentPlayer = 1;
let scores = [0, 0];

startBtn.addEventListener("click", startGame);

function startGame() {
    gridSize = parseInt(document.getElementById("grid-size").value);
    difficulty = document.getElementById("difficulty").value;
    currentPlayer = 1;
    scores = [0, 0];
    score1El.textContent = scores[0];
    score2El.textContent = scores[1];
    playerTurn.textContent = `Player ${currentPlayer}'s Turn`;

    grid = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    revealed = Array(gridSize).fill(0).map(() => Array(gridSize).fill(false));
    mines = generateMines(gridSize, difficulty);

    renderGrid();
}

// Generate mines based on difficulty
function generateMines(size, diff) {
    let numMines;
    if (diff === "easy") numMines = Math.floor(size*size*0.1);
    else if (diff === "medium") numMines = Math.floor(size*size*0.2);
    else numMines = Math.floor(size*size*0.3);

    const minePositions = new Set();
    while (minePositions.size < numMines) {
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        minePositions.add(`${r},${c}`);
    }
    return minePositions;
}

function renderGrid() {
    gridContainer.innerHTML = "";
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener("click", () => revealCell(r, c, cell));
            gridContainer.appendChild(cell);
        }
    }
}

// Reveal a cell
function revealCell(r, c, cellEl) {
    if (revealed[r][c]) return;

    revealed[r][c] = true;
    cellEl.classList.add("revealed");

    const key = `${r},${c}`;
    if (mines.has(key)) {
        cellEl.textContent = "💣";
        scores[currentPlayer-1] -= 1; // penalty for hitting mine
    } else {
        const points = Math.floor(Math.random() * 6) + 1; // 1-6 runs
        cellEl.textContent = points;
        scores[currentPlayer-1] += points;
    }

    score1El.textContent = scores[0];
    score2El.textContent = scores[1];

    // Switch turn
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    playerTurn.textContent = `Player ${currentPlayer}'s Turn`;
}
