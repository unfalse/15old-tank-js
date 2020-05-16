console.log("BTankManager!");

BattleTankGame.deps.const = {
    MAXLIFES: 10,
    MAXSPEED: 0,
    MAXBULLETS: 10,

    COMPUTER: 0,
    USER: 1,

    MAXX: 50,
    MAXY: 36,
    BEGX: 20,
    BEGY: 20,

    RIGHT: 0,
    DOWN: 1,
    LEFT: 2,
    UP: 3,

    DIR_OPPOSITES: {
        0: 2,
        1: 3,
        2: 0,
        3: 1,
    },
};
// -------------------------------------
//    TOFIX! bullet dep propagation
// -------------------------------------

// Tanks manager and draw manager
BattleTankGame.deps.BTankManager = function (
    CONST,
    csw,
    cswAI,
    bullet,
    images
) {
    // TODO: dependencies in parameters are completely redundant! (CONST, csw, bullet, images)
    // TODO: write the full paths to classes
    this.cswArr = [];
    this.drawContext = null;
    this.infoContext = null;
    this.againBtn = null;
    this.playerImage = null;
    this.crashImage = null;
    this.backgroundImage = null;

    this.CONST = CONST;
    this.csw = csw;
    this.cswAI = cswAI;
    this.bullet = bullet;
    this.images = images;
    this.baseCoords = new BattleTankGame.deps.baseCoordinates();
};

BattleTankGame.deps.BTankManager.prototype.init = function () {
    const gameField = document.getElementById("gameField");
    gameField.height = this.CONST.MAXY * 20;
    gameField.width = this.CONST.MAXX * 20;

    const gameInfo = document.getElementById("gameInfo");

    this.drawContext = gameField.getContext("2d");
    this.infoContext = gameInfo.getContext("2d");
    this.againBtn = document.querySelector("#playAgainBtn");

    const loadImage = function (imagePath, onLoad) {
        return new Promise(
            function (resolve) {
                onLoad.call(
                    this,
                    new this.images(this, imagePath, function () {
                        resolve();
                    })
                );
            }.bind(this)
        );
    };
    this.playerImages = {};
    this.cpuImages = {};
    this.crashImage = null;
    this.backgroundImage = null;

    const promises = [
        loadImage.call(this, "images/csw-mt9bigger2x_0.png", function (image) {
            this.playerImages[3] = image;
        }),
        loadImage.call(this, "images/csw-mt9bigger2x_90.png", function (image) {
            this.playerImages[0] = image;
        }),
        loadImage.call(this, "images/csw-mt9bigger2x_180.png", function (
            image
        ) {
            this.playerImages[1] = image;
        }),
        loadImage.call(this, "images/csw-mt9bigger2x_270.png", function (
            image
        ) {
            this.playerImages[2] = image;
        }),

        loadImage.call(this, "images/csw-mt5bigger2x_0.png", function (image) {
            this.cpuImages[3] = image;
        }),
        loadImage.call(this, "images/csw-mt5bigger2x_90.png", function (image) {
            this.cpuImages[0] = image;
        }),
        loadImage.call(this, "images/csw-mt5bigger2x_180.png", function (
            image
        ) {
            this.cpuImages[1] = image;
        }),
        loadImage.call(this, "images/csw-mt5bigger2x_270.png", function (
            image
        ) {
            this.cpuImages[2] = image;
        }),

        loadImage.call(this, "images/crash.png", function (image) {
            this.crashImage = image;
        }),

        loadImage.call(this, "images/1920x1080-nebula2_02.gif", function (
            image
        ) {
            this.backgroundImage = image;
        }),
    ];
    return Promise.all(promises);
};

// x, y - coordinates of pixels, not cells
BattleTankGame.deps.BTankManager.prototype.checkCSWWithPixelPrecision = function (
    x,
    y,
    whoAsks
) {
    const result = this.cswArr.filter(function (csw) {
        // console.log(whoAsks === csw);
        if (whoAsks === csw) {
            return false;
        }
        const { width, height } = csw.dimensions[csw.d];
        return (
            x >= csw.x &&
            x <= csw.x + width &&
            y >= csw.y &&
            y <= csw.y + height
        );
    });
    return result.length > 0;
};

BattleTankGame.deps.BTankManager.prototype.getShipDimensions = function (
    direction,
    iam
) {
    const image =
        iam === this.CONST.COMPUTER
            ? this.cpuImages[direction].image
            : this.playerImages[direction].image;
    return {
        width: image.width,
        height: image.height,
    };
};

BattleTankGame.deps.BTankManager.prototype.checkCSW = function (x, y) {
    const result =
        this.cswArr.filter(function (csw) {
            return csw.x == x && csw.y == y;
        }).length > 0;
    return result.length > 0;
};

BattleTankGame.deps.BTankManager.prototype.checkIfTwoShipsCross = function (
    nx,
    ny,
    whoAsks
) {
    // const debugDraw = (function(x,y,w,h) {
    //     this.drawContext.strokeStyle = "#0f0";
    //     this.drawContext.strokeRect(x, y, w, h);
    // }).bind(this);

    const checkSquare = function (csw, x, y) {
        const { width, height } = csw.dimensions[csw.d];
        // debugDraw(csw.x, csw.y, width, height);
        
        return (
            x >= csw.x &&
            x <= csw.x + width &&
            y >= csw.y &&
            y <= csw.y + height
        );
    };

    const { width, height } = whoAsks.dimensions[whoAsks.d];

    const tArr = this.cswArr.filter(function (csw) {
        if (whoAsks === csw) {
            return false;
        }

        const checkResult =
            checkSquare(csw, nx, ny) ||
            checkSquare(csw, nx + width, ny) ||
            checkSquare(csw, nx, ny + height) ||
            checkSquare(csw, nx + width, ny + height) ||

            checkSquare(csw, nx + width/2, ny) ||
            checkSquare(csw, nx, ny + height/2) ||
            checkSquare(csw, nx + width, ny + height/2) ||
            checkSquare(csw, nx + width/2, ny + height);
        return checkResult;
    });

    return tArr.length > 0 ? tArr[0] : null;
};

// Returns CSW on coords in params (by pixel)
BattleTankGame.deps.BTankManager.prototype.getCSWWithPixelPrecision = function (
    x,
    y,
    whoAsks
) {
    const tArr = this.cswArr.filter(function (csw) {
        if (whoAsks === csw) {
            return false;
        }
        const { width, height } = csw.dimensions[csw.d];
        return (
            x >= csw.x &&
            x <= csw.x + width &&
            y >= csw.y &&
            y <= csw.y + height
        );
    });

    return tArr.length ? tArr[0] : null;
};

// TODO: is it good that BTankManager knows which fields CSW class contains ?
BattleTankGame.deps.BTankManager.prototype.createCSW = function (
    x,
    y,
    who,
    num
) {
    const c1 =
        who === this.CONST.USER
            ? new this.csw(this.CONST, this.bullet)
            : new this.cswAI(this.CONST, this.bullet);
    c1.init(x, y, who, num, this);
    this.cswArr.push(c1);
    return c1;
};

BattleTankGame.deps.BTankManager.prototype.getCPUs = function () {
    return this.cswArr.filter(function (c) {
        return c.iam === c.CONST.COMPUTER;
    });
};

BattleTankGame.deps.BTankManager.prototype.removeShip = function (ship) {
    let ca = 0;
    while (1) {
        if (this.cswArr[ca] === ship) {
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
    this.playerImages[d].draw(x, y);
    //this.playerImage.draw(x, y);
};

// cpu
BattleTankGame.deps.BTankManager.prototype.drawcswmt5 = function (x, y, d) {
    this.cpuImages[d].draw(x, y);
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
    // this.crashImage.draw(x, y, 0, onDelayEnd);
};

BattleTankGame.deps.BTankManager.prototype.DrawGameField = function () {
    this.drawContext.strokeStyle = "#000";
    this.drawContext.strokeRect(
        0,
        0,
        this.CONST.MAXX * 20,
        this.CONST.MAXY * 20
    );
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
        this.infoContext.fillRect(
            100,
            40,
            Math.ceil(player.life / onePercent),
            20
        );
    } else {
        this.infoContext.fillStyle = "#000";
        this.infoContext.fillRect(100, 70, 200, 20);

        this.infoContext.fillStyle = "#F00";
        this.infoContext.strokeStyle = "#F00";
        this.infoContext.strokeRect(100, 70, 200, 20);
        this.infoContext.fillRect(
            100,
            70,
            Math.ceil(player.life / onePercent),
            20
        );
    }
};
