export class Bullet {
    constructor(x, y, angle, stats) {
        this.x = x;
        this.y = y;
        this.dx = Math.cos(angle) * stats.speed;
        this.dy = Math.sin(angle) * stats.speed;
        this.damage = stats.damage;
        this.life = stats.life || 60;
        this.size = stats.type === 'explosive' ? 8 : 6; // Rockets are bigger
        this.color = stats.color || 'yellow';
        this.type = stats.type; // Save type
        this.markedForDeletion = false;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.life--;
        if (this.life <= 0) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}