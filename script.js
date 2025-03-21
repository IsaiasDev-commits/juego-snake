const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

// Sonidos
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

// Ajustar tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Tamaño de cada celda
const box = 20;

// Posición inicial de la serpiente
let snake;
let dx;
let dy;
let food;
let speed;
let score;
let gameInterval;

function initializeGame() {
    snake = [{ x: box * 5, y: box * 5 }];
    dx = box;
    dy = 0;
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
    speed = 150;
    score = 0;
    scoreDisplay.textContent = score;
    restartButton.style.display = "none";

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        move();
        draw();
    }, speed);
}

initializeGame();

// Cargar imágenes de la serpiente
const headImg = new Image();
headImg.src = "head.png";

const bodyImg = new Image();
bodyImg.src = "body.png";

// Movimiento de la serpiente
function move() {
    let newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Verificar colisiones
    if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height) {
        gameOver();
        return;
    }
    for (let segment of snake) {
        if (newHead.x === segment.x && newHead.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(newHead);

    // Verificar si come la comida
    if (newHead.x === food.x && newHead.y === food.y) {
        eatSound.play();
        score += 10;
        scoreDisplay.textContent = score;
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };
    } else {
        snake.pop();
    }
}

// Dibujar el juego
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la serpiente
    for (let i = 0; i < snake.length; i++) {
        let segment = snake[i];

        if (i === 0) {
            ctx.drawImage(headImg, segment.x, segment.y, box, box);
        } else {
            ctx.drawImage(bodyImg, segment.x, segment.y, box, box);
        }
    }

    // Dibujar la comida (manzana)
    const appleImage = document.getElementById("appleImage");
    ctx.drawImage(appleImage, food.x, food.y, box, box);
}

// Control con teclado
document.addEventListener("keydown", (event) => {
    if (event.key === "w" && dy === 0) {
        dx = 0;
        dy = -box;
    } else if (event.key === "s" && dy === 0) {
        dx = 0;
        dy = box;
    } else if (event.key === "a" && dx === 0) {
        dx = -box;
        dy = 0;
    } else if (event.key === "d" && dx === 0) {
        dx = box;
        dy = 0;
    }
});

// Función de Game Over
function gameOver() {
    clearInterval(gameInterval);
    gameOverSound.play();
    alert("¡Game Over!");
    restartButton.style.display = "block";
}

// Reiniciar el juego sin recargar la página
function restartGame() {
    initializeGame();
}







