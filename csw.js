console.log("csw!");

// TODO: csw: cosmo ship war, the old title
// TODO: rename csw to something more understandable - tank?
// TODO: maybe the CPU and player should have separate classes? And several base classes.
BattleTankGame.deps.csw = function (CONST, bullet) {
    BattleTankGame.deps.baseCoordinates.call(this);
    this.lastBulletTimeStamp = 0;
    this.bulletsArray = [];
    // this.CSWSPEED = 4;
    this.CSWSPEED = 0;
    // this.accel = 0;
    this.inertiaDirections = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
    };
    this.inertiaTimerIsRunning = false;
    this.d = 0; // direction
    this.stopAccel = true;
    this.PLAYER_BULLETS_INTERVAL = 1500;
    this.MAXIMUM_ACCELERATION = 1;

    this.CONST = CONST;
    this.bullet = bullet;
    this.BTankInst = null;
    this.Utils = BattleTankGame.deps.utils;
};

BattleTankGame.deps.csw.prototype = Object.create(
    BattleTankGame.deps.baseCoordinates.prototype
);
BattleTankGame.deps.csw.prototype.constructor = BattleTankGame.deps.csw;

// TODO: place code from init above!
BattleTankGame.deps.csw.prototype.init = function (
    mx,
    my,
    who,
    num,
    BTankInst
) {
    this.initCoords(mx, my, 0);
    this.iam = who;
    this.maxlife =
        this.iam === this.CONST.USER
            ? this.CONST.MAXLIFES * 10
            : 5;
    this.life = this.maxlife;
    this.speed = 0; // make speed more precise
    this.n = num;
    this.crashed = false;
    this.bulletsCount = 0;

    this.BTankInst = BTankInst;

    for (let bc = 0; bc < this.CONST.MAXBULLETS; bc++) {
        const newBullet = new this.bullet(this.CONST, this.BTankInst);
        newBullet.init(mx, my, 0, this, bc);
        this.bulletsArray.push(newBullet);
    }
};

BattleTankGame.deps.csw.prototype.setCrash = function () {
    this.crashed = true;
};

BattleTankGame.deps.csw.prototype.setAccel = function (value) {
    this.accel = value;
};

BattleTankGame.deps.csw.prototype.addAccel = function (value) {
    this.accel += value;
};

BattleTankGame.deps.csw.prototype.getAccel = function () {
    return this.accel;
};

BattleTankGame.deps.csw.prototype.draw = function () {
    if (this.crashed) {
        this.BTankInst.DrawCrash(
            this.x,
            this.y,
            function () {
                this.crashed = false;
            }.bind(this)
        );
    } else {
        if (this.iam === this.CONST.USER) {
            this.BTankInst.drawcswmt9(this.x, this.y, this.d);
        } else {
            this.BTankInst.drawcswmt5(this.x, this.y, this.d);
        }
    }
};

BattleTankGame.deps.csw.prototype.erase = function () {
    this.BTankInst.DrawBlack(this.x, this.y);
};

BattleTankGame.deps.csw.prototype.createNewBullet = function (
    startX,
    startY,
    startD
) {
    const freeBullet = this.bulletsArray.find((b) => !b.isfire);

    if (freeBullet) {
        freeBullet.setCoords(startX, startY, startD);
        freeBullet.isfire = true;
    }
};

BattleTankGame.deps.csw.prototype.fire = function (timestamp) {
    // if (this.life <= 0) {
    //     return;
    // }
    if (this.iam === this.CONST.COMPUTER) {
        if (this.fireStartTime === -1) {
            this.fireStartTime = timestamp;
        }
        if ((timestamp - this.fireStartTime) >= 1000) {
            this.fireStartTime = timestamp;
            this.createNewBullet(this.x, this.y, this.d);
        }
    }
    if ((timestamp - this.lastBulletTimeStamp >= this.PLAYER_BULLETS_INTERVAL) && this.iam === this.CONST.USER) {
        this.lastBulletTimeStamp = timestamp;
        this.createNewBullet(this.x, this.y, this.d);
    }
};

BattleTankGame.deps.csw.prototype.updateBullets = function () {
    this.bulletsArray.forEach((b) => {
        if (b.isfire) {
            b.fly();
        }
    });
};

BattleTankGame.deps.csw.prototype.move = function (direction) {
    const nvxy = this.getVXY(direction);
    const acceleration = this.CSWSPEED + this.inertiaDirections[direction];

    let ux = nvxy.vx * acceleration;
    let uy = nvxy.vy * acceleration;

    if (this.x + ux > this.CONST.MAXX * 20 || this.x + ux < 0) {
        ux = 0;
        this.inertiaDirections[direction] = 0;
    }

    if (this.y + uy > this.CONST.MAXY * 20 || this.y + uy < 0) {
        uy = 0;
        this.inertiaDirections[direction] = 0;
    }

    if (ux != 0 || uy != 0) {
        if (this.BTankInst.getCSW(this.x + ux, this.y + uy)) {
            ux = 0;
            uy = 0;
        }
    }

    this.x = this.x + ux;
    this.y = this.y + uy;
    // this.draw();
};

// TODO: maybe move acceleration, direction and inertia control functions into the separate class
BattleTankGame.deps.csw.prototype.setDirectionAndAddAccel = function (d, accel) {
    this.d = d;

    if (this.inertiaDirections[this.CONST.DIR_OPPOSITES[d]] > 0) {
        this.inertiaDirections[this.CONST.DIR_OPPOSITES[d]] -= accel;
        if (this.inertiaDirections[this.CONST.DIR_OPPOSITES[d]] < 0) {
            this.inertiaDirections[this.CONST.DIR_OPPOSITES[d]] = 0;
        }
    } else {
        if ((this.inertiaDirections[d] + accel) > this.MAXIMUM_ACCELERATION) {
            return;
        }
        this.inertiaDirections[d] += accel;
    }

    // this.inertiaDirections[d] += accel;
};

BattleTankGame.deps.csw.prototype.setInertiaValue = function (d, v) {
    this.inertiaDirections[d] = v;
}

BattleTankGame.deps.csw.prototype.setDirectionAndAccel = function (d, accel, ms) {
    const humanDir = (d) => {
        switch(d) {
            case 0: return 'right';
            case 1: return 'down';
            case 2: return 'left';
            case 3: return 'up';
        }
    }
    console.log(humanDir(d), ', ', accel, ', ', ms);
    this.d = d;
    this.inertiaDirections[d] = accel;
};

BattleTankGame.deps.csw.prototype.getDirSum = function () {
    return (
        this.inertiaDirections[0] +
        this.inertiaDirections[1] +
        this.inertiaDirections[2] +
        this.inertiaDirections[3]
    );
};

BattleTankGame.deps.csw.prototype.inertia = function () {
    if (this.getDirSum() > 0 && this.stopAccel) {
        // TODO: WHERE TO PUT DECREASING AND INCREASING OF ACCELERATION ?
        // maybe use stopAccel from the main.js !!!
        // this way the momentum will be the same every time till zero acceleration
        // stopAccel should be for every direction! Then inertia will stop fade only for directions which are not accelerated at the moment
        for (let d = 0; d < 4; d++) {
            if (this.inertiaDirections[d] > 0) {
                // this.inertiaDirections[d] -= 0.1;
            } else {
                this.inertiaDirections[d] = 0;
            }

            this.move(d);
        }
        this.draw();
        setTimeout(this.inertia.bind(this), 10);
    } else {
        this.inertiaTimerIsRunning = false;
    }
};

BattleTankGame.deps.csw.prototype.inertiaStartAttempt = function () {
    if (this.getDirSum() > 0 && !this.inertiaTimerIsRunning && this.stopAccel) {
        this.inertiaTimerIsRunning = true;
        setTimeout(this.inertia.bind(this), 10);
    }
};

BattleTankGame.deps.csw.prototype.update = function () {

    this.updateBullets();
    this.inertiaStartAttempt();

    if (!this.stopAccel) {
        for (let d = 0; d < 4; d++) {
            this.move(d);
        }
    }

    if (this.iam === this.CONST.COMPUTER && this.life > 0) {
        this.draw();
    }

    if (this.iam === this.CONST.USER) {
        this.draw();
    }
};
