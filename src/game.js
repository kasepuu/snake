const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

let gridSize = 20;
let tileCount = canvas.width / gridSize;
let easyMode = false;
let gameOver = false;
let gameWon = false;
let score = 0;
let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let dx = 1, dy = 0;
let pendingDx = 1, pendingDy = 0;
let gameSpeed = 100;
let restartButtonArea = null;
let lastUpdateTime = 0;
let lastKeyPress = 0;
const KEY_PRESS_COOLDOWN = 0;

// Queue for buffered inputs
let inputQueue = [];

const headImg = new Image();
headImg.src = "src/textures/snakehead.png";

const bodyImg = new Image();
bodyImg.src = "src/textures/snakebody.png";

const tailImg = new Image();
tailImg.src = "src/textures/snaketail.png";

const foodImg = new Image();
foodImg.src = "src/textures/food.png";

function update() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastUpdateTime;
    
    if (deltaTime >= gameSpeed) {
        while (inputQueue.length > 0) {
            const input = inputQueue.shift();
            if ((input.dx !== 0 && dx === 0) || (input.dx === 0 && dx !== 0) ||
                (input.dy !== 0 && dy === 0) || (input.dy === 0 && dy !== 0)) {
                dx = input.dx;
                dy = input.dy;
                break; 
            }
        }
        
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
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
        
        for (let i = 0; i < snake.length - 1; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver = true;
                return;
            }
        }
        
        snake.unshift(head);
        if (head.x === apple.x && head.y === apple.y) {
            let newApple;
            do {
                newApple = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
            } while (snake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
            
            apple = newApple;
            score++;
            
            if (score === tileCount * tileCount - 1) {
                gameWon = true;
                return;
            }
        } else {
            snake.pop();
        }
        
        lastUpdateTime = currentTime;
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
        // Black background
        ctx.fillStyle = "black";
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
        
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
        // Black background
        ctx.fillStyle = "black";
        ctx.fillRect(tail.x * gridSize, tail.y * gridSize, gridSize - 1, gridSize - 1);
        
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
    // Black background
    ctx.fillStyle = "black";
    ctx.fillRect(head.x * gridSize, head.y * gridSize, gridSize - 1, gridSize - 1);
    
    if (headImg.complete) {
        ctx.save();
        ctx.translate(head.x * gridSize + gridSize/2, head.y * gridSize + gridSize/2);
        
        // Rotate based on direction
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
    // Black background
    ctx.fillStyle = "black";
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 1, gridSize - 1);
    
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

export function startGame(difficulty, size) {
    console.log(difficulty, size);
    gridSize = size;
    tileCount = canvas.width / gridSize;
    
    const center = Math.floor(tileCount / 2);
    snake = [{ x: center, y: center }];
    dx = 1;
    dy = 0;
    pendingDx = 1;
    pendingDy = 0;
    
    let newApple;
    do {
        newApple = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
    apple = newApple;
    
    switch (difficulty) {
        case "easy":
            easyMode = true;
            gameSpeed = 200;
            break;
        case "medium":
            easyMode = false;
            gameSpeed = 200;
            break;
        case "hard":
            easyMode = false;
            gameSpeed = 80;
            break;
        case "custom":
            easyMode = true;
            gameSpeed = 20;
            break;
    }
    lastUpdateTime = performance.now();
    gameLoop();
}

function gameLoop() {
    draw();
    if (gameOver || gameWon) return;
    update();
    requestAnimationFrame(gameLoop);
}

export function resetGame() {
    const center = Math.floor(tileCount / 2);
    snake = [{ x: center, y: center }];
    dx = 1;
    dy = 0;
    pendingDx = 1;
    pendingDy = 0;
    
    // Place a new apple away from snake
    let newApple;
    do {
        newApple = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
    apple = newApple;
    
    score = 0;
    gameOver = false;
    gameWon = false;
    lastUpdateTime = performance.now();
    gameLoop();
}

document.addEventListener("keydown", e => {
    const currentTime = performance.now();
    if (currentTime - lastKeyPress < KEY_PRESS_COOLDOWN) return;
    lastKeyPress = currentTime;
    
    let newDx = dx;
    let newDy = dy;
    
    switch (e.key) {
        case "ArrowUp":
            if (dy === 0) { 
                newDx = 0;
                newDy = -1;
            }
            break;
        case "ArrowDown":
            if (dy === 0) {
                newDx = 0;
                newDy = 1;
            }
            break;
        case "ArrowLeft":
            if (dx === 0) {
                newDx = -1;
                newDy = 0;
            }
            break;
        case "ArrowRight":
            if (dx === 0) {
                newDx = 1;
                newDy = 0;
            }
            break;
    }
    
    if (newDx !== dx || newDy !== dy) {
        inputQueue.push({ dx: newDx, dy: newDy });
    }
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