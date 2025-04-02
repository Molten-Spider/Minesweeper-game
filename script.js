const rows = 8;
const cols = 8;
const mineCount = 10;
let board = [];
let minePositions = [];

function createBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
    boardElement.style.gridTemplateRows = `repeat(${rows}, 40px)`;

    board = [];
    minePositions = [];
    
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener("click", () => revealCell(r, c));
            boardElement.appendChild(cell);
            board[r][c] = { element: cell, mine: false, revealed: false };
        }
    }
    
    placeMines();
}

function placeMines() {
    let placedMines = 0;
    while (placedMines < mineCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (!board[r][c].mine) {
            board[r][c].mine = true;
            minePositions.push([r, c]);
            placedMines++;
        }
    }
}

function revealCell(r, c) {
    if (board[r][c].revealed) return;
    
    board[r][c].revealed = true;
    const cell = board[r][c].element;
    cell.classList.add("revealed");
    
    if (board[r][c].mine) {
        cell.classList.add("mine");
        cell.innerText = "💣";
        document.getElementById("status").innerText = "Game Over!";
        revealAllMines();
        return;
    }
    
    const minesAround = countMinesAround(r, c);
    if (minesAround > 0) {
        cell.innerText = minesAround;
    } else {
        revealSurroundingCells(r, c);
    }
    
    if (checkWin()) {
        document.getElementById("status").innerText = "You Win! 🎉";
    }
}

function countMinesAround(r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
                count++;
            }
        }
    }
    return count;
}

function revealSurroundingCells(r, c) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                revealCell(nr, nc);
            }
        }
    }
}

function revealAllMines() {
    minePositions.forEach(([r, c]) => {
        board[r][c].element.classList.add("mine");
        board[r][c].element.innerText = "💣";
    });
}

function checkWin() {
    let revealedCells = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].revealed) revealedCells++;
        }
    }
    return revealedCells === (rows * cols - mineCount);
}

function resetGame() {
    document.getElementById("status").innerText = "Click a tile to begin!";
    createBoard();
}

document.addEventListener("DOMContentLoaded", createBoard);
