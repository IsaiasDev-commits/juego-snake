const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

// Sonidos
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

// Ajustar tamaño del canvas dinámicamente
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    canvas.width = size - (size % 20); // Asegurar múltiplos de 20
    canvas.height = canvas.width;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Tamaño de cada celda
const box = 20;

// Posición inicial de la serpiente
let snake = [{ x: box * 5, y: box * 5 }];

// Dirección inicial
let dx = box;
let dy = 0;

// Posición de la comida
let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
};

// Variables de velocidad y puntaje
let speed = 150;
let score = 0;

// Coordenadas para gestos táctiles
let touchStartX = 0, touchStartY = 0;
let touchEndX = 0, touchEndY = 0;

// Habilitar sonido en móviles al primer toque
function enableAudio() {
    eatSound.play().catch(() => {});
    gameOverSound.play().catch(() => {});
    document.removeEventListener("click", enableAudio);
}
document.addEventListener("click", enableAudio);

// Movimiento de la serpiente
function move() {
    let newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Verificar colisiones con paredes
    if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height) {
        gameOver();
        return;
    }

    // Verificar colisión con sí misma
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
    ctx.fillStyle = "#282c34";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar la serpiente
    ctx.fillStyle = "lime";
    for (let segment of snake) {
        ctx.fillRect(segment.x, segment.y, box, box);
    }

    // Dibujar la comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
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

// Detectar gestos táctiles (para móviles)
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Evita desplazamiento de la página
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

canvas.addEventListener("touchend", (event) => {
    event.preventDefault();
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
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

// Función de Game Over
function gameOver() {
    gameOverSound.play();
    setTimeout(() => {
        alert(`Game Over\nPuntaje final: ${score}`);
        document.location.reload();
    }, 100);
}

// Ejecutar el juego con velocidad variable
function gameLoop() {
    move();
    draw();
    setTimeout(gameLoop, speed);
}

gameLoop();
