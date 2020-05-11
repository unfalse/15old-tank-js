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
        ms: this.Utils.getRandomInt(0, 1) * 1000,
    };
};

BattleTankGame.deps.cswAI_1.prototype.AI_update = function (timestamp) {
    if (this.life > 0) {
        if (this.path && timestamp - this.pathStartTime <= this.path.ms) {
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
    this.update();

    if (this.life > 0) {
        this.fire(timestamp);
    }
};
