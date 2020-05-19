console.log("csw AI_0!");

BattleTankGame.deps.cswAI_0 = function (CONST, bullet) {
    BattleTankGame.deps.csw.call(this, CONST, bullet);
    this.path = null; // { d: 0, accel: 0, ms: 0 };
    this.pathStartTime = -1;
    this.fireStartTime = -1;

    this.pathPresetCount = 0;
    // direction {
    //   >  0 - right
    //   v  1 - down
    //   <  2 - left
    //   ^  3 - up
    // TODO: add the persistent speed?
    const right = 0;
    const down = 1;
    const left = 2;
    const up = 3;
    const STOP = 0;
    const go = (d, accel, ms) => ({ d, accel, ms });
    const gpStop = () => [
        go(left, 0, STOP),
        go(right, 0, STOP),
        go(up, 0, STOP),
        go(down, 0, STOP),
    ];
    const goLeftAndRight = [
        go(left, 1, 2000),
        ...gpStop(),

        go(right, 1, 2000),
        ...gpStop(),
    ];

    this.pathsPresets = [
        go(left, 1, 1000),
        go(up, 1, 1000),
        ...gpStop(),

        go(left, 1, 1000),
        go(down, 1, 1000),
        ...gpStop(),

        go(down, 1, 1000),
        ...gpStop(),

        go(left, 1, 1000),
        go(up, 1, 1000),
        ...gpStop(),

        go(right, 1, 0),
        go(up, 1, 1000),
        ...gpStop(),

        go(right, 1, 1000),
        go(down, 1, 1000),
        ...gpStop(),

        go(down, 1, 1000),
        ...gpStop(),

        go(right, 1, 1000),
        go(up, 1, 1000),
        ...gpStop(),
    ];
};

BattleTankGame.deps.cswAI_0.prototype = Object.create(
    BattleTankGame.deps.csw.prototype
);

BattleTankGame.deps.cswAI_0.prototype.constructor = BattleTankGame.deps.cswAI_0;

BattleTankGame.deps.cswAI_0.prototype.AI_generateNewPath = function () {
    if (this.pathPresetCount > this.pathsPresets.length - 1) {
        this.pathPresetCount = 0;
    }
    const path = this.pathsPresets[this.pathPresetCount];
    this.pathPresetCount++;
    return path;
    // return {
    //     d: this.Utils.getRandomInt(0, 3),
    //     accel: this.Utils.getRandomInt(0, 5) / 10,
    //     ms: this.Utils.getRandomInt(0, 200),
    // };
};

BattleTankGame.deps.cswAI_0.prototype.AI_update = function (timestamp) {
    // if (!this.path) {
    //     this.path = this.AI_generateNewPath();
    //     this.pathStartTime = timestamp;
    // }
    if (this.path && timestamp - this.pathStartTime <= this.path.ms) {
        this.setDirectionAndAccel(this.path.d, this.path.accel, this.path.ms);
    } else {
        // this.path = null;
        do {
            this.path = this.AI_generateNewPath();
            if (this.path.ms === 0) {
                this.setDirectionAndAccel(
                    this.path.d,
                    this.path.accel,
                    this.path.ms
                );
            }
        } while (this.path.ms === 0);
        this.pathStartTime = timestamp;
    }
    this.update();
    this.fire(timestamp);
};

////////////////////////////////////////////////////////// cswAI_1

console.log("csw AI_1!");

BattleTankGame.deps.cswAI_1 = function (CONST, bullet) {
    BattleTankGame.deps.csw.call(this, CONST, bullet);
    this.path = null; // { d: 0, accel: 0, ms: 0 };
    this.pathStartTime = -1;
    this.fireStartTime = -1;
    this.fireLastTime = -1;
    this.newFireTime = -1;
    this.disableAI = false;
    this.baseUpdate = this.update;
    // this.update = function (timestamp) { console.log('function was overrided!'); };
    // debugger;
    // d: 0...3, a: 0...1, ms: (0...1) *1000
};

BattleTankGame.deps.cswAI_1.prototype = Object.create(
    BattleTankGame.deps.csw.prototype
);

BattleTankGame.deps.cswAI_1.prototype.constructor = BattleTankGame.deps.cswAI_1;

BattleTankGame.deps.cswAI_1.prototype.AI_generateNewPath = function () {
    return {
        d: this.Utils.getRandomInt(0, 3),
        accel: this.Utils.getRandomInt(0, 1),
        ms: this.Utils.getRandomInt(0, 6) * 1000,
    };
};

BattleTankGame.deps.cswAI_1.prototype.AI_generateNewFireTime = function () {
    return this.Utils.getRandomInt(1, 3) * 1000;
}

BattleTankGame.deps.cswAI_1.prototype.AI_update = function (timestamp) {
    if (this.life > 0 && !this.disableAI) {
        if (this.path && ((timestamp - this.pathStartTime) <= this.path.ms)) {
            this.setDirectionAndAccel(
                this.path.d,
                this.path.accel,
                this.path.ms
            );
        } else {
            do {
                this.path = this.AI_generateNewPath();
                if (this.path.ms === 0) {
                    this.setDirectionAndAccel(
                        this.path.d,
                        this.path.accel,
                        this.path.ms
                    );
                }
            } while (this.path.ms === 0);
            this.pathStartTime = timestamp;
        }

    }
    // this.update();

    if (this.life > 0 && !this.disableAI) {
        if (this.newFireTime < 0) {
            this.newFireTime = this.AI_generateNewFireTime();
            this.fireLastTime = timestamp;
        }
        if ((this.newFireTime>0) && (timestamp - this.fireLastTime >= this.newFireTime)) {
            this.fire(timestamp);
            this.newFireTime = this.AI_generateNewFireTime();
            this.fireLastTime = timestamp;
        }
        // this.fire(timestamp);
    }

    // TODO: try to call the update of the parent prototype (CSW !)
    // this way i don't need to check if this.iam equals CONST.COMPUTER in csw.update anymore!!
    // this.__proto__.update.call(this, timestamp);
    // this.baseUpdate(timestamp);
};
