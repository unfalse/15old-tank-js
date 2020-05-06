console.log("csw!");

// TODO: csw: cosmo ship war, the old title
// TODO: rename csw to something more understandable - tank?
BattleTankGame.deps.csw = function (CONST, bullet) {
    BattleTankGame.deps.baseCoordinates.call(this);
    this.lastBulletTimeStamp = 0;
    this.bulletsArray = [];
    this.CSWSPEED = 4;

    this.CONST = CONST;
    this.bullet = bullet;
    this.BTankInst = null;
};

BattleTankGame.deps.csw.prototype = Object.create(BattleTankGame.deps.baseCoordinates.prototype);
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
    this.pow = 5;
    this.iam = who;
    this.maxlife = this.iam === this.CONST.USER ? this.CONST.MAXLIFES * 10 : this.CONST.MAXLIFES * 50;
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
    if (timestamp - this.lastBulletTimeStamp >= 100) {
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

// TODO: remove this function and use only update
BattleTankGame.deps.csw.prototype.move = function (direction) {
    const nvxy = this.getVXY(direction);
    let ux = nvxy.vx * this.CSWSPEED;
    let uy = nvxy.vy * this.CSWSPEED;
    this.d = direction;

    if (this.x + ux > this.CONST.MAXX*20 || this.x + ux < 0) {
        ux = 0;
    }

    if (this.y + uy > this.CONST.MAXY*20 || this.y + uy < 0) {
        uy = 0;
    }

    if (ux != 0 || uy != 0) {
        if (this.BTankInst.getCSW(this.x + ux, this.y + uy)) {
            ux = 0;
            uy = 0;
        }
    }

    this.x = this.x + ux;
    this.y = this.y + uy;
    this.draw();
};

BattleTankGame.deps.csw.prototype.update = function (direction, isMoving) {
    let ux = 0;
    let uy = 0;


    this.updateBullets();

    if (this.iam === this.CONST.COMPUTER) {
        // if (this.speed < this.CONST.MAXSPEED) {
        //     this.speed++;
        //     makeMove = false;
        // } else {
        //     makeMove = true;
        // }

        // if (makeMove) {
            // this.speed = 0;
            if (isMoving) {
                const nvxy = this.getVXY(direction);
                ux = nvxy.vx * this.CSWSPEED;
                uy = nvxy.vy * this.CSWSPEED;

                if (this.x + ux > this.CONST.MAXX*20 || this.x + ux < 0) {
                    ux = 0;
                }

                if (this.y + uy > this.CONST.MAXY*20 || this.y + uy < 0) {
                    uy = 0;
                }

                if (ux != 0 || uy != 0) {
                    if (this.BTankInst.getCSW(this.x + ux, this.y + uy)) {
                        ux = 0;
                        uy = 0;
                    }
                }

                this.x = this.x + ux;
                this.y = this.y + uy;

                this.draw();
                this.d = direction;
                isMoving = false;
            }
        // }
    }
    this.draw();
};