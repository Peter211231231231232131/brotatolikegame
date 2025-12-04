import { Player } from './entities/player.js';
import { InputSystem } from './systems/input.js';
import { Camera } from './systems/camera.js';
import { Spawner } from './systems/spawner.js';
import { Shop } from './systems/shop.js';
import { LevelUpSystem } from './systems/levelup.js';
import { Particle } from './entities/particle.js';
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
        this.shop = new Shop(this);
        this.levelSystem = new LevelUpSystem(this);
        
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
        this.particles = [];
        this.player = new Player(this);
        this.spawner = new Spawner(this);
        this.gameOver = false;
        this.wave = 1;
        this.startWave();
    }

    startWave() {
        this.state = 'PLAYING';
        this.shop.close();
        this.waveTimer = 20 + (this.wave * 5); 
    }
    triggerLevelUp() { this.state = 'LEVEL_UP'; this.levelSystem.show(); }
    resumeFromLevelUp() { this.levelSystem.hide(); this.state = 'PLAYING'; }
    endGame() { this.gameOver = true; document.getElementById('gameover').style.display = 'flex'; }
    addParticle(x, y, color) {
        this.particles.push(new Particle(x, y, color, Math.random() * 3, Math.random() * 5));
    }

    update() {
        if (this.gameOver) return;
        if (this.state === 'SHOP' || this.state === 'LEVEL_UP') {
            this.updateUI(); 
            return;
        }

        this.waveTimer -= 1/60;
        if (this.waveTimer <= 0) {
            this.state = 'SHOP';
            this.shop.open();
            this.wave++;
            this.enemies = []; 
            this.bullets = [];
            this.particles = [];
        }

        this.player.update(this.input.axis);
        this.camera.update(this.player);
        this.spawner.update();

        this.bullets.forEach(b => b.update());
        
        // --- PASS 'THIS' TO ENEMY UPDATE FOR SEPARATION ---
        this.enemies.forEach(e => e.update(this)); 
        // --------------------------------------------------

        this.gems.forEach(g => g.update(this.player));
        this.particles.forEach(p => p.update());

        this.checkCollisions();

        // Cleanup
        this.bullets = this.bullets.filter(b => !b.markedForDeletion);
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.gems = this.gems.filter(g => !g.markedForDeletion);
        this.particles = this.particles.filter(p => !p.markedForDeletion);

        this.updateUI();
    }

    checkCollisions() {
        this.bullets.forEach(b => {
            this.enemies.forEach(e => {
                if (!b.markedForDeletion && !e.markedForDeletion && Utils.dist(b, e) < b.size + e.size) {
                    
                    // PIERCING LOGIC (Laser)
                    if (b.type === 'piercing') {
                        // Check if we already hit this enemy
                        if (!b.hitList.includes(e)) {
                            e.takeDamage(b.damage, b.dx, b.dy, this);
                            b.hitList.push(e); // Remember we hit them
                            // Reduce damage for next hit? Optional.
                            b.damage *= 0.8; 
                        }
                        // Bullet continues flying, does NOT get deleted
                        if (b.damage < 1) b.markedForDeletion = true;
                    }

                    // EXPLOSIVE LOGIC
                    else if (b.type === 'explosive') {
                        b.markedForDeletion = true;
                        for(let i=0; i<20; i++) this.addParticle(b.x, b.y, 'orange');
                        this.enemies.forEach(target => {
                            if (Utils.dist(b, target) < 100) { 
                                target.takeDamage(b.damage, target.x - b.x, target.y - b.y, this);
                            }
                        });
                    } 
                    
                    // NORMAL LOGIC
                    else {
                        b.markedForDeletion = true;
                        e.takeDamage(b.damage, b.dx, b.dy, this);
                    }
                }
            });
        });

        this.enemies.forEach(e => {
            if (Utils.dist(e, this.player) < e.size + this.player.size) {
                this.player.hp -= 0.1;
                if (this.player.hp <= 0) this.endGame();
            }
        });
    }

    // ... draw, drawGrid, updateUI are unchanged ...
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.drawGrid();
        this.gems.forEach(g => g.draw(this.ctx));
        this.particles.forEach(p => p.draw(this.ctx));
        this.bullets.forEach(b => b.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
        this.player.draw(this.ctx);
        this.ctx.strokeStyle = 'red'; this.ctx.lineWidth = 5; this.ctx.strokeRect(0, 0, CONFIG.WORLD_SIZE, CONFIG.WORLD_SIZE);
        this.ctx.restore();
    }
    drawGrid() {
        const startX = Math.floor(this.camera.x / CONFIG.TILE_SIZE) * CONFIG.TILE_SIZE;
        const startY = Math.floor(this.camera.y / CONFIG.TILE_SIZE) * CONFIG.TILE_SIZE;
        this.ctx.strokeStyle = CONFIG.COLORS.grid; this.ctx.lineWidth = 2; this.ctx.beginPath();
        for (let x = startX; x < this.camera.x + this.width; x += CONFIG.TILE_SIZE) { this.ctx.moveTo(x, this.camera.y); this.ctx.lineTo(x, this.camera.y + this.height); }
        for (let y = startY; y < this.camera.y + this.height; y += CONFIG.TILE_SIZE) { this.ctx.moveTo(this.camera.x, y); this.ctx.lineTo(this.camera.x + this.width, y); }
        this.ctx.stroke();
    }
    updateUI() {
        const hpPct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
        document.getElementById('hpBar').style.width = `${hpPct}%`;
        const xpPct = Math.min(100, (this.player.xp / this.player.nextLevel) * 100);
        document.getElementById('xpBar').style.width = `${xpPct}%`;
        document.getElementById('lvlDisplay').innerText = this.player.level;
        document.getElementById('goldDisplay').innerText = this.player.gold;
        document.getElementById('waveNum').innerText = this.wave;
        document.getElementById('timeNum').innerText = Math.max(0, Math.ceil(this.waveTimer));
    }
}