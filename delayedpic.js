console.log("delayed pic!");

BattleTankGame.deps.delayedPic = class extends BattleTankGame.deps.baseCoordinates {
    constructor(CONST) {
        super();
    }

    init(nx, ny, id, BTankInst) {
      this.initCoords(nx, ny, 0);
      this.id = id;
      this.show = false;
      this.BTankInst = BTankInst;
    }

    setCoords(x, y) {
      this.x = x;
      this.y = y;
      this.show = true;
      setTimeout((function() { this.show = false; }).bind(this), 300);
    }

    draw() {
      this.BTankInst.DrawCrash(this.x, this.y);
    }
};
