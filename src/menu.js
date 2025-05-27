import { startGame } from "./game.js"

const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

let menuActive = true;
let difficulty = "easy";
let boardSize = 20;
const difficulties = ["easy", "medium", "hard", "custom"];
const boardSizes = [10, 20, 40, 50]; 
const buttonAreas = [];


export function drawMenu() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SNAKE GAME", canvas.width / 2, 80);

    buttonAreas.length = 0;

    drawButton("Start Game", 150, () => {
        menuActive = false;
        startGame(difficulty, boardSize);
    });

    drawButton(`Difficulty: ${difficulty}`, 200, () => {
        let currentIndex = difficulties.indexOf(difficulty);
        currentIndex = (currentIndex + 1) % difficulties.length;
        difficulty = difficulties[currentIndex];
        drawMenu();
    });

    const boardSizeY = 250;
    const buttonWidth = 40;
    const spacing = 10;
    const totalWidth = buttonWidth * 2 + spacing + 100;
    const startX = (canvas.width - totalWidth) / 2;

    drawButton("-", boardSizeY, () => {
        let currentIndex = boardSizes.indexOf(boardSize);
        if (currentIndex > 0) {
            boardSize = boardSizes[currentIndex - 1];
            drawMenu();
        }
    }, startX, buttonWidth);

    ctx.fillStyle = "white";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${boardSize}x${boardSize}`, startX + buttonWidth + spacing + 50, boardSizeY + 20);

    drawButton("+", boardSizeY, () => {
        let currentIndex = boardSizes.indexOf(boardSize);
        if (currentIndex < boardSizes.length - 1) {
            boardSize = boardSizes[currentIndex + 1];
            drawMenu();
        }
    }, startX + buttonWidth + spacing + 100, buttonWidth);
}

function drawButton(text, y, onClick, x = canvas.width / 2 - 75, width = 150) {
    const height = 30;

    ctx.fillStyle = "darkgreen";
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = "white";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, x + width/2, y + 20);

    buttonAreas.push({ x, y, width, height, onClick });
}

canvas.addEventListener("click", e => {
    if (!menuActive) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const btn of buttonAreas) {
        if (
            mx >= btn.x && mx <= btn.x + btn.width &&
            my >= btn.y && my <= btn.y + btn.height
        ) {
            btn.onClick();
            break;
        }
    }
});