const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let easyMode = false;
let gameOver = false;
let gameWon = false;
let score = 0;
let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let dx = 1, dy = 0;
let gameSpeed = 100;
let restartButtonArea = null;

const headImg = new Image();
headImg.src = "src/textures/snakehead.png";

const bodyImg = new Image();
bodyImg.src = "src/textures/snakebody.png";

const tailImg = new Image();
tailImg.src = "src/textures/snaketail.png";

const foodImg = new Image();
foodImg.src = "src/textures/food.png";

function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Check for body collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }
    
    snake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
        apple.x = Math.floor(Math.random() * tileCount);
        apple.y = Math.floor(Math.random() * tileCount);
        score++;
        
        // Check for win condition
        if (score === tileCount * tileCount - 1) {
            gameWon = true;
            return;
        }
    } else {
        snake.pop();
    }

    if (easyMode) {
        if (head.x < 0) head.x = tileCount - 1;
        if (head.x >= tileCount) head.x = 0;
        if (head.y < 0) head.y = tileCount - 1;
        if (head.y >= tileCount) head.y = 0;
    } else {
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver = true;
            return;
        }
    }
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Score
    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, canvas.width / 2, 30);

    // Snake body
    for (let i = 1; i < snake.length - 1; i++) {
        const part = snake[i];
        if (bodyImg.complete) {
            ctx.drawImage(bodyImg, part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
        } else {
            ctx.fillStyle = "lime";
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
        }
    }

    // Snake tail
    if (snake.length > 1) {
        const tail = snake[snake.length - 1];
        if (tailImg.complete) {
            ctx.save();
            ctx.translate(tail.x * gridSize + gridSize/2, tail.y * gridSize + gridSize/2);
            
            const prevSegment = snake[snake.length - 2];
            let angle = 0;
            if (prevSegment.x > tail.x) angle = 0;
            else if (prevSegment.x < tail.x) angle = Math.PI;
            else if (prevSegment.y < tail.y) angle = -Math.PI/2;
            else if (prevSegment.y > tail.y) angle = Math.PI/2;
            
            ctx.rotate(angle);
            ctx.drawImage(tailImg, -gridSize/2, -gridSize/2, gridSize - 1, gridSize - 1);
            ctx.restore();
        } else {
            ctx.fillStyle = "lime";
            ctx.fillRect(tail.x * gridSize, tail.y * gridSize, gridSize - 1, gridSize - 1);
        }
    }

    // Snake head
    const head = snake[0];
    if (headImg.complete) {
        ctx.save();
        ctx.translate(head.x * gridSize + gridSize/2, head.y * gridSize + gridSize/2);
        
        let angle = 0;
        if (dx === 1) angle = 0;
        else if (dx === -1) angle = Math.PI;
        else if (dy === -1) angle = -Math.PI/2;
        else if (dy === 1) angle = Math.PI/2;
        
        ctx.rotate(angle);
        ctx.drawImage(headImg, -gridSize/2, -gridSize/2, gridSize - 1, gridSize - 1);
        ctx.restore();
    } else {
        ctx.fillStyle = "yellow";
        ctx.fillRect(head.x * gridSize, head.y * gridSize, gridSize - 1, gridSize - 1);
    }

    // Food
    if (foodImg.complete) {
        ctx.drawImage(foodImg, apple.x * gridSize, apple.y * gridSize, gridSize - 1, gridSize - 1);
    } else {
        ctx.fillStyle = "red";
        ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 1, gridSize - 1);
    }

    if (gameOver || gameWon) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "24px sans-serif";
        ctx.textAlign = "center";
        if (gameOver) {
            ctx.fillText("You died!", canvas.width / 2, canvas.height / 2 - 30);
        } else {
            ctx.fillText("You won!", canvas.width / 2, canvas.height / 2 - 30);
        }
        ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2);

        // Restart button
        const btnX = canvas.width / 2 - 50;
        const btnY = canvas.height / 2 + 30;
        const btnW = 100;
        const btnH = 30;

        ctx.fillStyle = "darkred";
        ctx.fillRect(btnX, btnY, btnW, btnH);

        ctx.fillStyle = "white";
        ctx.font = "16px sans-serif";
        ctx.fillText("Restart", canvas.width / 2, btnY + 20);

        restartButtonArea = { x: btnX, y: btnY, width: btnW, height: btnH };
    } else {
        restartButtonArea = null;
    }
}

export function startGame(difficulty) {
    console.log(difficulty)
    switch (difficulty) {
        case "easy":
            easyMode = true
            gameSpeed = 150;
            break;
        case "medium":
            gameSpeed = 100;
            break;
        case "hard":
            gameSpeed = 80;
            break;
        case "custom":
            easyMode = true;
            gameSpeed = 20;
            break;
    }
    gameLoop()
}

function gameLoop() {
    draw();
    if (gameOver) return;
    update();
    setTimeout(gameLoop, gameSpeed);
}

export function resetGame() {
    snake = [{ x: 10, y: 10 }];
    apple = { x: 15, y: 15 };
    dx = 1;
    dy = 0;
    score = 0;
    gameOver = false;
    gameWon = false;
    gameLoop();
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
    if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
});

canvas.addEventListener("click", e => {
    if (!gameOver || !restartButtonArea) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const { x, y, width, height } = restartButtonArea;
    if (mx >= x && mx <= x + width && my >= y && my <= y + height) {
        resetGame();
    }
})