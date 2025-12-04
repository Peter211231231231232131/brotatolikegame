import { CONFIG } from '../constants.js';
import { Utils } from '../utils.js';

export class Gem {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.size = 8;
        this.markedForDeletion = false;
    }

    update(player) {
        const dist = Utils.dist(this, player);
        
        // Magnet
        if (dist < 100) {
            this.x += (player.x - this.x) * 0.15;
            this.y += (player.y - this.y) * 0.15;
        }

        // Collect
        if (dist < player.size + this.size) {
            player.gainXp(this.value);
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = CONFIG.COLORS.gem;
        ctx.beginPath();
        ctx.rect(this.x - 4, this.y - 4, 8, 8);
        ctx.fill();
    }
}
