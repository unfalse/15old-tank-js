console.log("counter!");
BattleTankGame.deps.counter = class extends BattleTankGame.deps.csw {
    // BattleTankGame.deps.baseCoordinates.call(this);
    constructor(CONST, BTankInst) {
      super();
      this.CONST = CONST;
      this.BTankInst = BTankInst;
      this.type = this.CONST.TYPES.COUNTER;
      this.counter = 0;
      this.counterMax = 10;
    }

    init(mx, my, who, BTankInst) {
      super.init(mx, my, who, BTankInst);
    }

    draw() {
      this.BTankInst.drawCounter(this.x, this.y, this.counter);
    }

    update(timestamp) {
      this.counter++;
      this.counter = this.counter > 9 ? 0 : this.counter;
      super.update(timestamp);
    }
  };