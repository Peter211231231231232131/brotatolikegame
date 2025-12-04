export class Utils {
    static lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    static dist(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    static angle(from, to) {
        return Math.atan2(to.y - from.y, to.x - from.x);
    }

    static rectIntersect(r1, r2) {
        return !(r2.left > r1.right || 
                 r2.right < r1.left || 
                 r2.top > r1.bottom || 
                 r2.bottom < r1.top);
    }
}
