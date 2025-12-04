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
        
        // Stats
        if (type === 'tank') {
            this.size = 25; this.hp = 50 + (level * 6); this.speed = 1.2; this.color = '#880000'; this.gemValue = 10;
        } else if (type === 'runner') {
            this.size = 12; this.hp = 8 + (level * 1.5); this.speed = 3.5 + Math.random(); this.color = '#ff8888'; this.gemValue = 2;
        } else if (type === 'hive') { // NEW ENEMY: HIVE
            this.size = 30; this.hp = 60 + (level * 4); this.speed = 0.8; this.color = '#800080'; this.gemValue = 15;
        } else {
            this.size = 15; this.hp = 15 + (level * 3); this.speed = 2.2 + Math.random(); this.color = CONFIG.COLORS.enemy; this.gemValue = 5;
        }
        
        this.maxHp = this.hp;
    }

    // Pass 'game' so we can see other enemies
    update(game) {
        // 1. Chase Player
        const angle = Utils.angle(this, game.player);
        this.x += Math.cos(angle) * this.speed + this.pushX;
        this.y += Math.sin(angle) * this.speed + this.pushY;

        // 2. Anti-Stacking (Soft Collision)
        // We look at other enemies and push away if too close
        game.enemies.forEach(other => {
            if (other === this) return;
            const dist = Utils.dist(this, other);
            const combinedSize = this.size + other.size;
            
            // Allow 10% overlap (0.9 multiplier)
            if (dist < combinedSize * 0.9) {
                const pushAngle = Utils.angle(other, this); // Angle FROM them TO me
                const force = 0.5; // How hard to push
                this.x += Math.cos(pushAngle) * force;
                this.y += Math.sin(pushAngle) * force;
            }
        });

        // Friction for knockback
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
            
            // Particles
            for(let i=0; i<5; i++) game.addParticle(this.x, this.y, this.color);

            // Hive Effect: Spawns 3 runners on death
            if (this.type === 'hive') {
                for(let i=0; i<3; i++) {
                    const e = new Enemy(this.x, this.y, 1, 'runner');
                    // Push them out so they don't get stuck
                    e.pushX = (Math.random() - 0.5) * 10;
                    e.pushY = (Math.random() - 0.5) * 10;
                    game.enemies.push(e);
                }
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        if (this.type === 'tank') ctx.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        else if (this.type === 'hive') {
            // Hexagon-ish for Hive
            ctx.moveTo(this.x + this.size, this.y);
            for (let i = 1; i <= 6; i++) {
                ctx.lineTo(this.x + this.size * Math.cos(i * 2 * Math.PI / 6), this.y + this.size * Math.sin(i * 2 * Math.PI / 6));
            }
        }
        else ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}