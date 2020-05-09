console.log("BTankManager!");

BattleTankGame.deps.const = {
    MAXLIFES: 10,
    MAXSPEED: 0,
    MAXBULLETS: 10,

    COMPUTER: 0,
    USER: 1,

    MAXX: 49,
    MAXY: 35,
    BEGX: 20,
    BEGY: 20,
};
// -------------------------------------
//    TOFIX! bullet dep propagation
// -------------------------------------

// Tanks manager and draw manager
BattleTankGame.deps.BTankManager = function (CONST, csw, bullet, images) {
    // TODO: dependencies in parameters are completely redundant! (CONST, csw, bullet, images)
    // TODO: write the full paths to classes
    this.cswArr = [];
    this.drawContext = null;
    this.infoContext = null;
    this.againBtn = null;
    this.playerImage = null;
    this.cpuImage = null;
    this.crashImage = null;
    this.backgroundImage = null;

    this.CONST = CONST;
    this.csw = csw;
    this.bullet = bullet;
    this.images = images;
    this.baseCoords = new BattleTankGame.deps.baseCoordinates();
};

BattleTankGame.deps.BTankManager.prototype.init = function () {
    const gameField = document.getElementById("gameField");
    gameField.height = this.CONST.MAXY * 20 + 20;
    gameField.width = this.CONST.MAXX * 20 + 20;

    const gameInfo = document.getElementById("gameInfo");

    this.drawContext = gameField.getContext("2d");
    this.infoContext = gameInfo.getContext("2d");
    this.againBtn = document.querySelector("#playAgainBtn");

    this.playerImages = {
        0:   new this.images(this, "images/csw-mt9_0.png"),
        90:  new this.images(this, "images/csw-mt9_90.png"),
        180: new this.images(this, "images/csw-mt9_180.png"),
        270: new this.images(this, "images/csw-mt9_270.png"),
    }
    this.cpuImages = {
        0:   new this.images(this, "images/csw-mt5_0.png"),
        90:  new this.images(this, "images/csw-mt5_90.png"),
        180: new this.images(this, "images/csw-mt5_180.png"),
        270: new this.images(this, "images/csw-mt5_270.png"),
    };
    this.crashImage = new this.images(this, "images/crash.png");
    this.backgroundImage = new this.images(this, "images/1920x1080-nebula2_02.gif");
    //new this.images(this, "images/space_back.jpg");
};

// x, y - coordinates of pixels, not cells
BattleTankGame.deps.BTankManager.prototype.checkCSWWithPixelPrecision = function (
    x,
    y
) {
    const result =
        this.cswArr.filter(function (csw) {
            return (
                x >= csw.x &&
                x <= csw.x + 20 &&
                y >= csw.y &&
                y <= csw.y + 20
            );
        }).length > 0;
    return result.length > 0;
};

BattleTankGame.deps.BTankManager.prototype.checkCSW = function (x, y) {
    const result =
        this.cswArr.filter(function (csw) {
            return csw.x == x && csw.y == y;
        }).length > 0;
    return result.length > 0;
};

// Returns CSW on coords in params (by pixel)
BattleTankGame.deps.BTankManager.prototype.getCSWWithPixelPrecision = function (
    x,
    y
) {
    const tArr = this.cswArr.filter(function (csw) {
        return (
            x >= csw.x &&
            x <= csw.x + 20 &&
            y >= csw.y &&
            y <= csw.y + 20
        );
    });

    return tArr.length ? tArr[0] : null;
};

BattleTankGame.deps.BTankManager.prototype.getVXVYBeforeCollision = function (newx, newy, vx, vy) {
    /*
        should return new vx and vy
        if there is a CSW on newx, newy then check if (abs(CSW.x) - abs(newx)) === vx
        (same for y) and return the (abs(CSW.x) - abs(newx)) as vx
        if (abs(CSW.x) - abs(newx)) === 0
        then return vx = 0
    */
}

// Returns CSW on coords in params (by cell)
BattleTankGame.deps.BTankManager.prototype.getCSW = function (x1, y1) {
    const tArr = this.cswArr.filter(function (c) {
        return c.x == x1 && c.y == y1;
    });

    return tArr.length ? tArr[0] : null;
};

BattleTankGame.deps.BTankManager.prototype.createCSW = function (
    x,
    y,
    who,
    num
) {
    const c1 = new this.csw(this.CONST, this.bullet);
    c1.init(x, y, who, num, this);
    this.cswArr.push(c1);
    return c1;
};

BattleTankGame.deps.BTankManager.prototype.deleteCSW = function (x, y) {
    let ca = 0;
    while (1) {
        if (this.cswArr[ca].x == x && this.cswArr[ca].y == y) {
            this.cswArr.splice(ca, 1);
            break;
        }
        ca++;
        if (ca == this.cswArr.length) {
            break;
        }
    }
};

BattleTankGame.deps.BTankManager.prototype.destroyAll = function () {
    this.cswArr = [];
};

// user
BattleTankGame.deps.BTankManager.prototype.drawcswmt9 = function (x, y, d) {
    this.playerImages[this.baseCoords.getVXYAndAngle(d).angle].draw(x, y);
    //this.playerImage.draw(x, y);
};

// cpu
BattleTankGame.deps.BTankManager.prototype.drawcswmt5 = function (x, y, d) {
    this.cpuImages[this.baseCoords.getVXYAndAngle(d).angle].draw(x, y);
    // this.cpuImage.draw(x, y);
};

BattleTankGame.deps.BTankManager.prototype.DrawBlack = function (x, y) {
    this.drawContext.clearRect(x, y, 20, 20);
};

BattleTankGame.deps.BTankManager.prototype.DrawCrash = function (
    x,
    y,
    onDelayEnd
) {
    this.crashImage.draw(x, y, 100, onDelayEnd);
};

BattleTankGame.deps.BTankManager.prototype.DrawGameField = function () {
    this.drawContext.strokeStyle = "#000";
    this.drawContext.strokeRect(0, 0, this.CONST.MAXX * 20 + 20, this.CONST.MAXY * 20 + 20);
};

BattleTankGame.deps.BTankManager.prototype.drawBackground = function () {
    this.backgroundImage.draw(0, 0);
};

BattleTankGame.deps.BTankManager.prototype.showLogo = function () {
    this.infoContext.fillStyle = "lightgreen";
    this.infoContext.strokeStyle = "#F00";
    this.infoContext.font = "30pt Arial";
    this.infoContext.fillText("Battle Tank!", 0, 30);
};

BattleTankGame.deps.BTankManager.prototype.showNames = function () {
    this.infoContext.fillStyle = "gray";
    this.infoContext.strokeStyle = "#F00";
    this.infoContext.font = "20pt Arial";
    this.infoContext.fillText("p1 life:", 0, 60);

    this.infoContext.fillStyle = "gray";
    this.infoContext.strokeStyle = "#F00";
    this.infoContext.font = "20pt Arial";
    this.infoContext.fillText("cpu life:", 0, 90);
};

BattleTankGame.deps.BTankManager.prototype.showGameOver = function (won) {
    if (won) {
        this.drawContext.fillStyle = "#fff";
        this.drawContext.strokeStyle = "#F00";
        this.drawContext.font = "bold 25pt Comic";
        this.drawContext.fillText("YOU WIN", 130, 200);
    } else {
        this.drawContext.fillStyle = "#fff";
        this.drawContext.strokeStyle = "#F00";
        this.drawContext.font = "bold 25pt Comic";
        this.drawContext.fillText("GAME OVER", 100, 200);
    }
    this.againBtn.style.display = "block";
};

BattleTankGame.deps.BTankManager.prototype.displayLifeBar = function (player) {
    const LIFEBARMAXWIDTH = 200;
    const onePercent = player.maxlife / LIFEBARMAXWIDTH;
    if (player.iam) {
        // player
        this.infoContext.fillStyle = "#000";
        this.infoContext.fillRect(100, 40, 200, 20);

        this.infoContext.fillStyle = "#0F0";
        this.infoContext.strokeStyle = "#0F0";
        this.infoContext.strokeRect(100, 40, 200, 20);
        this.infoContext.fillRect(100, 40, Math.ceil(player.life / onePercent), 20);
    } else {
        this.infoContext.fillStyle = "#000";
        this.infoContext.fillRect(100, 70, 200, 20);

        this.infoContext.fillStyle = "#F00";
        this.infoContext.strokeStyle = "#F00";
        this.infoContext.strokeRect(100, 70, 200, 20);
        this.infoContext.fillRect(100, 70, Math.ceil(player.life / onePercent), 20);
    }
};
