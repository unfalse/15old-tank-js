// Bullet that is flying every step per pixel

console.log("bulletPixel!");
// BattleTankGame.deps.bulletPixel = function (CONST, BTankInst) {
BattleTankGame.deps.bulletPixel = class extends BattleTankGame.deps
    .baseCoordinates {
    // BattleTankGame.deps.baseCoordinates.call(this);
    constructor(CONST, BTankInst) {
        super();
        this.bulletNum = -1;
        this.BULLETSPEED = 2;

        this.CONST = CONST;
        this.BTankInst = BTankInst;
    }

    // BattleTankGame.deps.bulletPixel.prototype = Object.create(
    //     BattleTankGame.deps.baseCoordinates.prototype
    // );
    // BattleTankGame.deps.bulletPixel.prototype.constructor =
    //     BattleTankGame.deps.bulletPixel;

    setCoords(nx, ny, nd) {
        const { width, height } = this.parentShip.dimensions[nd];
        let x = 0,
            y = 0;
        switch (nd) {
            case 0: {
                x = nx + width;
                y = ny + height / 2;
                break;
            }
            case 1: {
                x = nx + width / 2;
                y = ny + height + 1;
                break;
            }
            case 2: {
                x = nx - 1;
                y = ny + height / 2;
                break;
            }
            case 3: {
                x = nx + width / 2;
                y = ny - 1;
                break;
            }
            default:
                break;
        }
        this.initCoords(x, y, nd);
    }

    draw() {
        this.BTankInst.drawContext.fillStyle =
            this.parentShip.iam === this.CONST.USER ? "#F00" : "#FF0";
        this.BTankInst.drawContext.fillRect(this.x, this.y, 4, 4);
    }

    erase() {
        this.BTankInst.drawContext.clearRect(this.x, this.y, 4, 4);
    }

    fly() {
        const nvxy = this.getVXY(this.d);
        let vx = nvxy.vx * this.BULLETSPEED;
        let vy = nvxy.vy * this.BULLETSPEED;

        // TODO: дописать
        // Проверка попадания в танк
        if (this.isfire) {
            // TODO: убрать сильную связанность с BTank
            const collidedShips = this.BTankInst.getCSWWithPixelPrecision(
                this.x,
                this.y,
                this.parentShip
            );
            const collidedBullets = this.BTankInst.getBulletWithPixelPrecision(
                this.x,
                this.y,
                this.parentShip
            );
            if (collidedBullets) {
                console.log('bullets collided!');
                this.isfire = false;
                collidedBullets.isfire = false;
            }
            // a bullet can't hurt it's master! :)
            if (collidedShips) {
                if (collidedShips.hitByBullet) {
                    collidedShips.hitByBullet(this);
                }
                // if (curCSW.iam !== this.parentTank.iam) {
                //     curCSW.life--;
                // }
                // curCSW.setCrash();
                this.isfire = false;
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
    }

    init(nx, ny, nd, parentShip, bnum) {
        // starts from a cell near tank
        // this.initCoords(nx + 8, ny + 8, nd);
        this.isfire = false;
        this.parentShip = parentShip;
        this.bulletNum = bnum;
    }
};
