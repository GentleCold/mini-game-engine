import { Game } from './game-engine/game.js';

const canvas = document.getElementById('game');

let game = new Game(canvas);
let stage = game.createStage({
    frames: 120,
    backgroundColor: '#4d816a',
});
stage.createItem({
    color: '#fc8383',
    x: 10,
    y: 10,
    width: 50,
    height: 50,
});
game.start();

