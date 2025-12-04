import { Enemy } from '../entities/enemy.js';
import { CONFIG } from '../constants.js';

export class Spawner {
    constructor(game) {
        this.game = game;
        this.timer = 0;
        this.interval = 60;
    }

    update() {
        this.timer--;
        if (this.timer <= 0) {
            this.spawn();
            // Faster spawns as level increases
            this.interval = Math.max(10, 60 - this.game.player.level * 2);
            this.timer = this.interval;
        }
    }

    spawn() {
        const angle = Math.random() * Math.PI * 2;
        const dist = 600; // Distance from player
        
        const px = this.game.player.x + Math.cos(angle) * dist;
        const py = this.game.player.y + Math.sin(angle) * dist;

        // Only spawn if within world bounds
        if (px > 0 && px < CONFIG.WORLD_SIZE && py > 0 && py < CONFIG.WORLD_SIZE) {
            this.game.enemies.push(new Enemy(px, py, this.game.player.level));
        }
    }
}
