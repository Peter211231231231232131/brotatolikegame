import { Enemy } from '../entities/enemy.js';
import { CONFIG } from '../constants.js';

export class Spawner {
    constructor(game) {
        this.game = game;
        this.timer = 0;
    }

    update() {
        this.timer--;
        // Spawn rate logic
        const interval = Math.max(5, 60 - (this.game.wave * 3));
        
        if (this.timer <= 0) {
            this.spawn();
            this.timer = interval;
        }
    }

    spawn() {
        const angle = Math.random() * Math.PI * 2;
        const dist = 600; 
        const px = this.game.player.x + Math.cos(angle) * dist;
        const py = this.game.player.y + Math.sin(angle) * dist;

        if (px > 0 && px < CONFIG.WORLD_SIZE && py > 0 && py < CONFIG.WORLD_SIZE) {
            
            // Random Enemy Type Logic
            let type = 'basic';
            const rand = Math.random();
            
            // Wave 3+ start spawning Runners (30% chance)
            if (this.game.wave >= 3 && rand < 0.3) type = 'runner';
            
            // Wave 5+ start spawning Tanks (10% chance)
            if (this.game.wave >= 5 && rand < 0.1) type = 'tank';

            this.game.enemies.push(new Enemy(px, py, this.game.player.level, type));
        }
    }
}