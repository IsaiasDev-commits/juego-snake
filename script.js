const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

// Sonidos
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

// Tamaño de cada celda
const box = 20;

// Ajustar el tamaño del canvas asegurando que sea un múltiplo de `box`
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

// Cargar imágenes de la serpiente
const headImg = new Image();
headImg.src = "head.png";

const bodyImg = new Image();
bodyImg.src = "body.png";

// Inicializar el juego
function initializeGame() {
    resizeCanvas(); // Asegurar que el canvas esté bien ajustado
    snake = [{ x: box * 5, y: box * 5 }];
    dx = box;
    dy = 0;
    food = generateFood();
    score = 0;
    scoreDisplay.textContent = score;
    restartButton.style.display = "none";

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        move();
        draw();
    }, 150);
}

// Generar comida en una posición aleatoria
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
}

// Mover la serpiente
function move() {
    let newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Verificar colisión con paredes o cuerpo
    if (
        newHead.x < 0 || newHead.x >= canvas.width ||
        newHead.y < 0 || newHead.y >= canvas.height ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
        gameOver();
        return;
    }

    snake.unshift(newHead);

    // Verificar si comió la comida
    if (newHead.x === food.x && newHead.y === food.y) {
        eatSound.play();
        score += 10;
        scoreDisplay.textContent = score;
        food = generateFood();
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

    // Dibujar la manzana
    const appleImage = document.getElementById("appleImage");
    ctx.drawImage(appleImage, food.x, food.y, box, box);
}

// Control con teclado
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

// Control táctil para móviles
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

// Iniciar el juego
initializeGame();






