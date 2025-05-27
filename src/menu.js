import { startGame } from "./game.js"

const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

let menuActive = true;
let difficulty = "easy";
const difficulties = ["easy", "medium", "hard", "custom"];
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
        startGame(difficulty);
    });



    drawButton(`Difficulty: ${difficulty}`, 200, () => {
        let currentIndex = difficulties.indexOf(difficulty);
        currentIndex = (currentIndex + 1) % difficulties.length;
        difficulty = difficulties[currentIndex];
        drawMenu();
    });
}

function drawButton(text, y, onClick) {
    const x = canvas.width / 2 - 75;
    const width = 150;
    const height = 30;

    ctx.fillStyle = "darkgreen";
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = "white";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, y + 20);

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