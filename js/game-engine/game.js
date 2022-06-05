class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
    * 向量加法
    * @param {Vector} v
    */
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    /**
    * 向量减法
    * @param {Vector} v
    */
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    /**
    * 向量与标量乘法
    * @param {Number} s
    */
    multiply(s) {
        return new Vector(this.x * s, this.y * s);
    }

    /**
    * 向量与向量点乘（投影）
    * @param {Vector} v
    */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    /**
    * 向量标准化（除去长度）
    */
    normalize() {
        let distance = Math.sqrt(this.x * this.x + this.y * this.y);
        return new Vector(this.x / distance, this.y / distance);
    }

    distance() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    direct() {
        if (this.y === 0 && this.x > 0) return 0;
        if (this.y === 0 && this.x < 0) return 180;
        if (this.y > 0 && this.x === 0) return 90;
        if (this.y < 0 && this.x === 0) return 270;
        const t = Math.atan(this.y / this.x) * 180 / Math.PI
        if (this.x < 0) return t + 180;
        return t;
    }
}

class Stage {
    #items = [];
    #settings = {
        backgroundColor: '#FFFFFF',
        width: 0,
        height: 0,
        draw: function (ctx) {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, this.width, this.height);
        }
    };

    constructor(settings = {}) {
        this.#settings = { ...this.#settings, ...settings };
    }

    _update(ctx) {
        // 碰撞检测
        this.#items.map((item, index) => {
            item._gravityHandler();
            if (item._getIfDetectBorderCollision())
                item._borderCollisionDetect(this.#settings.width, this.#settings.height);
            if (item._getIfDetectCollision()) {

                const f = item.getIfCollision();

                item._offCollision();
                for (let i = index + 1; i < this.#items.length; i++) {
                    if (this.#items[i]._getIfDetectCollision())
                        item._collisionDetect(this.#items[i]);
                }

                if (f && !item.getIfCollision()) item._collisionOut();
                if (!f && item.getIfCollision()) item._collisionIn();
            }
        })
        // 清空画布
        ctx.clearRect(0, 0, this.#settings.width, this.#settings.height);
        // 重绘背景
        this.#settings.draw(ctx);
        // 重绘 items
        this.#items.map((item) => {
            item._update(ctx);
        })
    }

    _getItems() {
        return this.#items;
    }

    createItem(settings) {
        const item = new Item(settings);

        this.#items.push(item);

        return item;
    }
}

class Item {
    #loop = 0; // 当前帧
    #gifIndex = 0; // gif索引
    #srcIndex = 0; // src索引
    #times = 0; // 内部计时器
    #ifGif = false;
    #ifMove = false;
    #ifAnima = false;
    #ifCollision = false;
    #settings = {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        color: '#FFFFFF',
        speed: 15,
        direction: 0, // 方向角度, 弧度
        gap: 1, // 每张 gif 停留 n 帧
        src: null,
        gifs: null,
        ifDetectCollision: false, // 是否需要检验碰撞
        borderCollision: false, // 是否需要检验墙壁碰撞
        fixed: false, // 在需要检验碰撞的情况下，是否受其他因素而改变速度
        ifCircle: false, // 是否是圆形，否则是矩形
        cor: 1, // 恢复系数
        gravity: false,
        radius: 25,
        mass: 10,
        startAngle: 0,
        endAngle: 2 * Math.PI,
    };

    _loopAnima = function () {};

    _collisionIn = function () {};

    _collisionOut = function () {};

    _collisionHandler = function () {};

    constructor(settings = {}) {
        this.#settings = { ...this.#settings, ...settings };
    }

    _gravityHandler() {
        if (this.#settings.gravity) {
            const t = new Vector(this.#settings.speed * Math.cos(this.#settings.direction / 180 * Math.PI), this.#settings.speed * Math.sin(this.#settings.direction / 180 * Math.PI) - this.#settings.gravity);
            this.#settings.speed = t.distance();
            this.#settings.direction = t.direct();
        }
    }

    _update(ctx) {

        // 碰撞事件
        if (this.#ifCollision) {
            this._collisionHandler();
        }

        // 本身的循环动画
        if (this.#ifAnima) this._loopAnima();

        // 是否移动
        if (this.#ifMove) this._move();

        // 绘制，三种情况
        if (this.#ifGif && this.#settings.gifs) {
            ctx.drawImage(this.#settings.gifs[this.#gifIndex][this.#loop], this.#settings.x, this.#settings.y, this.#settings.width, this.#settings.height);
            if (this.#times === 0) {
                this.#loop = (this.#loop + 1) % this.#settings.gifs[this.#gifIndex].length;
            }
            this.#times = (this.#times + 1) % this.#settings.gap;
        } else if (this.#settings.src) {
            ctx.drawImage(this.#settings.src[this.#srcIndex], this.#settings.x, this.#settings.y, this.#settings.width, this.#settings.height);
        } else {
            ctx.fillStyle = this.#settings.color;
            if (this.#settings.ifCircle) {
                ctx.beginPath();
                ctx.arc(this.#settings.x, this.#settings.y, this.#settings.radius, this.#settings.startAngle, this.#settings.endAngle);
                ctx.fill();
            } else {
                ctx.fillRect(this.#settings.x, this.#settings.y, this.#settings.width, this.#settings.height);
            }
        }
    }

    /***
     * 获取静态资源，用于预先加载
     * @returns {null}
     */
    _getSrc() {
        return this.#settings.src;
    }

    /***
     * 获取静态资源，用于预先加载
     * @returns {null}
     */
    _getGifs() {
        return this.#settings.gifs;
    }

    /***
     * 获取是否开启碰撞检测
     * @returns {boolean}
     */
    _getIfDetectCollision() {
        return this.#settings.ifDetectCollision;
    }

    _getIfDetectBorderCollision() {
        return this.#settings.borderCollision;
    }

    /***
     * 碰撞检测并改变速度
     * @param item
     * @returns {boolean}
     */
    _collisionDetect(item) {
        const x1 = this.#settings.x + Math.cos(this.#settings.direction / 180 * Math.PI) * this.#settings.speed;
        const y1 = this.#settings.y - Math.sin(this.#settings.direction / 180 * Math.PI) * this.#settings.speed;
        const r1 = this.#settings.radius;
        const w1 = this.#settings.width;
        const h1 = this.#settings.height;
        const a1 = this.#settings.direction;
        const v1 = this.#settings.speed;
        const m1 = this.#settings.mass;
        const c1 = this.#settings.cor;
        const f1 = this.#settings.fixed;
        const x2 = item.#settings.x + Math.cos(item.#settings.direction / 180 * Math.PI) * item.#settings.speed;
        const y2 = item.#settings.y - Math.sin(item.#settings.direction / 180 * Math.PI) * item.#settings.speed;
        const r2 = item.#settings.radius;
        const w2 = item.#settings.width;
        const h2 = item.#settings.height;
        const a2 = item.#settings.direction;
        const v2 = item.#settings.speed;
        const f2 = item.#settings.fixed;
        const m2 = item.#settings.mass;
        const c2 = item.#settings.cor;
        // 碰撞检测，四种情况
        if (this.#settings.ifCircle && item.#settings.ifCircle) {
            const d1 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
            const d2 = (r1 + r2) * (r1 + r2);
            if (d1 <= d2) {
                this._onCollision();
                item._onCollision();

                const vec1 = new Vector(v1 * Math.cos(a1 / 180 * Math.PI), v1 * Math.sin(a1 / 180 * Math.PI));
                const vec2 = new Vector(v2 * Math.cos(a2 / 180 * Math.PI), v2 * Math.sin(a2 / 180 * Math.PI));
                const vec3 = new Vector(x1 - x2, y2 - y1).normalize();
                const vec4 = new Vector(-vec3.y, vec3.x);

                let v1n = vec1.dot(vec3);
                let v2n = vec2.dot(vec3);
                let v1t = vec1.dot(vec4);
                let v2t = vec2.dot(vec4);

                let v1nAfter = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
                let v2nAfter = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);
                let v1After = vec4.multiply(v1t).add(vec3.multiply(v1nAfter * c1));
                let v2After = vec4.multiply(v2t).add(vec3.multiply(v2nAfter * c2));

                if (f1 && f2) {
                    this.changeSpeed(0);
                    item.changeSpeed(0);
                } else if (!f1 && f2) {
                    this.changeSpeed(v2After.distance());
                    this.changeDirect(v2After.direct());
                } else if (f1 && !f2) {
                    item.changeSpeed(v1After.distance());
                    item.changeDirect(v1After.direct());
                } else {
                    this.changeSpeed(v1After.distance());
                    item.changeSpeed(v2After.distance());

                    this.changeDirect(v1After.direct());
                    item.changeDirect(v2After.direct());
                }
            }
        } else if (!this.#settings.ifCircle && !item.#settings.ifCircle) {
            //todo
        } else if (!this.#settings.ifCircle && item.#settings.ifCircle) {

        } else {

        }
    }

    _borderCollisionDetect(bw, bh) {
        const [x, y, w, h, r] = [
            this.#settings.x, this.#settings.y, this.#settings.width, this.#settings.height, this.#settings.radius
        ];
        const t = this.#settings.direction / 180 * Math.PI;
        if (this.#settings.ifCircle) {
            if ((x - r <= 0 && Math.cos(t) < 0) || (x + r >= bw && Math.cos(t) > 0)) {
                this.changeDirect(180 - this.#settings.direction);
                const t = new Vector(this.#settings.speed * Math.cos(this.#settings.direction / 180 * Math.PI) * this.#settings.cor, this.#settings.speed * Math.sin(this.#settings.direction / 180 * Math.PI));
                this.#settings.speed = t.distance();
                this.#settings.direction = t.direct();
            }
            if ((y - r <= 0 && Math.sin(t) > 0) || (y + r >= bh && Math.sin(t) < 0)) {
                this.changeDirect(-this.#settings.direction);
                const t = new Vector(this.#settings.speed * Math.cos(this.#settings.direction / 180 * Math.PI), this.#settings.speed * Math.sin(this.#settings.direction / 180 * Math.PI) * this.#settings.cor);
                this.#settings.speed = t.distance();
                this.#settings.direction = t.direct();
            }
        } else {
            if ((x <= 0 && Math.cos(t) < 0) || (x + w >= bw && Math.cos(t) > 0)) {
                this.changeDirect(180 - this.#settings.direction);
                this.#settings.speed = new Vector(this.#settings.speed * Math.cos(this.#settings.direction / 180 * Math.PI) * this.#settings.cor, this.#settings.speed * Math.sin(this.#settings.direction / 180 * Math.PI)).distance();
            }
            if ((y <= 0 && Math.sin(t) > 0) || (y + h >= bh && Math.sin(t) < 0)) {
                this.changeDirect(-this.#settings.direction);
                this.#settings.speed = new Vector(this.#settings.speed * Math.cos(this.#settings.direction / 180 * Math.PI), this.#settings.speed * Math.sin(this.#settings.direction / 180 * Math.PI) * this.#settings.cor).distance();
            }
        }
    }


    _onCollision() {
        this.#ifCollision = true;
    }

    _offCollision() {
        this.#ifCollision = false;
    }

    /***
     * 改变位置
     * @private
     */
    _move() {
        this.#settings.x += Math.cos(this.#settings.direction / 180 * Math.PI) * this.#settings.speed;
        this.#settings.y -= Math.sin(this.#settings.direction / 180 * Math.PI) * this.#settings.speed;
    }

    /***
     * 绑定事件
     * @param event
     * @param callback
     */
    bind(event, callback) {
        if (event === 'collisionIn') {
            this._collisionIn = callback.bind(this);
        } else if (event === 'collisionOut') {
            this._collisionOut = callback.bind(this);
        } else if (event === 'collision') {
            this._collisionHandler = callback.bind(this);
        } else {
            document.body.addEventListener(event, callback.bind(this));
        }
    }


    /***
     * 绑定自身动画
     * @param callback
     */
    bindAnima(callback) {
        this._loopAnima = callback;
    }

    /***
     * 改变颜色
     */
    changeColor(rgb) {
        this.#settings.color = rgb;
    }

    /***
     * 改变 gif 组
     * @param n
     */
    changeGif(n) {
        this.#gifIndex = n;
    }

    /***
     * 改变静态图片
     * @param n
     */
    changeSrc(n) {
        this.#srcIndex = n;
    }

    /***
     * 改变方向
     * @param n
     */
    changeDirect(n) {
        // n 为角度
        this.#settings.direction = n;
    }

    changeSpeed(n) {
        this.#settings.speed = n;
    }

    /***
     * 开始自身动画
     */
    startAnima() {
        this.#ifAnima = true;
    }

    /***
     * 结束自身动画
     */
    stopAnima() {
        this.#ifAnima = false;
    }

    /***
     * 结束循环 gif 组
     */
    startGif() {
        this.#ifGif = true;
    }

    /***
     * 开始循环 gif 组
     */
    stopGif() {
        this.#ifGif = false;
    }

    /***
     * 获取方向
     * @returns {number}
     */
    getDirect() {
        return this.#settings.direction;
    }

    getIfCollision() {
        return this.#ifCollision;
    }

    /***
     * 开始改变位置（根据 speed 和 direction）
     */
    startMove() {
        this.#ifMove = true;
    }

    /***
     * 停止改变位置
     */
    stopMove() {
        this.#ifMove = false;
    }
}

export class Game {

    #loopId;
    #ctx;
    #width;
    #height;

    #stages = [];
    #currentStage = 0;

    constructor(canvas) {
        this.#ctx = canvas.getContext('2d');
        this.#width = canvas.width;
        this.#height = canvas.height;
    }

    createStage(settings = {}) {
        const stage = new Stage({
            ...{
                width: this.#width,
                height: this.#height,
            },
            ...settings,
        });

        this.#stages.push(stage);
        this.#currentStage = this.#stages.length - 1;

        return stage;
    }

    _start() {
        const stage = this.#stages[this.#currentStage];
        const ctx = this.#ctx;
        stage._update(ctx);
        this.#loopId = requestAnimationFrame(this._start.bind(this));
    }

    init() {
        const stage = this.#stages[this.#currentStage];

        // 加载图像资源
        stage._getItems().map((item) => {

            // 加载静态资源
            if (item._getSrc()) {
                item._getSrc().map((src, i) => {
                    const img = new Image();
                    img.src = src;
                    item._getSrc()[i] = img;
                });
            }

            // 加载动态资源
            if (item._getGifs()) {
                item._getGifs().map((gif, i) => {
                    let images = [];
                    for (let i = 1; i <= gif[1]; i++) {
                        const img = new Image();
                        img.src = gif[0] + i + gif[2];
                        images.push(img);
                    }

                    item._getGifs()[i] = images;
                });
            }
        });

        window.onload = () => this._start();
    }

    pause() {
        if (this.#loopId) {
            cancelAnimationFrame(this.#loopId);
            this.#loopId = 0;
        } else {
            this._start();
        }
    }

    bind(event, callback) {
        const func = callback.bind(this);
        document.body.addEventListener(event, func);
    }
}