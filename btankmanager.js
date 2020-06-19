console.log("BTankManager!");

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
    },

    CELLSIZES: {
        MAXX: 40,
        MAXY: 40,
    },

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
        images,
        delayedPic
    ) {
        // TODO: dependencies in parameters are completely redundant! (CONST, csw, bullet, images)
        // TODO: write the full paths to classes
        this.cswArr = [];
        this.delayedPics = [];
        this.drawContext = null;
        this.infoContext = null;
        this.againBtn = null;
        this.gameOverBlock = null;
        this.playerImage = null;
        this.crashImage = null;
        this.backgroundImage = null;

        this.CONST = CONST;
        this.csw = csw;
        this.player = player;
        this.cswAI = cswAI;
        this.obstacle = obstacle;
        // this.staticShip = staticShip;
        this.spaceBrick = spaceBrick;
        this.bullet = bullet;
        this.images = images;
        this.delayedPic = delayedPic;
        this.baseCoords = new BattleTankGame.deps.baseCoordinates();
    }

    init() {
        const gameField = document.getElementById("gameField");
        gameField.height = this.CONST.MAXY * 20;
        gameField.width = this.CONST.MAXX * 20;

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
        this.spaceBrickImages = [];

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
        ];
        return Promise.all(promises);
    }

    // TODO: is it good that BTankManager knows which fields CSW class contains ?
    createCSW(
        x,
        y,
        who, // TODO: this field should be in ship class (csw or cswai or obstacle)
        delay,
        typeParam
    ) {
        let c1 = null;
        const type = typeParam || this.CONST.TYPES.SHIP;
        if (who === this.CONST.USER) {
            c1 = new this.player(this.CONST, this.bullet);
            c1.init(x, y, who, this);
            this.cswArr.push(c1);
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
                        this.cswArr.push(c1);
                    }
                }.bind(this),
                delay
            );

            if (type === this.CONST.TYPES.OBSTACLE) {
                c1 = new this.obstacle(this.CONST, this.bullet);
                c1.init(x, y, who, this);
                this.cswArr.push(c1);
            }

            if (type === this.CONST.TYPES.SPACEBRICK) {
                c1 = new this.spaceBrick(this.CONST, this.bullet);
                c1.init(x, y, who, this);
                this.cswArr.push(c1);
            }
        }
        // const c1 =
        //     who === this.CONST.USER
        //         ? new this.csw(this.CONST, this.bullet)
        //         : new this.cswAI(this.CONST, this.bullet);
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
            width: image.width,
            height: image.height,
        };
    }

    checkCSW(x, y) {
        const result =
            this.cswArr.filter(function (csw) {
                return csw.x == x && csw.y == y;
            }).length > 0;
        return result.length > 0;
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

        // || (typeToCheckParam === undefined && csw.type !== typeToCheckParam)

        const tArr = this.cswArr.filter(function (csw) {
            if (whoAsks === csw) {
                return false;
            }

            const checkResult =
                checkSquare(csw, nx, ny) ||
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

    getBulletWithPixelPrecision(x, y, whoAsks) {
        const tArr = this.cswArr
            .filter(function (csw) {
                return !(csw.type !== this.CONST.TYPES.SHIP || whoAsks === csw);
            }, this)
            .reduce(function (csw1, csw2) {
                // const { width, height } = csw.dimensions[csw.d];
                const bullets = csw2.bulletsArray.filter(function (b) {
                    return b.isfire;
                });
                const collidedBullets = bullets.filter(function (b) {
                    return x >= b.x && x <= b.x + 4 && y >= b.y && y <= b.y + 4;
                });
                return csw1.concat(collidedBullets);
            }, []);

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

    getAllShips() {
        return this.cswArr;
    }

    addShip(ship) {
        this.cswArr.push(ship);
    }

    createDelayedPic(x, y) {
        const dp = new this.delayedPic(this.CONST);
        dp.init(x, y, this);
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

    getCPUs() {
        return this.cswArr.filter(function (c) {
            return c.iam === c.CONST.COMPUTER;
        });
    }

    removeShip(ship) {
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
    }

    destroyAll() {
        this.cswArr = [];
    }

    // user
    // TODO: move entirely to the player class
    drawcswmt9(x, y, d) {
        this.playerImages[d].draw(x, y);
        // this.drawContext.strokeStyle="#f00";
        // this.drawContext.strokeRect(Math.floor(x), Math.floor(y), 39,39);
        // this.drawContext.lineWidth=0.1;
    }

    // cpu
    drawcswmt5(x, y, d) {
        this.cpuImages[d].draw(x, y);
        // this.drawContext.strokeStyle="#f00";
        // this.drawContext.strokeRect(x, y, 39,39);
    }

    drawObstacle(x, y) {
        this.obstacleImage.draw(x, y);
        // this.drawContext.strokeStyle="#f00";
        // this.drawContext.strokeRect(x, y, 39,39);
    }

    drawStaticShip(x, y) {
        this.cpuImages[0].draw(x, y);
        // this.drawContext.strokeStyle="#f00";
        // this.drawContext.strokeRect(x, y, 39,39);
    }

    drawSpaceBrick(x, y, n) {
        this.spaceBrickImages[n].draw(x, y);
    }

    DrawBlack(x, y) {
        this.drawContext.clearRect(x, y, 20, 20);
    }

    DrawCrash(x, y, onDelayEnd) {
        this.crashImage.draw(x, y, 1000, onDelayEnd);
        // this.crashImage.draw(x, y, 0, onDelayEnd);
    }

    drawGameField() {
        this.drawContext.strokeStyle = "#000";
        this.drawContext.strokeRect(
            0,
            0,
            this.CONST.MAXX * 20, // TODO: use CONST.CELLSIZES.MAXX instead of magic number!
            this.CONST.MAXY * 20
        );
    }

    drawBackground() {
        this.backgroundImage.draw(0, 0);
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
