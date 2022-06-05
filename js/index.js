import { Game } from './game-engine/game.js';

const canvas = document.getElementById('game');

let game = new Game(canvas);
let stage = game.createStage({
    frames: 60,
    backgroundColor: '#000000',
});

game.bind('keydown', function (e) {
    e.preventDefault();
    if (e.keyCode === 32) {
        game.pause();
    }
});

// const p1 = stage.createItem({
//     color: '#ffffff',
//     x: canvas.width / 2,
//     y: canvas.height / 2,
//     width: 100,
//     height: 120,
//     speed: 10,
//     gap: 10,
//     radius: 10,
//     ifCircle: true,
//     ifDetectCollision: true,
//     borderCollision: true,
//     fixed: true,
//     mass: 10,
//     // src: ['../images/2.png', '../images/3.png'],
//     // gifs: [
//     //     ['../images/gif/rightMove/', 6, '.png'],
//     //     ['../images/gif/leftMove/', 6, '.png'],
//     // ],
// });
// p1.startMove();
// p1.bind('keydown', function (e) {
//     e.preventDefault();
//     switch (e.keyCode) {
//         case 39: //右
//             this.changeDirect(0);
//             // this.startGif();
//             // this.startMove();
//             // this.changeGif(0);
//             break;
//         case 37: //左
//             this.changeDirect(180);
//             // this.startGif();
//             // this.startMove();
//             // this.changeGif(1);
//             break;
//         case 40:
//             this.changeDirect(270);
//             break;
//         case 38:
//             this.changeDirect(90);
//     }
// });
//
// p1.bind('keyup', function (e) {
//     e.preventDefault();
//     switch (e.keyCode) {
//         case 39: //右
//             if (this.getDirect() === 45) {
//                 this.changeSrc(0);
//                 this.stopGif();
//                 this.stopMove();
//             }
//             break;
//         case 37: //左
//             if (this.getDirect() === 225) {
//                 this.changeSrc(1);
//                 this.stopGif();
//                 this.stopMove();
//             }
//             break;
//     }
// })

const handler = function () {
    this.changeColor('#fc8383');
}

const handler2 = function () {
    this.changeColor('#FFFFFF');
}

for (let i = 0; i < 10; i++) {
    const p = stage.createItem({
        color: '#FFFFFF',
        x: Math.random() * 1000 % 500,
        y: Math.random() * 1000 % 500,
        radius: Math.random() * 1000 % 50,
        ifDetectCollision: true,
        borderCollision: true,
        ifCircle: true,
        direction: 0,
        speed: Math.random() * 1000 % 10,
        //gravity: 0.98,
        //cor: 0.5,
        mass: 10,
        fixed: false,
    });
    p.bind('collision', handler);
    p.bind('collisionOut', handler2);
    p.startMove()
}

game.init();

