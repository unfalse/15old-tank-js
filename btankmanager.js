console.log("BTankManager!");

// TODO: check before actual draw if object is within the visible region

BattleTankGame.deps.const = {
    MAXLIFES: 10,
    MAXSPEED: 0,
    MAXBULLETS: 10,

    COMPUTER: 0,
    USER: 1,
    TYPES: {
        ERASER: -1,
        SHIP: 0,
        OBSTACLE: 1,
        SPACEBRICK: 2,
        COUNTER: 3,
        BORDER: 4,
    },

    CELLSIZES: {
        MAXX: 40,
        MAXY: 40,
    },

    SCALE: {
        X: 1,
        Y: 1
    },

    MAXX: 100,
    MAXY: 100,
    SCREENMAXX: 25,
    SCREENMAXY: 18,

    CAM: {
        CENTERX: 500,
        CENTERY: 360,
    },

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
// BattleTankGame.deps.BTankManager = function (
BattleTankGame.deps.BTankManager = class {
    constructor(
        CONST,
        csw,
        player,
        cswAI,
        obstacle,
        staticShip,
        spaceBrick,
        bullet,
        counter,
        camera,
        border,
        images,
        delayedPic
    ) {
        // TODO: dependencies in parameters are completely redundant! (CONST, csw, bullet, images)
        // TODO: write the full paths to classes
        this.cswArr = [];
        this.ghosts = [];
        this.bulletsArr = [];
        this.delayedPics = [];
        this.drawContext = null;
        this.infoContext = null;
        this.againBtn = null;
        this.gameOverBlock = null;
        this.crashImage = null;
        this.backgroundImage = null;
        this.counterImage = null;

        this.CONST = CONST;
        this.player = player;
        this.cswAI = cswAI;
        this.obstacle = obstacle;
        this.spaceBrick = spaceBrick;
        this.bullet = bullet;
        this.counter = counter;
        this.camera = camera;
        this.border = border;
        this.images = images;
        this.delayedPic = delayedPic;
    }

    init() {
        const gameField = document.getElementById("gameField");
        // TODO: change 20 to CELLSIZES !!
        gameField.height = this.CONST.SCREENMAXY * this.CONST.CELLSIZES.MAXY;
        gameField.width = this.CONST.SCREENMAXX * this.CONST.CELLSIZES.MAXX;

        // TODO: create new ui class and move these things to it
        this.gameInfo = document.getElementById("gameInfo");
        this.againBtn = document.querySelector("#playAgainBtn");
        this.gameOverBlock = document.querySelector("#gameOverBlock");
        this.titleBlock = document.querySelector("#titleBlock");
        this.gameFieldBlock = gameField;

        this.drawContext = gameField.getContext("2d");
        this.infoContext = this.gameInfo.getContext("2d");

        // TODO: make separate editor class?
        // current object chosen to place on the map
        this.playerImages = {};
        this.cpuImages = {};
        this.crashImage = null;
        this.backgroundImage = null;
        this.obstacleImage = null;
        this.borderImage = null;
        this.spaceBrickImages = [];
        this.counterImage = [];
        this.gameCam = new this.camera(this.CONST, this);

        const loadImage = this.images.loadImage;

        // TODO: it should be a function which will preload images.
        // First it should collect paths to images from classes (csw, cswai, obstacle, etc.)
        // Every class will have a variable with image. Now it can only call the "draw" function.
        // Image field should be in csw class. This way player should have a separate class.
        const promises = [
            loadImage.call(this, "images/csw-mt9bigger2x_0.png", function (
                image
            ) {
                this.playerImages[3] = image;
            }),
            loadImage.call(this, "images/csw-mt9bigger2x_90.png", function (
                image
            ) {
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

            loadImage.call(this, "images/csw-mt5bigger2x_0.png", function (
                image
            ) {
                this.cpuImages[3] = image;
            }),
            loadImage.call(this, "images/csw-mt5bigger2x_90.png", function (
                image
            ) {
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

            loadImage.call(this, "images/background.png", function (image) {
                this.backgroundImage = image;
            }),

            loadImage.call(this, "images/obstacle2.png", function (image) {
                this.obstacleImage = image;
            }),

            loadImage.call(this, "images/space_brick-0.png", function (image) {
                this.spaceBrickImages[4] = image;
            }),

            loadImage.call(this, "images/space_brick-1.png", function (image) {
                this.spaceBrickImages[3] = image;
            }),

            loadImage.call(this, "images/space_brick-2.png", function (image) {
                this.spaceBrickImages[2] = image;
            }),

            loadImage.call(this, "images/space_brick-3.png", function (image) {
                this.spaceBrickImages[1] = image;
            }),

            loadImage.call(this, "images/space_brick-4.png", function (image) {
                this.spaceBrickImages[0] = image;
            }),

            loadImage.call(this, "images/border.png", function (image) {
                this.borderImage = image;
            }),

            loadImage.call(this, "images/counter-0.png", function (image) {
                this.counterImage[0] = image;
            }),

            loadImage.call(this, "images/counter-1.png", function (image) {
                this.counterImage[1] = image;
            }),

            loadImage.call(this, "images/counter-2.png", function (image) {
                this.counterImage[2] = image;
            }),

            loadImage.call(this, "images/counter-3.png", function (image) {
                this.counterImage[3] = image;
            }),

            loadImage.call(this, "images/counter-4.png", function (image) {
                this.counterImage[4] = image;
            }),

            loadImage.call(this, "images/counter-5.png", function (image) {
                this.counterImage[5] = image;
            }),

            loadImage.call(this, "images/counter-6.png", function (image) {
                this.counterImage[6] = image;
            }),

            loadImage.call(this, "images/counter-7.png", function (image) {
                this.counterImage[7] = image;
            }),

            loadImage.call(this, "images/counter-8.png", function (image) {
                this.counterImage[8] = image;
            }),
            loadImage.call(this, "images/counter-9.png", function (image) {
                this.counterImage[9] = image;
            }),
        ];
        return Promise.all(promises);
    }

    placeBorders() {
        for (var x = 0; x < this.CONST.MAXX + 2; x++) {
            this.createCSW(
                (x - 1) * this.CONST.CELLSIZES.MAXX,
                -1 * this.CONST.CELLSIZES.MAXY,
                this.CONST.COMPUTER,
                0,
                this.CONST.TYPES.OBSTACLE,
                true
            );
            this.createCSW(
                (x - 1) * this.CONST.CELLSIZES.MAXX,
                this.CONST.MAXY * this.CONST.CELLSIZES.MAXY,
                this.CONST.COMPUTER,
                0,
                this.CONST.TYPES.OBSTACLE,
                true
            );
        }

        for (var y = 0; y < this.CONST.MAXY + 1; y++) {
            this.createCSW(
                -1 * this.CONST.CELLSIZES.MAXX,
                (y - 1) * this.CONST.CELLSIZES.MAXY,
                this.CONST.COMPUTER,
                0,
                this.CONST.TYPES.OBSTACLE,
                true
            );
            this.createCSW(
                this.CONST.MAXX * this.CONST.CELLSIZES.MAXX,
                (y - 1) * this.CONST.CELLSIZES.MAXY,
                this.CONST.COMPUTER,
                0,
                this.CONST.TYPES.OBSTACLE,
                true
            );
        }
    }

    pushNewObject(obj, ghost) {
        if (ghost) {
            this.ghosts.push(obj);
        } else {
            this.cswArr.push(obj);
        }
    }

    getGameCam() {
        return this.gameCam;
    }

    // TODO: is it good that BTankManager knows which fields CSW class contains ?
    createCSW(
        x,
        y,
        who, // TODO: this field should be in ship class (csw or cswai or obstacle)
        delay,
        typeParam,
        ghost
    ) {
        let c1 = null;
        const type = typeParam || this.CONST.TYPES.SHIP;
        if (who === this.CONST.USER) {
            c1 = new this.player(this.CONST, this.bullet);
            c1.init(x, y, who, this);
            this.pushNewObject(c1, ghost);
            return c1;
        } else if (who === this.CONST.COMPUTER) {
            // TODO: make delayed parameter as a field in class so BTankManager should decide from this field how to create new instance
            setTimeout(
                function () {
                    // this code should be extendable
                    // TODO: implement some pattern to not write thousands if-s
                    if (type === this.CONST.TYPES.SHIP) {
                        c1 = new this.cswAI(this.CONST, this.bullet);
                        c1.init(x, y, who, this);
                        this.pushNewObject(c1, ghost);
                    }
                }.bind(this),
                delay
            );

            if (type === this.CONST.TYPES.OBSTACLE) {
                c1 = new this.obstacle(this.CONST, this.bullet);
                c1.init(x, y, who, this);
                this.pushNewObject(c1, ghost);
            }

            if (type === this.CONST.TYPES.SPACEBRICK) {
                c1 = new this.spaceBrick(this.CONST, this.bullet);
                c1.init(x, y, who, this);
                this.pushNewObject(c1, ghost);
            }

            if (type === this.CONST.TYPES.COUNTER) {
                c1 = new this.counter(this.CONST, this);
                c1.init(x, y, who, this);
                this.pushNewObject(c1);
            }
        }
    }

    // x, y - coordinates of pixels, not cells
    checkCSWWithPixelPrecision(x, y, whoAsks) {
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
    }

    getShipDimensions(direction, iam, type) {
        const image =
            iam === this.CONST.COMPUTER
                ? this.cpuImages[direction].image
                : this.playerImages[direction].image;
        // TODO: remove this little hack
        // if (type === this.CONST.TYPES.OBSTACLE) {
        //     image.width = 30;
        //     image.height = 30;
        // }
        return {
            width: this.CONST.CELLSIZES.MAXX, // image.width,
            height: this.CONST.CELLSIZES.MAXY // image.height,
        };
    }

    checkIfTwoShipsCross(nx, ny, whoAsks, typeToCheckParam) {
        // const debugDraw = (function(x,y,w,h) {
        //     this.drawContext.strokeStyle = "#0f0";
        //     this.drawContext.strokeRect(x, y, w, h);
        // }).bind(this);
        // const typeToCheck = typeToCheckParam || this.CONST.TYPES.SHIP;

        const checkSquare = function (csw, x, y) {
            let { width, height } = csw.dimensions[csw.d];
            width--;
            height--;
            // debugDraw(csw.x, csw.y, width, height);

            return (
                x >= csw.x &&
                x <= csw.x + width &&
                y >= csw.y &&
                y <= csw.y + height
            );
        };

        let { width, height } = whoAsks.dimensions[whoAsks.d];
        width--;
        height--;

        const tArr = this.cswArr.filter(function (csw) {
            if (whoAsks === csw) {
                return false;
            }

            const checkResult = checkSquare(csw, nx, ny) ||
                checkSquare(csw, nx + width, ny) ||
                checkSquare(csw, nx, ny + height) ||
                checkSquare(csw, nx + width, ny + height) ||
                checkSquare(csw, nx + width / 2, ny) ||
                checkSquare(csw, nx, ny + height / 2) ||
                checkSquare(csw, nx + width, ny + height / 2) ||
                checkSquare(csw, nx + width / 2, ny + height);
            return checkResult;
        }, this);

        return tArr.length > 0 ? tArr[0] : null;
    }

    getBulletWithPixelPrecision(x, y, parentShip, bulletInst) {
        const tArr = this.bulletsArr.filter(function (b) {
            return (
                b.parentShip !== parentShip &&
                b !== bulletInst &&
                x >= b.x &&
                x <= b.x + 4 &&
                y >= b.y &&
                y <= b.y + 4
            );
        });
        return tArr.length ? tArr[0] : null;
    }

    // Returns CSW on coords in params (by pixel)
    getCSWWithPixelPrecision(x, y, whoAsks) {
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
    }

    getAllGhosts() {
        return this.ghosts;
    }

    getAllShips() {
        return this.cswArr;
    }

    getAllBullets() {
        return this.bulletsArr;
    }

    addShip(ship) {
        this.cswArr.push(ship);
    }

    createDelayedPic(x, y) {
        const dp = new this.delayedPic(this.CONST);
        const relXY = this.gameCam.getRelCoords(x, y);
        dp.init(relXY.x, relXY.y, this);
        this.delayedPics.push(dp);
    }

    removeDelayedPic(dpObj) {
        this.delayedPics = this.delayedPics.filter(function (dp) {
            return dp !== dpObj;
        });
    }

    getAllDelayedPics() {
        return this.delayedPics;
    }

    removeBullet(bullet) {
        this.bulletsArr = this.bulletsArr.filter(function (b) {
            return b !== bullet;
        });
    }

    removeShip(ship) {
        this.cswArr = this.cswArr.filter(function (s) {
            return s !== ship;
        });
    }

    destroyAll() {
        this.cswArr = [];
    }

    // user
    // TODO: move entirely to the player class
    drawcswmt9(x, y, d) {
        this.playerImages[d].draw(
            x,
            y,
            this.CONST.CELLSIZES.MAXX * this.CONST.SCALE.X,
            this.CONST.CELLSIZES.MAXY * this.CONST.SCALE.Y
        );
        // this.drawContext.strokeStyle="#f00";
        // this.drawContext.strokeRect(Math.floor(x), Math.floor(y), 39,39);
        // this.drawContext.lineWidth=0.1;
    }

    // cpu
    drawcswmt5(x, y, d) {
        const relXY = this.gameCam.getRelCoords(x, y);
        this.cpuImages[d].draw(
            relXY.x,
            relXY.y,
            this.CONST.CELLSIZES.MAXX * this.CONST.SCALE.X,
            this.CONST.CELLSIZES.MAXY * this.CONST.SCALE.Y
        );
        // this.drawContext.strokeStyle="#f00";
        // this.drawContext.strokeRect(x, y, 39,39);
    }

    drawObstacle(x, y) {
        const relXY = this.gameCam.getRelCoords(x, y);
        this.obstacleImage.draw(
            relXY.x,
            relXY.y,
            this.CONST.CELLSIZES.MAXX * this.CONST.SCALE.X,
            this.CONST.CELLSIZES.MAXY * this.CONST.SCALE.Y
        );
        // this.drawContext.strokeStyle="#f00";
        // this.drawContext.strokeRect(x, y, 39,39);
    }

    drawBorder(x, y) {
        const relXY = this.gameCam.getRelCoords(x, y);
        this.borderImage.draw(
            relXY.x,
            relXY.y,
            this.CONST.CELLSIZES.MAXX * this.CONST.SCALE.X,
            this.CONST.CELLSIZES.MAXY * this.CONST.SCALE.Y
        );
        // this.drawContext.strokeStyle="#f00";
        // this.drawContext.strokeRect(x, y, 39,39);
    }

    drawStaticShip(x, y) {
        const relXY = this.gameCam.getRelCoords(x, y);
        this.cpuImages[0].draw(
            relXY.x,
            relXY.y,
            this.CONST.CELLSIZES.MAXX * this.CONST.SCALE.X,
            this.CONST.CELLSIZES.MAXY * this.CONST.SCALE.Y
        );
        // this.drawContext.strokeStyle="#f00";
        // this.drawContext.strokeRect(x, y, 39,39);
    }

    drawSpaceBrick(x, y, n) {
        const relXY = this.gameCam.getRelCoords(x, y);
        this.spaceBrickImages[n].draw(
            relXY.x,
            relXY.y,
            this.CONST.CELLSIZES.MAXX * this.CONST.SCALE.X,
            this.CONST.CELLSIZES.MAXY * this.CONST.SCALE.Y
        );
    }

    drawCounter(x, y, n) {
        const relXY = this.gameCam.getRelCoords(x, y);
        this.counterImage[n].draw(
            relXY.x,
            relXY.y,
            this.CONST.CELLSIZES.MAXX * this.CONST.SCALE.X,
            this.CONST.CELLSIZES.MAXY * this.CONST.SCALE.Y
        );
    }

    DrawCrash(x, y, onDelayEnd) {
        this.crashImage.draw(x, y, 1000, onDelayEnd);
        // this.crashImage.draw(x, y, 0, onDelayEnd);
    }

    drawBackground() {
        this.backgroundImage.draw(0, 0, 1000, 720);
    }

    showLogo() {
        this.infoContext.fillStyle = "lightgreen";
        this.infoContext.strokeStyle = "#F00";
        this.infoContext.font = "30pt Arial";
        this.infoContext.fillText("Space Town!", 0, 30);
    }

    showNames() {
        this.infoContext.fillStyle = "gray";
        this.infoContext.strokeStyle = "#F00";
        this.infoContext.font = "20pt Arial";
        this.infoContext.fillText("p1 life:", 0, 60);

        // this.infoContext.fillStyle = "gray";
        // this.infoContext.strokeStyle = "#F00";
        // this.infoContext.font = "20pt Arial";
        // this.infoContext.fillText("cpu life:", 0, 90);
    }

    showGameOver() {
        this.gameOverBlock.innerText = "GAME OVER";
        this.againBtn.style.display = "block";
        this.gameOverBlock.style.display = "block";
    }

    showWin() {
        this.againBtn.style.display = "block";
        this.gameOverBlock.innerText = "YOU WIN";
        this.gameOverBlock.style.display = "block";
    }

    displayLifeBar(player) {
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
    }
};
