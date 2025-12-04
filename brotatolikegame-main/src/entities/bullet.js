export class Bullet {
    constructor(x, y, angle, stats) {
        this.x = x;
        this.y = y;
        this.dx = Math.cos(angle) * stats.speed;
        this.dy = Math.sin(angle) * stats.speed;
        this.damage = stats.damage;
        this.life = stats.life || 60;
        this.size = stats.type === 'explosive' ? 8 : (stats.type === 'piercing' ? 4 : 6);
        this.color = stats.color || 'yellow';
        this.type = stats.type;
        this.markedForDeletion = false;
        
        // Piercing logic: Keep track of who we hit so we don't hit them twice
        this.hitList = []; 
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
        // Laser looks like a line
        if (this.type === 'piercing') {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.dx, this.y - this.dy);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 4;
            ctx.stroke();
        } else {
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}