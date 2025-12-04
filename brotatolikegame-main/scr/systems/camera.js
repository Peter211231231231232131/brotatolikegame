import { CONFIG } from '../constants.js';
import { Utils } from '../utils.js';

export class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
    }

    update(target) {
        const targetX = target.x - this.width / 2;
        const targetY = target.y - this.height / 2;

        // Smooth follow (Lerp)
        this.x = Utils.lerp(this.x, targetX, 0.1);
        this.y = Utils.lerp(this.y, targetY, 0.1);

        // Keep in bounds
        this.x = Math.max(0, Math.min(this.x, CONFIG.WORLD_SIZE - this.width));
        this.y = Math.max(0, Math.min(this.y, CONFIG.WORLD_SIZE - this.height));
    }
}
