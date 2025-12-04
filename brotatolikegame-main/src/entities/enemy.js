import { CONFIG } from '../constants.js';
import { Utils } from '../utils.js';
import { Gem } from './gem.js';

export class Enemy {
    constructor(x, y, level, type = 'basic') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.pushX = 0;
        this.pushY = 0;
        this.markedForDeletion = false;
        
        // Define stats based on type
        if (type === 'tank') {
            this.size = 25;
            this.hp = 40 + (level * 5);
            this.speed = 1.5;
            this.color = '#880000'; // Dark Red
            this.gemValue = 10;
        } else if (type === 'runner') {
            this.size = 12;
            this.hp = 8 + (level * 1.5);
            this.speed = 4 + Math.random();
            this.color = '#ff8888'; // Pinkish
            this.gemValue = 2;
        } else { // Basic
            this.size = 15;
            this.hp = 15 + (level * 3);
            this.speed = 2.5 + Math.random();
            this.color = CONFIG.COLORS.enemy;
            this.gemValue = 5;
        }
        
        this.maxHp = this.hp;
    }

    update(player) {
        const angle = Utils.angle(this, player);
        this.x += Math.cos(angle) * this.speed + this.pushX;
        this.y += Math.sin(angle) * this.speed + this.pushY;
        this.pushX *= 0.9;
        this.pushY *= 0.9;
    }

    takeDamage(amount, dx, dy, game) {
        this.hp -= amount;
        this.pushX = dx * 0.5;
        this.pushY = dy * 0.5;
        
        if (this.hp <= 0) {
            this.markedForDeletion = true;
            game.gems.push(new Gem(this.x, this.y, this.gemValue));
            // BLOOD EFFECT
            for(let i=0; i<5; i++) {
                game.addParticle(this.x, this.y, this.color);
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        if (this.type === 'tank') {
            // Tanks are Squares
            ctx.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        } else {
            // Runners/Basic are Circles
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        }
        
        ctx.fill();
    }
}