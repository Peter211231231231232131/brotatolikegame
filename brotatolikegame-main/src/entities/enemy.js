import { CONFIG } from '../constants.js';
import { Utils } from '../utils.js';
import { Gem } from './gem.js';

export class Enemy {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.size = 15;
        this.hp = 10 + (level * 2);
        this.maxHp = this.hp;
        this.speed = 2 + Math.random();
        this.damage = 1;
        this.markedForDeletion = false;
        
        // Physics pushback
        this.pushX = 0;
        this.pushY = 0;
    }

    update(player) {
        // Chase
        const angle = Utils.angle(this, player);
        this.x += Math.cos(angle) * this.speed + this.pushX;
        this.y += Math.sin(angle) * this.speed + this.pushY;

        // Friction
        this.pushX *= 0.9;
        this.pushY *= 0.9;
    }

    takeDamage(amount, dx, dy, game) {
        this.hp -= amount;
        this.pushX = dx * 0.5;
        this.pushY = dy * 0.5;
        
        if (this.hp <= 0) {
            this.markedForDeletion = true;
            // Drop Loot
            game.gems.push(new Gem(this.x, this.y, 5));
        }
    }

    draw(ctx) {
        ctx.fillStyle = CONFIG.COLORS.enemy;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
