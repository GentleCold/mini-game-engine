class Stage {

    #items = [];

    settings = {
        backgroundColor: '#FFFFFF',
        width: 0,
        height: 0,
        draw: function (ctx) {
            ctx.fillStyle = this.backgroundColor;
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.fillRect(0, 0, this.width, this.height);
        }
    };

    constructor(settings = {}) {
        this.settings = { ...this.settings, ...settings };
    }

    update(ctx) {
        this.settings.draw(ctx);
        this.#items.map((item) => {
            item.update(ctx);
        })
    }

    createItem(settings) {
        const item = new Item(settings);
        this.#items.push(item);
        return item;
    }
}

class Item {

    settings = {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        color: '#FFFFFF',
        direction: 0, // 0 ~ 3
        draw: function (ctx) {
            ctx.fillStyle = this.color;
            ctx.clearRect(this.x, this.y, this.width, this.height);
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
    };

    constructor(settings = {}) {
        this.settings = { ...this.settings, ...settings };
    }

    update(ctx) {
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
        this.#stages[this.#currentStage].update(this.#ctx);
    }
}