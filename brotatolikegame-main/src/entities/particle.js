export class Particle {
    constructor(x, y, color, speed, size) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        this.dx = Math.cos(angle) * speed;
        this.dy = Math.sin(angle) * speed;
        this.size = size;
        this.color = color;
        this.life = 30 + Math.random() * 20;
        this.markedForDeletion = false;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.life--;
        this.size *= 0.95; // Shrink effect
        if (this.life <= 0 || this.size < 0.1) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}