class SnakeGame {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.scoreDisplay = document.getElementById("score");
        this.highScoreDisplay = document.getElementById("highScore");
        this.finalScoreDisplay = document.getElementById("finalScore");
        
        
        this.startScreen = document.getElementById("startScreen");
        this.pauseScreen = document.getElementById("pauseScreen");
        this.gameOverScreen = document.getElementById("gameOverScreen");
        this.startButton = document.getElementById("startButton");
        this.restartButton = document.getElementById("restartButton");
        this.resumeButton = document.getElementById("resumeButton");
        this.pauseButton = document.getElementById("pauseButton");
        
        
        this.eatSound = document.getElementById("eatSound");
        this.gameOverSound = document.getElementById("gameOverSound");
        this.backgroundMusic = document.getElementById("backgroundMusic");
        
        
        this.headImg = document.getElementById("headImage");
        this.bodyImg = document.getElementById("bodyImage");
        this.appleImage = document.getElementById("appleImage");
        
        
        this.box = 20;
        this.snake = [];
        this.dx = 0;
        this.dy = 0;
        this.food = {};
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameInterval = null;
        this.isPaused = false;
        this.gameStarted = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        
        this.init();
    }
    
    init() {
        
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
        
        
        this.highScoreDisplay.textContent = this.highScore;
        
        
        this.startButton.addEventListener("click", () => this.startGame());
        this.restartButton.addEventListener("click", () => this.startGame());
        this.resumeButton.addEventListener("click", () => this.togglePause());
        this.pauseButton.addEventListener("click", () => this.togglePause());
        
        document.addEventListener("keydown", (e) => this.handleKeyDown(e));
        document.addEventListener("touchstart", (e) => this.handleTouchStart(e));
        document.addEventListener("touchmove", (e) => this.handleTouchMove(e));
        
        
        this.preloadResources();
        
        
        this.drawStartScreen();
    }
    
    preloadResources() {
        
        const resources = [this.headImg, this.bodyImg, this.appleImage];
        let loaded = 0;
        
        resources.forEach(resource => {
            if (resource.complete) {
                loaded++;
            } else {
                resource.onload = () => {
                    loaded++;
                    if (loaded === resources.length) {
                        console.log("Todos los recursos cargados");
                    }
                };
                resource.onerror = () => {
                    console.error("Error cargando recurso: ", resource.src);
                    
                    this.useFallbackGraphics = true;
                };
            }
        });
        
        
        [this.eatSound, this.gameOverSound, this.backgroundMusic].forEach(audio => {
            audio.onerror = () => {
                console.error("Error cargando audio: ", audio.src);
            };
        });
    }
    
    resizeCanvas() {
        
        const width = Math.floor(this.canvas.parentElement.clientWidth / this.box) * this.box;
        const height = Math.floor((window.innerHeight * 0.7) / this.box) * this.box;
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        
        if (this.gameStarted && !this.isPaused) {
            this.food = this.generateFood();
        }
    }
    
    drawStartScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        
        this.ctx.fillStyle = '#ffdd40';
        this.ctx.font = '24px "Press Start 2P", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Snake Adventure', this.canvas.width / 2, this.canvas.height / 3);
        
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px "Press Start 2P", cursive';
        this.ctx.fillText('Usa las flechas o WASD para mover', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText('Presiona P para pausar', this.canvas.width / 2, this.canvas.height / 2 + 30);
        
        
        this.ctx.fillStyle = '#4caf50';
        for (let i = 0; i < 5; i++) {
            if (i === 0) {
                this.ctx.fillStyle = '#ff5722';
            } else {
                this.ctx.fillStyle = '#4caf50';
            }
            this.ctx.fillRect(this.canvas.width / 2 - 40 + i * 20, this.canvas.height * 2/3, 18, 18);
        }
        
        
        this.ctx.drawImage(this.appleImage, this.canvas.width / 2 + 30, this.canvas.height * 2/3, 18, 18);
    }
    
    startGame() {
        // Ocultar pantallas
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.pauseScreen.classList.add('hidden');
        
        
        this.pauseButton.classList.remove('hidden');
        
        
        this.snake = [{ x: this.box * 5, y: this.box * 5 }];
        this.dx = this.box;
        this.dy = 0;
        this.score = 0;
        this.scoreDisplay.textContent = this.score;
        this.isPaused = false;
        this.gameStarted = true;
        
        
        this.food = this.generateFood();
        
        
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        
        
        this.gameInterval = setInterval(() => this.gameLoop(), 150);
        
        
        try {
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.play().catch(e => {
                console.log("Reproducción automática de audio bloqueada:", e);
            });
        } catch (error) {
            console.error("Error con la música de fondo:", error);
        }
    }
    
    generateFood() {
        let newFood;
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 100; 
        
        while (!validPosition && attempts < maxAttempts) {
            attempts++;
            const maxX = Math.floor(this.canvas.width / this.box) - 1;
            const maxY = Math.floor(this.canvas.height / this.box) - 1;
            
            newFood = {
                x: Math.floor(Math.random() * maxX) * this.box,
                y: Math.floor(Math.random() * maxY) * this.box
            };
            
            
            validPosition = !this.snake.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y
            );
            
            
            if (newFood.x < 0 || newFood.x >= this.canvas.width || 
                newFood.y < 0 || newFood.y >= this.canvas.height) {
                validPosition = false;
            }
        }
        
        
        if (!validPosition) {
            newFood = { x: this.box * 3, y: this.box * 3 };
            
            
            while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
                newFood.x += this.box;
                if (newFood.x >= this.canvas.width) {
                    newFood.x = this.box;
                    newFood.y += this.box;
                }
            }
        }
        
        return newFood;
    }
    
    gameLoop() {
        if (!this.isPaused) {
            this.move();
            this.draw();
        }
    }
    
    move() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        
        if (
            head.x < 0 || 
            head.y < 0 || 
            head.x >= this.canvas.width || 
            head.y >= this.canvas.height
        ) {
            this.gameOver();
            return;
        }
        
        
        for (let i = 0; i < this.snake.length; i++) {
            if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
                this.gameOver();
                return;
            }
        }
        
        
        this.snake.unshift(head);
        
        
        if (head.x === this.food.x && head.y === this.food.y) {
            
            try {
                this.eatSound.currentTime = 0;
                this.eatSound.play().catch(e => console.log("Error reproduciendo sonido:", e));
            } catch (error) {
                console.error("Error con el sonido:", error);
            }
            
            
            this.score += 10;
            this.scoreDisplay.textContent = this.score;
            
            
            this.food = this.generateFood();
        } else {
            
            this.snake.pop();
        }
    }
    
    draw() {
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                
                if (!this.useFallbackGraphics && this.headImg.complete) {
                    this.ctx.drawImage(this.headImg, segment.x, segment.y, this.box, this.box);
                } else {
                    this.ctx.fillStyle = '#ff5722';
                    this.ctx.fillRect(segment.x, segment.y, this.box, this.box);
                    
                    this.ctx.fillStyle = '#000';
                    this.ctx.fillRect(segment.x + 4, segment.y + 4, 4, 4);
                    this.ctx.fillRect(segment.x + 12, segment.y + 4, 4, 4);
                }
            } else {
                
                if (!this.useFallbackGraphics && this.bodyImg.complete) {
                    this.ctx.drawImage(this.bodyImg, segment.x, segment.y, this.box, this.box);
                } else {
                    this.ctx.fillStyle = '#4caf50';
                    this.ctx.fillRect(segment.x, segment.y, this.box, this.box);
                    this.ctx.fillStyle = '#387c48';
                    this.ctx.fillRect(segment.x + 2, segment.y + 2, this.box - 4, this.box - 4);
                }
            }
        });
        
        
        if (!this.useFallbackGraphics && this.appleImage.complete) {
            this.ctx.drawImage(this.appleImage, this.food.x, this.food.y, this.box, this.box);
        } else {
            this.ctx.fillStyle = '#ff0000';
            this.ctx.beginPath();
            this.ctx.arc(this.food.x + this.box/2, this.food.y + this.box/2, this.box/2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Tallo
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(this.food.x + this.box/2 - 2, this.food.y - 3, 4, 5);
        }
        
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px "Press Start 2P", cursive';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Puntos: ${this.score}`, 10, 20);
    }
    
    handleKeyDown(e) {
        if (!this.gameStarted) return;
        
        
        if (e.key === 'p' || e.key === 'P') {
            this.togglePause();
            return;
        }
        
        if (this.isPaused) return;
        
        // Control de dirección
        const key = e.key;
        const goingUp = this.dy === -this.box;
        const goingDown = this.dy === this.box;
        const goingRight = this.dx === this.box;
        const goingLeft = this.dx === -this.box;
        
        if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && !goingRight) {
            this.dx = -this.box;
            this.dy = 0;
        } else if ((key === 'ArrowUp' || key === 'w' || key === 'W') && !goingDown) {
            this.dx = 0;
            this.dy = -this.box;
        } else if ((key === 'ArrowRight' || key === 'd' || key === 'D') && !goingLeft) {
            this.dx = this.box;
            this.dy = 0;
        } else if ((key === 'ArrowDown' || key === 's' || key === 'S') && !goingUp) {
            this.dx = 0;
            this.dy = this.box;
        }
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        e.preventDefault();
    }
    
    handleTouchMove(e) {
        if (!this.touchStartX || !this.touchStartY || !this.gameStarted || this.isPaused) return;
        
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;
        
        
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && this.dx !== -this.box) {
                
                this.dx = this.box;
                this.dy = 0;
            } else if (dx < 0 && this.dx !== this.box) {
                
                this.dx = -this.box;
                this.dy = 0;
            }
        } else {
            if (dy > 0 && this.dy !== -this.box) {
                
                this.dx = 0;
                this.dy = this.box;
            } else if (dy < 0 && this.dy !== this.box) {
                
                this.dx = 0;
                this.dy = -this.box;
            }
        }
        
        this.touchStartX = null;
        this.touchStartY = null;
        e.preventDefault();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.pauseScreen.classList.remove('hidden');
            try {
                this.backgroundMusic.pause();
            } catch (error) {
                console.error("Error pausando música:", error);
            }
        } else {
            this.pauseScreen.classList.add('hidden');
            try {
                this.backgroundMusic.play().catch(e => {
                    console.log("Reproducción de audio bloqueada:", e);
                });
            } catch (error) {
                console.error("Error reanudando música:", error);
            }
        }
    }
    
    gameOver() {
        clearInterval(this.gameInterval);
        this.gameStarted = false;
        
        
        this.pauseButton.classList.add('hidden');
        
        
        try {
            this.gameOverSound.currentTime = 0;
            this.gameOverSound.play().catch(e => console.log("Error reproduciendo sonido:", e));
        } catch (error) {
            console.error("Error con el sonido:", error);
        }
        
        
        try {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        } catch (error) {
            console.error("Error deteniendo música:", error);
        }
        
        // Actualizar puntaje
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreDisplay.textContent = this.highScore;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        
        // Mostrar pantalla de game over
        this.finalScoreDisplay.textContent = this.score;
        this.gameOverScreen.classList.remove('hidden');
    }
}

// Iniciar el juego 
window.addEventListener('load', () => {
    const game = new SnakeGame();
});
    






