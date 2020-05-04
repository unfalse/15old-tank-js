// Bullet that is flying every step per pixel

console.log("bulletPixel!");
BattleTankGame.deps.bulletPixel = function (CONST, BTankInst) {
    this.bulletNum = -1;
    this.BULLETSPEED = 3;
    this.CONST = CONST;
    this.BTankInst = BTankInst;
};

BattleTankGame.deps.bulletPixel.prototype = BattleTankGame.deps.baseCoordinates;

BattleTankGame.deps.bulletPixel.prototype.setCoords = function (nx, ny, nd) {
    this.initCoords(nx * 20 + 8, ny * 20 + 8, nd);
};

BattleTankGame.deps.bulletPixel.prototype.draw = function () {
    this.BTankInst.drawContext.fillStyle = "#F00";
    this.BTankInst.drawContext.fillRect(this.x, this.y, 4, 4);
};

BattleTankGame.deps.bulletPixel.prototype.erase = function () {
    this.BTankInst.drawContext.clearRect(this.x, this.y, 4, 4);
};

BattleTankGame.deps.bulletPixel.prototype.fly = function () {
    var nvxy = this.getVXY(this.d);
    var vx = nvxy.vx * this.BULLETSPEED;
    var vy = nvxy.vy * this.BULLETSPEED;

    // TODO: дописать
    // Проверка попадания в танк
    if (this.isfire) {
        // TODO: убрать сильную связанность с BTank
        var curCSW = this.BTankInst.getCSWWithPixelPrecision(this.x, this.y);
        // a bullet can't hurt it's master! :)
        if (curCSW && curCSW != this.parentTank) {
            var vx1 = vx;
            var vy1 = vy;
            vx = 0;
            vy = 0;

            if (curCSW.life == 0) {
                vx = vx1;
                vy = vy1;
            } else {
                curCSW.life--;
                // curCSW.erase();
                //BTankInst.DrawCrash(curCSW.x, curCSW.y);
                curCSW.setCrash();
                this.isfire = false;
                //console.log((curCSW.iam?'(1P)':'(CPU)')+'HIT! Life = ', curCSW.life);
            }
        }
    }

    // TODO: добавить поле MaxSpeed в класс bullet и использовать
    // вместо MAXSPEED. Переименовать в StepsToGo
    // Поле speed переименовать в steps
    if (this.isfire) {
        // this.erase();
        this.x = this.x + vx;
        this.y = this.y + vy;
        // console.log("bullet: [num, x, y]", [this.bulletNum, this.x, this.y]);
        this.draw();

        if (this.x > this.CONST.MAXX * 20 + 20 || this.x < 0) {
            this.isfire = false;
        }

        if (this.y > this.CONST.MAXY * 20 + 20 || this.y < 0) {
            this.isfire = false;
        }
    }

    if (!this.isfire) {
        // this.erase();
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
    this.initCoords(nx * 20 + 8, ny * 20 + 8, nd);
    this.isfire = false;
    this.parentTank = parentTank;
    this.bulletNum = bnum;
};
