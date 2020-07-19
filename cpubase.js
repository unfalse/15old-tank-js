console.log("cpu base!");

BattleTankGame.deps.cpuBase = class extends BattleTankGame.deps.csw {
    constructor(CONST, bullet) {
        super(CONST, bullet);
        this.type = this.CONST.COMPUTER;
    }

    fire(timestamp) {
        if (this.fireStartTime === -1) {
            this.fireStartTime = timestamp;
        }
        if (timestamp - this.fireStartTime >= 100) {
            this.fireStartTime = timestamp;
            this.createNewBullet(this.x, this.y, this.d);
        }
    }

    draw() {
        this.BTankInst.drawcswmt5(this.x, this.y, this.d);
    }

    hitByBullet(bulletInstance) {
        if (bulletInstance.parentShip.iam === this.CONST.USER) {
            if (this.iam === this.CONST.COMPUTER) {
                this.life--;
            }
        }
    }
};
