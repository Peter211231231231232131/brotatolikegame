import { CONFIG } from '../constants.js';
import { Bullet } from './bullet.js';
import { Utils } from '../utils.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.x = CONFIG.WORLD_SIZE / 2;
        this.y = CONFIG.WORLD_SIZE / 2;
        this.vx = 0; this.vy = 0;
        this.size = 20;
        
        this.hp = CONFIG.PLAYER.baseHp;
        this.maxHp = CONFIG.PLAYER.baseHp;
        this.xp = 0;
        this.level = 1;
        this.nextLevel = 10;
        this.gold = 0;

        // Weapons
        this.weapons = [
            { name: 'Pistol', damage: 10, range: 400, cd: 40, timer: 0, speed: 12, type: 'single' }
        ];
    }

    update(input) {
        // Apply Config Speed which might change via upgrades
        const speed = CONFIG.PLAYER.baseSpeed;
        
        if (input.x !== 0) this.vx += input.x * (speed * 0.2);
        if (input.y !== 0) this.vy += input.y * (speed * 0.2);

        this.vx *= CONFIG.PLAYER.friction;
        this.vy *= CONFIG.PLAYER.friction;
        this.x += this.vx;
        this.y += this.vy;

        this.x = Math.max(this.size, Math.min(CONFIG.WORLD_SIZE - this.size, this.x));
        this.y = Math.max(this.size, Math.min(CONFIG.WORLD_SIZE - this.size, this.y));

        this.handleCombat();
    }

    handleCombat() {
        let nearest = null;
        let minDist = Infinity;
        
        this.game.enemies.forEach(e => {
            const d = Utils.dist(this, e);
            if (d < minDist) { minDist = d; nearest = e; }
        });

        this.weapons.forEach(w => {
            if (w.timer > 0) w.timer--;
            
            if (w.timer <= 0 && nearest && minDist < w.range) {
                const angle = Utils.angle(this, nearest);
                this.fireWeapon(w, angle);
                w.timer = w.cd;
            }
        });
    }

    fireWeapon(w, angle) {
        if (w.type === 'single') {
            this.game.bullets.push(new Bullet(this.x, this.y, angle, w));
        } else if (w.type === 'shotgun') {
            for(let i = -1; i <= 1; i++) {
                this.game.bullets.push(new Bullet(this.x, this.y, angle + (i*0.2), w));
            }
        }
    }

    gainXp(amount) {
        this.xp += amount;
        this.gold += amount;
        if (this.xp >= this.nextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp = 0; // Reset XP Bar
        this.nextLevel = Math.floor(this.nextLevel * 1.5);
        
        // Full Heal on Level Up
        this.hp = this.maxHp;

        // Weapon Unlocks (Still keep this auto logic if you want)
        if (this.level === 3) this.weapons.push({ name: 'Shotgun', damage: 6, range: 250, cd: 60, timer: 0, speed: 10, type: 'shotgun' });

        // TRIGGER THE UI
        this.game.triggerLevelUp();
    }

    applyItem(item) {
        if (item.type === 'heal') {
            this.hp = Math.min(this.hp + item.val, this.maxHp);
        } else if (item.type === 'maxHp') {
            this.maxHp += item.val;
            this.hp += item.val;
        } else if (item.type === 'damage') {
            this.weapons.forEach(w => w.damage += item.val);
        } else if (item.type === 'speed') {
            CONFIG.PLAYER.baseSpeed += item.val;
        } else if (item.type === 'cooldown') {
            this.weapons.forEach(w => w.cd = Math.max(5, w.cd - item.val));
        }
    }

    draw(ctx) {
        ctx.fillStyle = CONFIG.COLORS.player;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 18, this.y - 12, 36, 6);
    }
}