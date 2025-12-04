import { Game } from './game.js';

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

function loop() {
    game.update();
    game.draw();
    requestAnimationFrame(loop);
}

// Start
loop();
