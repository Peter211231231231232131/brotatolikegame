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

        // Init weapons with angle tracking
        this.weapons = [ { ...CONFIG.WEAPONS.pistol, timer: 0, angle: 0, kickback: 0 } ];
    }

    update(input) {
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

        this.weapons.forEach((w) => {
            // 1. Aim
            if (nearest && minDist < w.range + 100) {
                w.angle = Utils.angle(this, nearest);
            } else if (Math.abs(this.vx) > 0.1 || Math.abs(this.vy) > 0.1) {
                w.angle = Math.atan2(this.vy, this.vx);
            }

            // 2. Fire
            if (w.timer > 0) w.timer--;
            
            if (w.timer <= 0 && nearest && minDist < w.range) {
                this.fireWeapon(w, w.angle);
                w.timer = w.cd;
                w.kickback = 12; // Visual Recoil
            }

            // Smooth Recoil Return
            if (w.kickback > 0) w.kickback--;
        });
    }

    fireWeapon(w, angle) {
        if (w.type === 'single' || w.type === 'explosive') {
            this.game.bullets.push(new Bullet(this.x, this.y, angle, w));
        } else if (w.type === 'shotgun') {
            for(let i = -1; i <= 1; i++) {
                this.game.bullets.push(new Bullet(this.x, this.y, angle + (i*0.2), w));
            }
        }
    }

    applyItem(item) {
        if (item.type === 'weapon') {
            if (CONFIG.WEAPONS[item.id]) {
                this.weapons.push({ ...CONFIG.WEAPONS[item.id], timer: 0, angle: 0, kickback: 0 });
            }
        }
        else if (item.type === 'heal') this.hp = Math.min(this.hp + item.val, this.maxHp);
        else if (item.type === 'maxHp') { this.maxHp += item.val; this.hp += item.val; }
        else if (item.type === 'damage') this.weapons.forEach(w => w.damage += item.val);
        else if (item.type === 'speed') CONFIG.PLAYER.baseSpeed += item.val;
        else if (item.type === 'cooldown') this.weapons.forEach(w => w.cd = Math.max(5, w.cd - item.val));
    }

    gainXp(amount) {
        this.xp += amount;
        this.gold += amount;
        if (this.xp >= this.nextLevel) this.levelUp();
    }

    levelUp() {
        this.level++;
        this.xp = 0;
        this.nextLevel = Math.floor(this.nextLevel * 1.5);
        this.hp = this.maxHp;
        this.game.triggerLevelUp();
    }

    draw(ctx) {
        // Body
        ctx.fillStyle = CONFIG.COLORS.player;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Bandana
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 18, this.y - 12, 36, 6);

        // Draw Weapons
        this.weapons.forEach((w) => {
            ctx.save();
            ctx.translate(this.x, this.y + 5); 
            ctx.rotate(w.angle);
            
            // Recoil
            const kick = w.kickback || 0;
            ctx.translate(-kick, 0);

            // RENDER GUNS
            if (w.name === 'Shotgun') {
                ctx.fillStyle = '#8b4513'; ctx.fillRect(10, -4, 15, 8); // Stock
                ctx.fillStyle = '#555';    ctx.fillRect(25, -3, 15, 6); // Barrel
            } 
            else if (w.name === 'Bazooka') {
                ctx.fillStyle = '#2e8b57'; ctx.fillRect(5, -6, 35, 12); // Tube
                ctx.fillStyle = '#000';    ctx.fillRect(40, -6, 5, 12); // Tip
            }
            else if (w.name === 'SMG') {
                ctx.fillStyle = '#222';    ctx.fillRect(15, -3, 20, 6); // Body
                ctx.fillRect(15, 3, 5, 8); // Mag
            }
            else { // Pistol
                ctx.fillStyle = '#999';    ctx.fillRect(15, -3, 15, 6);
                ctx.fillStyle = '#555';    ctx.fillRect(10, -2, 8, 4);
            }

            ctx.restore();
        });
    }
}