export class Ship {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(this.x, this.y, this.size, this.size);
    }

    move(dx, maxX) {
        this.x += dx;
        if (this.x < 0) this.x = 0;
        if (this.x > maxX - this.size) this.x = maxX - this.size;
    }
}