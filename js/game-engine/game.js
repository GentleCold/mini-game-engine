class Stage {

    items = [];

    settings = {
        backgroundColor: '#FFFFFF',
        width: 0,
        height: 0,
        frames: 60, // 1s 60 帧
        draw: function (ctx) {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, this.width, this.height);
        }
    };

    constructor(settings = {}) {
        this.settings = { ...this.settings, ...settings };
    }

    #update(ctx) {
        ctx.clearRect(0, 0, this.settings.width, this.settings.height);
        this.settings.draw(ctx);
        this.items.map((item) => {
            item.update(ctx);
        })
    }

    update = this.#update.bind(this);

    createItem(settings) {
        const item = new Item(settings);
        this.items.push(item);
        return item;
    }
}

class Item {
    #loop = 0; // 当前帧
    #gifIndex = 0; // gif索引
    #times = 0; // 内部计时器
    #ifGif = false;
    #ifMove = false;
    settings = {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        color: '#FFFFFF',
        direction: 1, // 0 ~ 3 顺时针
        speed: 15,
        gap: 1,
        src: null,
        gifs: null,
        loopAnima: function () {},
        draw: function (ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
    };

    constructor(settings = {}) {
        this.settings = { ...this.settings, ...settings };
    }

    update(ctx) {
        this.settings.loopAnima();
        if (this.#ifMove) this.#move();
        if (this.#ifGif && this.settings.gifs) {
            ctx.drawImage(this.settings.gifs[this.#gifIndex][this.#loop], this.settings.x, this.settings.y, this.settings.width, this.settings.height);
            if (this.#times === 0) {
                this.#loop = (this.#loop + 1) % this.settings.gifs[this.#gifIndex].length;
            }
            this.#times = (this.#times + 1) % this.settings.gap;
        } else if (this.settings.src) {
            ctx.drawImage(this.settings.src, this.settings.x, this.settings.y, this.settings.width, this.settings.height);
        } else {
            this.settings.draw(ctx);
        }
    }

    bind(event, callback) {
        const func = callback.bind(this);
        document.body.addEventListener(event, func);
    }

    turnGif(n) {
        this.#gifIndex = n;
    }

    stopGif() {
        this.#ifGif = false;
    }

    startGif() {
        this.#ifGif = true;
    }

    #move() {
        const offset = [
            [0, -this.settings.speed],
            [this.settings.speed, 0],
            [0, this.settings.speed],
            [-this.settings.speed, 0]
        ];
        this.settings.x += offset[this.settings.direction][0];
        this.settings.y += offset[this.settings.direction][1];
    }

    startMove() {
        this.#ifMove = true;
    }

    stopMove() {
        this.#ifMove = false;
    }
}

export class Game {

    #loopId;
    #ctx;
    width;
    height;

    #stages = [];
    #currentStage = 0;

    constructor(canvas) {
        this.#ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }

    createStage(settings = {}) {
        const stage = new Stage({
            ...{
                width: this.width,
                height: this.height,
            },
            ...settings,
        });

        this.#stages.push(stage);
        this.#currentStage = this.#stages.length - 1;

        return stage;
    }

    start() {
        const stage = this.#stages[this.#currentStage];
        const ctx = this.#ctx;
        this.#loopId = setInterval(stage.update, 1000 / stage.settings.frames, ctx);
    }

    init() {
        const stage = this.#stages[this.#currentStage];
        stage.items.map((item) => {
            if (item.settings.src) {
                const img = new Image();
                img.src = item.settings.src;
                item.settings.src = img;
            }
            if (item.settings.gifs) {
                item.settings.gifs.map((gif, i) => {
                    let images = [];
                    for (let i = 1; i <= gif[1]; i++) {
                        const img = new Image();
                        img.src = gif[0] + i + gif[2];
                        images.push(img);
                    }

                    item.settings.gifs[i] = images;
                })
            }
        });
        window.onload = () => this.start();
    }


    pause() {
        if (this.#loopId) {
            clearInterval(this.#loopId);
            this.#loopId = 0;
        } else {
            this.start();
        }
    }

    bind(event, callback) {
        const func = callback.bind(this);
        document.body.addEventListener(event, func);
    }
}