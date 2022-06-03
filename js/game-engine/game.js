class Stage {

    #items = [];

    settings = {
        backgroundColor: '#FFFFFF',
        width: 0,
        height: 0,
        frames: 30, // 1s 30 帧
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
        this.#items.map((item) => {
            item.update(ctx);
        })
    }

    update = this.#update.bind(this);

    createItem(settings) {
        const item = new Item(settings);
        this.#items.push(item);
        return item;
    }
}

class Item {

    #times = 0; // 内部计时器

    settings = {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        color: '#FFFFFF',
        direction: 1, // 0 ~ 3 顺时针
        speed: 1, // n 帧 update 一次, auto = false 则失效
        auto: false, // 是否自动变化
        animate: function () {
            const offset = [
                [0, -1],
                [1, 0],
                [0, 1],
                [-1, 0]
            ];

            this.x += offset[this.direction][0];
            this.y += offset[this.direction][1];
        },
        draw: function (ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
    };

    constructor(settings = {}) {
        this.settings = { ...this.settings, ...settings };
    }

    update(ctx) {
        if (this.settings.auto) {
            if (this.#times === 0) {
                this.settings.animate();
                this.#times = (this.#times + 1) % this.settings.speed;
            }
        }
        this.settings.draw(ctx);
    }

}

export class Game {

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

    start() {
        const stage = this.#stages[this.#currentStage];
        const ctx = this.#ctx;
        setInterval(stage.update, 1000 / stage.settings.frames, ctx);
    }
}