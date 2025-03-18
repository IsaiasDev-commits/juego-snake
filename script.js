const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

// Sonidos
const eatSound = new Audio("comer.mp3");
const gameOverSound = new Audio("gameover.mp3");

// Tamaño del canvas
canvas.width = 400;
canvas.height = 400;

// Tamaño de cada celda
const box = 20;

// Posición inicial de la serpiente
let snake = [{ x: 200, y: 200 }];

// Dirección inicial
let dx = box;
let dy = 0;

// Posición de la comida
let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
};

// Variables de velocidad y puntaje
let speed = 150;  // Tiempo entre cada frame en milisegundos
let score = 0;

// Movimiento de la serpiente
function move() {
    let newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Verificar colisiones con las paredes
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

    // Agregar nueva cabeza
    snake.unshift(newHead);

    // Verificar si come la comida
    if (newHead.x === food.x && newHead.y === food.y) {
        eatSound.play();
        score += 10;
        scoreDisplay.textContent = score;

        // Aumentar la velocidad cada 5 comidas
        if (score % 50 === 0) {
            speed *= 0.9;  // Reduce el tiempo entre frames
        }

        // Nueva comida
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };
    } else {
        snake.pop(); // Si no come, eliminamos la última parte
    }
}

// Dibujar la serpiente y la comida
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

// Controlar la serpiente con el teclado (WASD)
document.addEventListener("keydown", (event) => {
    const tecla = event.key.toLowerCase(); // Convierte la tecla a minúscula

    if (tecla === "w" && dy === 0) {  // Arriba
        dx = 0;
        dy = -box;
    } else if (tecla === "s" && dy === 0) { // Abajo
        dx = 0;
        dy = box;
    } else if (tecla === "a" && dx === 0) { // Izquierda
        dx = -box;
        dy = 0;
    } else if (tecla === "d" && dx === 0) { // Derecha
        dx = box;
        dy = 0;
    }
});

// Función de Game Over
function gameOver() {
    gameOverSound.play();
    alert(`Game Over\nPuntaje final: ${score}`);
    document.location.reload();
}

// Ejecutar el juego con velocidad variable
function gameLoop() {
    move();
    draw();
    setTimeout(gameLoop, speed);
}

gameLoop();
