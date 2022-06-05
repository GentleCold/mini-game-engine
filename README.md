#mini 游戏引擎

js 编写，基于 canvas

已实现功能：
* 导入图片
* 导入动画（一组图片）
* 绑定事件（实现移动等）
* 碰撞检测
* 碰撞模拟（仅圆形和圆形，且存在重合的 bug）
* 碰撞事件
* 重力模拟

###使用方法：
####结构：
三个大类：Game, Stage, Item
####导入：
<code>import { Game } from './game-engine/game.js';</code>
####创建游戏主程序和 Stage：
```ecmascript 6
const canvas = document.getElementById('game');
let game = new Game(canvas);
let stage = game.createStage({
    backgroundColor: '#000000', 
});
```
####创建 Item：
```ecmascript 6
const item = stage.createItem({
    color: '#ffffff',
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 100,
    height: 120,
    speed: 10, // 移动速度
    gap: 10, // 每张 gif 停留 n 帧
    radius: 10, // 圆形的半径
    ifCircle: true, // 是否为圆形
    startAngle: 0,
    endAngle: 2 * Math.PI,
    ifDetectCollision: true, // 是否开启碰撞检测
    borderCollision: true, // 是否检测边界碰撞
    fixed: true, // 在需要检验碰撞的情况下，是否受其他因素而改变速度
    mass: 10, // 重量
    cor: 1, // 恢复系数
    gravity: false, // 重力加速度
    src: ['../images/2.png', '../images/3.png'], // 静态图片资源
    gifs: [                                      // 动态图片资源
        ['../images/gif/rightMove/', 6, '.png'],
        ['../images/gif/leftMove/', 6, '.png'],
    ],
});
```
####绑定事件：
```ecmascript 6
// event 即浏览器的 Event
// 另外实现了 'collision', 'collisionIn', 'collisionOut'事件
item.bind(event, callback);
```
####开始执行：
```ecmascript 6
game.init();
```
###License
MIT

~~ps：碰撞那块实在写的很烂，写不下去了...~~

~~希望有大佬 contribute~~