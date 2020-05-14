// Bullet that is flying every step per pixel

console.log("bulletPixel!");
BattleTankGame.deps.bulletPixel = function (CONST, BTankInst) {
    BattleTankGame.deps.baseCoordinates.call(this);
    this.bulletNum = -1;
    this.BULLETSPEED = 5;

    this.CONST = CONST;
    this.BTankInst = BTankInst;
};

BattleTankGame.deps.bulletPixel.prototype = Object.create(BattleTankGame.deps.baseCoordinates.prototype);
BattleTankGame.deps.bulletPixel.prototype.constructor = BattleTankGame.deps.bulletPixel;

BattleTankGame.deps.bulletPixel.prototype.setCoords = function (nx, ny, nd) {
    const vxy = this.getVXY(nd);
    const { width, height } = this.parentTank.dimensions[nd];
    this.initCoords(
        nx + (vxy.vx * width) + (vxy.vx === 0 ? width/2 : 0),
        ny + (vxy.vy * height)  + (vxy.vy === 0 ? height/2 : 0),
        nd
    );
};

BattleTankGame.deps.bulletPixel.prototype.draw = function () {
    this.BTankInst.drawContext.fillStyle = this.parentTank.iam === this.CONST.USER ? "#F00" : "#FF0";
    this.BTankInst.drawContext.fillRect(this.x, this.y, 4, 4);
};

BattleTankGame.deps.bulletPixel.prototype.erase = function () {
    this.BTankInst.drawContext.clearRect(this.x, this.y, 4, 4);
};

BattleTankGame.deps.bulletPixel.prototype.fly = function () {
    const nvxy = this.getVXY(this.d);
    let vx = nvxy.vx * this.BULLETSPEED;
    let vy = nvxy.vy * this.BULLETSPEED;

    // TODO: дописать
    // Проверка попадания в танк
    if (this.isfire) {
        // TODO: убрать сильную связанность с BTank
        const curCSW = this.BTankInst.getCSWWithPixelPrecision(this.x, this.y);
        // a bullet can't hurt it's master! :)
        if (curCSW && curCSW != this.parentTank) {
            const vx1 = vx;
            const vy1 = vy;
            vx = 0;
            vy = 0;

            if (curCSW.life == 0) {
                vx = vx1;
                vy = vy1;
            } else {
                if (curCSW.iam !== this.parentTank.iam) {
                    curCSW.life--;
                }
                // curCSW.setCrash();
                this.isfire = false;
            }
        }
    }

    // TODO: добавить поле MaxSpeed в класс bullet и использовать
    // вместо MAXSPEED. Переименовать в StepsToGo
    // Поле speed переименовать в steps
    if (this.isfire) {
        this.x = this.x + vx;
        this.y = this.y + vy;
        this.draw();

        if (this.x > this.CONST.MAXX * 20 || this.x < 0) {
            this.isfire = false;
        }

        if (this.y > this.CONST.MAXY * 20 || this.y < 0) {
            this.isfire = false;
        }
    }
};

BattleTankGame.deps.bulletPixel.prototype.init = function (
    nx,
    ny,
    nd,
    parentTank,
    bnum
) {
    // starts from a cell near tank
    // this.initCoords(nx + 8, ny + 8, nd);
    this.isfire = false;
    this.parentTank = parentTank;
    this.bulletNum = bnum;
};
