console.log("bulletPixel!");
BattleTankGame.deps.camera = class extends BattleTankGame.deps
    .baseCoordinates {
      constructor(CONST, BTankInst) {
        super();

        this.CONST = CONST;
        this.BTankInst = BTankInst;
      }

      setCoords(x, y) {
        this.x = x;
        this.y = y;
      }

      getRelCoords(x, y) {
        return {
          x: x - this.BTankInst.gameCam.x + this.CONST.CAM.CENTERX,
          y: y - this.BTankInst.gameCam.y + this.CONST.CAM.CENTERY,
        }
      }
}