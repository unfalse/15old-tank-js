console.log("delayed pic!");

BattleTankGame.deps.delayedPic = class extends BattleTankGame.deps
    .baseCoordinates {
    constructor(CONST) {
        super();
    }

    init(nx, ny, BTankInst) {
        this.initCoords(nx, ny, 0);
        this.show = true;
        this.timerStarted = false;
        this.BTankInst = BTankInst;
    }

    setCoords(x, y) {
        this.x = x;
        this.y = y;
        this.show = true;
    }

    draw() {
        this.BTankInst.DrawCrash(this.x, this.y);
        if (!this.timerStarted && this.show) {
            this.timerStarted = true;
            setTimeout(
                function () {
                    this.show = false;
                    this.timerStarted = false;
                    this.BTankInst.removeDelayedPic(this);
                }.bind(this),
                300
            );
        }
    }
};
