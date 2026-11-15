// --- КОНСТАНТИ ---
const SIZE = 40;              
const COLS = 8;
const ROWS = 11;
const POINTS_PER_KILL = 100;  
const WIN_SCORE = 5000;       

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreValElem = document.getElementById('scoreVal');
const speedValElem = document.getElementById('speedVal');
const speedSelect = document.getElementById('speedSelect');
const startBtn = document.getElementById('startBtn');

let score = 0;
let gameSpeed = 1;
let isPlaying = false;
let player;
let aliens = [];
let bullet = null;
let gameInterval = null;
const COLORS = ['#ffcc00', '#3399ff', '#cc99ff', '#ff3300'];

// Клас корабля всередині одного файлу
class Ship {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(this.x, this.y, this.size, this.size);
    }

    move(dx, maxX) {
        this.x += dx;
        if (this.x < 0) this.x = 0;
        if (this.x > maxX - this.size) this.x = maxX - this.size;
    }
}

player = new Ship(3 * SIZE, 10 * SIZE, SIZE, '#4a154b');

function createAliens() {
    try {
        aliens = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < COLS; c++) {
                let color = COLORS[r % COLORS.length];
                aliens.push(new Ship(c * SIZE, r * SIZE, SIZE, color));
            }
        }
    } catch (error) {
        console.error("Помилка створення ворогів:", error);
    }
}

startBtn.addEventListener('click', () => {
    try {
        gameSpeed = parseInt(speedSelect.value);
        speedValElem.innerText = gameSpeed < 10 ? '0' + gameSpeed : gameSpeed;
        score = 0;
        scoreValElem.innerText = score;
        
        createAliens();
        isPlaying = true;
        
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, 200 / gameSpeed);
    } catch (e) {
        alert("Помилка запуску: " + e.message);
    }
});

window.addEventListener('keydown', (e) => {
    if (!isPlaying) return;
    try {
        if (e.key === 'ArrowLeft') {
            player.move(-SIZE, canvas.width);
        } else if (e.key === 'ArrowRight') {
            player.move(SIZE, canvas.width);
        } else if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            if (!bullet) {
                bullet = { x: player.x + SIZE / 2 - 2, y: player.y, width: 4 };
            }
        }
    } catch (err) {
        console.error("Помилка клавіатури:", err);
    }
});

function updateGame() {
    try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (bullet) {
            bullet.y -= 15;
            ctx.fillStyle = '#00ffff';
            ctx.fillRect(bullet.x, bullet.y, bullet.width, player.y - bullet.y);

            for (let i = aliens.length - 1; i >= 0; i--) {
                let a = aliens[i];
                if (bullet && bullet.x >= a.x && bullet.x <= a.x + a.size && bullet.y <= a.y + a.size) {
                    aliens.splice(i, 1);
                    bullet = null;
                    score += POINTS_PER_KILL;
                    scoreValElem.innerText = score;

                    if (score % 1000 === 0) {
                        gameSpeed++;
                        speedValElem.innerText = gameSpeed < 10 ? '0' + gameSpeed : gameSpeed;
                        clearInterval(gameInterval);
                        gameInterval = setInterval(updateGame, 200 / gameSpeed);
                    }
                    break;
                }
            }

            if (bullet && bullet.y < 0) {
                bullet = null;
            }
        }

        let reachedBottom = false;
        aliens.forEach(a => {
            a.y += 0.5 * gameSpeed;
            if (a.y >= player.y - SIZE / 2) {
                reachedBottom = true;
            }
            a.draw(ctx);
        });

        if (reachedBottom) {
            isPlaying = false;
            clearInterval(gameInterval);
            alert("Гра закінчилась! Вороги досягли бази.");
            return;
        }

        if (score >= WIN_SCORE || aliens.length === 0) {
            if (aliens.length === 0) {
                createAliens();
            } else {
                isPlaying = false;
                clearInterval(gameInterval);
                alert("Вітаємо! Перемога!");
                return;
            }
        }

        player.draw(ctx);

    } catch (err) {
        console.error("Помилка ігрового циклу:", err);
        isPlaying = false;
        clearInterval(gameInterval);
    }
}