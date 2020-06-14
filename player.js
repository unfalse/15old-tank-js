console.log("player!");

BattleTankGame.deps.player = class extends BattleTankGame.deps.csw {
    constructor(CONST, bullet) {
        super(CONST, bullet);
        this.type = this.CONST.USER;
        this.PLAYER_BULLETS_INTERVAL = 100;
    }

    // TODO: move BTankInst to a the constructor
    init(mx, my, who, BTankInst) {
        super.init(mx, my, who, BTankInst);
        this.maxlife = 3;
        this.life = this.maxlife;
        this._dp = new BattleTankGame.deps.delayedPic(this.CONST);
        this._dp.init(0, 0, 0, this.BTankInst);
    }

    addAccel(value) {
        this.accel += value;
    }

    draw() {
        this.BTankInst.drawcswmt9(this.x, this.y, this.d);
    }

    fire(timestamp) {
        if (
            timestamp - this.lastBulletTimeStamp >=
            this.PLAYER_BULLETS_INTERVAL
        ) {
            this.lastBulletTimeStamp = timestamp;
            const bullet = this.createNewBullet(this.x, this.y, this.d);
            if (bullet) this._dp.setCoords(bullet.x-10, bullet.y-10);
        }
    }

    // TODO: maybe move acceleration, direction and inertia control functions into the separate class
    setDirectionAndAddAccel(d, accel) {
        this.d = d;

        if (this.inertiaDirections[this.CONST.DIR_OPPOSITES[d]] > 0) {
            this.inertiaDirections[this.CONST.DIR_OPPOSITES[d]] -= accel;
            if (this.inertiaDirections[this.CONST.DIR_OPPOSITES[d]] < 0) {
                this.inertiaDirections[this.CONST.DIR_OPPOSITES[d]] = 0;
            }
        } else {
            if (this.inertiaDirections[d] + accel > this.MAXIMUM_ACCELERATION) {
                return;
            }
            this.inertiaDirections[d] += accel;
        }
    }

    // update(timestamp) {
    //     super.update(timestamp);
    //     this.draw();
    // }

    hitByBullet(bulletInstance) {
        if (bulletInstance.parentShip.iam === this.CONST.COMPUTER) {
            if (this.iam === this.CONST.USER) {
                this.life--;
            }
        }
    }
};
