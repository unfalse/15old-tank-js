// Bullet that is flying every step per cell

console.log("bullet!");
BattleTankGame.deps.bullet = function (CONST, BTankInst) {
    this.steps = 0;
    this.STEPSTOMOVE = 0;

    this.CONST = CONST;
    this.BTankInst = BTankInst;
};

BattleTankGame.deps.bullet.prototype.init = function (nx, ny, nd, parentTank) {
    this.initCoords(nx, ny, nd);
    this.isfire = false;
    this.parentTank = parentTank;
};

BattleTankGame.deps.bullet.prototype.setCoords = function (nx, ny, nd) {
    this.initCoords(nx, ny, nd);
};

BattleTankGame.deps.bullet.prototype.draw = function () {
    this.BTankInst.drawContext.fillRect(this.x * 20 + 8, this.y * 20 + 8, 4, 4);
};

BattleTankGame.deps.bullet.prototype.erase = function () {
    this.BTankInst.drawContext.clearRect(
        this.x * 20 + 8,
        this.y * 20 + 8,
        4,
        4
    );
};

BattleTankGame.deps.bullet.prototype.fly = function () {
    const nvxy = this.getVXY(this.d);
    let vx = nvxy.vx;
    let vy = nvxy.vy;
    let makeMove = false;

    // TODO: дописать
    // Проверка попадания в танк
    if (this.isfire) {
        // TODO: убрать сильную связанность с BTank
        const curCSW = BTankInst.getCSW(this.x, this.y);
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
                curCSW.life--;
                curCSW.setCrash();
                this.isfire = false;
            }
        }
    }

    // TODO: добавить поле MaxSpeed в класс bullet и использовать
    // вместо MAXSPEED. Переименовать в StepsToGo
    // Поле speed переименовать в steps
    if (this.steps < this.STEPSTOMOVE) {
        this.steps++;
        makeMove = false;
    } else {
        makeMove = true;
    }

    if (this.isfire && makeMove) {
        this.steps = 0;;
        this.x = this.x + vx;
        this.y = this.y + vy;

        if (this.x > CONST.MAXX || this.x < 0) {
            this.isfire = false;
        }

        if (this.y > CONST.MAXY || this.y < 0) {
            this.isfire = false;
        }
    }

    if (this.isfire) {
        this.draw();
    }
};
BattleTankGame.deps.bullet.prototype = BattleTankGame.deps.baseCoordinates;
