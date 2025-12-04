import { CONFIG } from '../constants.js';
import { Utils } from '../utils.js';

export class Gem {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.size = 8;
        this.markedForDeletion = false;
        this.bobOffset = Math.random() * 100;
    }

    update(player) {
        const dist = Utils.dist(this, player);
        
        // Magnet Logic (Using Player's range)
        if (dist < player.pickupRange) {
            this.x += (player.x - this.x) * 0.15;
            this.y += (player.y - this.y) * 0.15;
        }

        // Collection
        if (dist < player.size + this.size) {
            player.gainXp(this.value);
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        // Bobbing animation
        const bob = Math.sin((Date.now() / 200) + this.bobOffset) * 2;
        
        ctx.fillStyle = CONFIG.COLORS.gem;
        ctx.beginPath();
        ctx.rect(this.x - 4, this.y - 4 + bob, 8, 8);
        ctx.fill();
    }
}