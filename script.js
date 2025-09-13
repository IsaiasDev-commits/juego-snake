const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restartButton");


const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");


const box = 20;


function resizeCanvas() {
    canvas.width = Math.floor(window.innerWidth / box) * box;
    canvas.height = Math.floor(window.innerHeight / box) * box;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Variables del juego
let snake;
let dx;
let dy;
let food;
let score;
let gameInterval;


const headImg = new Image();
headImg.src = "head.png";

const bodyImg = new Image();
bodyImg.src = "body.png";


function initializeGame() {
    resizeCanvas(); 
    snake = [{ x: box * 5, y: box * 5 }];
    dx = box;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    restartButton.style.display = "none";

    food = generateFood(); // 

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        move();
        draw();
    }, 150);
}

// Generar comida en una posición válida 
function generateFood() {
    let newFood;
    let validPosition = false;
    
    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };

        
        if (newFood.x >= 0 && newFood.x < canvas.width && newFood.y >= 0 && newFood.y < canvas.height) {
            validPosition = !snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        }
    }

    console.log("Comida generada en:", newFood); 

    return newFood;
}

// Mover la serpiente
function move() {
    let newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Verificar colisión con paredes o con su cuerpo
    if (
        newHead.x < 0 || newHead.x >= canvas.width ||
        newHead.y < 0 || newHead.y >= canvas.height ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
        gameOver();
        return;
    }

    snake.unshift(newHead);

    // Verificar que comio
    if (newHead.x === food.x && newHead.y === food.y) {
        eatSound.play();
        score += 10;
        scoreDisplay.textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    for (let i = 0; i < snake.length; i++) {
        let segment = snake[i];
        if (i === 0) {
            ctx.drawImage(headImg, segment.x, segment.y, box, box);
        } else {
            ctx.drawImage(bodyImg, segment.x, segment.y, box, box);
        }
    }

    // Dibujar la manzana
    const appleImage = document.getElementById("appleImage");
    ctx.drawImage(appleImage, food.x, food.y, box, box);
}

// Controles de teclado
document.addEventListener("keydown", (event) => {
    if ((event.key === "w" || event.key === "ArrowUp") && dy === 0) {
        dx = 0;
        dy = -box;
    } else if ((event.key === "s" || event.key === "ArrowDown") && dy === 0) {
        dx = 0;
        dy = box;
    } else if ((event.key === "a" || event.key === "ArrowLeft") && dx === 0) {
        dx = -box;
        dy = 0;
    } else if ((event.key === "d" || event.key === "ArrowRight") && dx === 0) {
        dx = box;
        dy = 0;
    }
});

// Control para moviles
let touchStartX = 0, touchStartY = 0;
document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1) {
        let touchEndX = e.touches[0].clientX;
        let touchEndY = e.touches[0].clientY;
        let diffX = touchEndX - touchStartX;
        let diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0 && dx === 0) {
                dx = box;
                dy = 0;
            } else if (diffX < 0 && dx === 0) {
                dx = -box;
                dy = 0;
            }
        } else {
            if (diffY > 0 && dy === 0) {
                dx = 0;
                dy = box;
            } else if (diffY < 0 && dy === 0) {
                dx = 0;
                dy = -box;
            }
        }
    }
});

// Función de juego terminado
function gameOver() {
    clearInterval(gameInterval);
    gameOverSound.play();
    alert("¡Game Over!");
    restartButton.style.display = "block";
}

// Reiniciar juego
function restartGame() {
    initializeGame();
}

// Inicio de juego
initializeGame();






