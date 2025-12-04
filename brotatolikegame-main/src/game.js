import { Player } from './entities/player.js';
import { InputSystem } from './systems/input.js';
import { Camera } from './systems/camera.js';
import { Spawner } from './systems/spawner.js';
import { Shop } from './systems/shop.js'; // Import Shop
import { CONFIG } from './constants.js';
import { Utils } from './utils.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = window.innerWidth;
        this.height = canvas.height = window.innerHeight;

        this.input = new InputSystem();
        this.camera = new Camera(this.width, this.height);
        this.shop = new Shop(this); // Init Shop

        // Game State
        this.state = 'PLAYING'; // 'PLAYING' or 'SHOP'
        this.wave = 1;
        this.waveTime = 20; // Seconds per wave
        this.waveTimer = this.waveTime;
        
        this.resetGame();

        window.addEventListener('resize', () => {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
            this.camera.width = this.width;
            this.camera.height = this.height;
        });
    }

    resetGame() {
        this.enemies = [];
        this.bullets = [];
        this.gems = [];
        this.player = new Player(this);
        this.spawner = new Spawner(this);
        this.gameOver = false;
        this.startWave();
    }

    startWave() {
        this.state = 'PLAYING';
        this.shop.close();
        this.waveTimer = this.waveTime;
        
        // Heal player slightly (20%) on new wave? Optional.
        // Increase wave difficulty
        this.waveTime += 5; // Waves get longer
    }

    endWave() {
        this.state = 'SHOP';
        
        // Kill all enemies and convert to XP (optional, or just delete)
        this.enemies = []; 
        this.bullets = [];
        
        // Open Shop
        this.shop.open();
        this.wave++;
    }

    update() {
        if (this.gameOver) return;

        // If in Shop, only update UI, don't run game logic
        if (this.state === 'SHOP') {
            this.updateUI(); // Keep showing Gold updates
            return;
        }

        // Wave Timer Logic
        this.waveTimer -= 1/60; // Assuming 60 FPS
        if (this.waveTimer <= 0) {
            this.endWave();
        }

        this.player.update(this.input.axis);
        this.camera.update(this.player);
        this.spawner.update();

        this.bullets.forEach(b => b.update());
        this.enemies.forEach(e => e.update(this.player));
        this.gems.forEach(g => g.update(this.player));

        this.checkCollisions();

        // Cleanup
        this.bullets = this.bullets.filter(b => !b.markedForDeletion);
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.gems = this.gems.filter(g => !g.markedForDeletion);

        this.updateUI();
    }

    checkCollisions() {
        // ... (Same collision logic as before) ...
        // Bullet vs Enemy
        this.bullets.forEach(b => {
            this.enemies.forEach(e => {
                if (Utils.dist(b, e) < b.size + e.size) {
                    b.markedForDeletion = true;
                    e.takeDamage(b.damage, b.dx, b.dy, this);
                }
            });
        });

        // Enemy vs Player
        this.enemies.forEach(e => {
            if (Utils.dist(e, this.player) < e.size + this.player.size) {
                this.player.hp -= 0.1;
                if (this.player.hp <= 0) this.endGame();
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);

        this.drawGrid();
        this.gems.forEach(g => g.draw(this.ctx));
        this.bullets.forEach(b => b.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
        this.player.draw(this.ctx);

        this.ctx.strokeRect(0, 0, CONFIG.WORLD_SIZE, CONFIG.WORLD_SIZE);
        this.ctx.restore();
    }

    drawGrid() {
        // ... (Same grid logic) ...
        const startX = Math.floor(this.camera.x / CONFIG.TILE_SIZE) * CONFIG.TILE_SIZE;
        const startY = Math.floor(this.camera.y / CONFIG.TILE_SIZE) * CONFIG.TILE_SIZE;
        
        this.ctx.strokeStyle = CONFIG.COLORS.grid;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let x = startX; x < this.camera.x + this.width; x += CONFIG.TILE_SIZE) {
            this.ctx.moveTo(x, this.camera.y); 
            this.ctx.lineTo(x, this.camera.y + this.height);
        }
        for (let y = startY; y < this.camera.y + this.height; y += CONFIG.TILE_SIZE) {
            this.ctx.moveTo(this.camera.x, y); 
            this.ctx.lineTo(this.camera.x + this.width, y);
        }
        this.ctx.stroke();
    }

    updateUI() {
        const hpPct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
        document.getElementById('hpBar').style.width = `${hpPct}%`;
        document.getElementById('lvlDisplay').innerText = this.player.level;
        document.getElementById('goldDisplay').innerText = this.player.gold;
        
        // Update Wave UI
        document.getElementById('waveNum').innerText = this.wave;
        document.getElementById('timeNum').innerText = Math.max(0, Math.ceil(this.waveTimer));
    }

    endGame() {
        this.gameOver = true;
        document.getElementById('gameover').style.display = 'flex';
    }
}