import { Game } from './game-engine/game.js';

const canvas = document.getElementById('game');

let game = new Game(canvas);
let stage = game.createStage({
    frames: 60,
    backgroundColor: '#4d816a',
});

game.bind('keydown', function (e) {
    e.preventDefault();
    if (e.keyCode === 32) {
        game.pause();
    }
});

const p1 = stage.createItem({
    color: '#fc8383',
    x: game.width / 2,
    y: game.height / 2,
    width: 100,
    height: 120,
    speed: 10,
    gap: 10,
    src: '../images/2.png',
    gifs: [
        ['../images/gif/rightMove/', 6, '.png'],
        ['../images/gif/leftMove/', 6, '.png'],
    ],
});

p1.bind('keydown', function (e) {
    e.preventDefault();
    switch (e.keyCode) {
        case 39: //右
            this.settings.direction = 1;
            this.startGif();
            this.startMove();
            this.turnGif(0);
            break;
        case 37: //左
            this.settings.direction = 3;
            this.startGif();
            this.startMove();
            this.turnGif(1);
            break;
    }
});
p1.bind('keyup', function (e) {
    e.preventDefault();
    switch (e.keyCode) {
        case 39: //右
            this.stopGif();
            this.stopMove();
            break;
        case 37: //左
            this.stopGif();
            this.stopMove();
            break;
    }
})

stage.createItem({
    color: '#fce083',
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    speed: 15,
    src: '../images/1.png',
    animate: function () {},
})

game.init();

