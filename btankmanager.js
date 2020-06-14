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
        images
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
        this.staticShip = staticShip;
        this.spaceBrick = spaceBrick;
        this.bullet = bullet;
        this.images = images;
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
        this.editorBlock = document.querySelector("#editorBlock");
        this.editorCurrentObject = document.querySelector(
            "#editorCurrentObject"
        );
        this.editorPlayBtn = document.querySelector("#editorPlayBtn");
        this.editorSaveBtn = document.querySelector("#editorSaveBtn");
        this.editorLoadBtn = document.querySelector("#editorLoadBtn");
        this.gameFieldBlock = gameField;
        window.__editor_load_str = "";

        this.drawContext = gameField.getContext("2d");
        this.infoContext = this.gameInfo.getContext("2d");

        // TODO: make separate editor class?
        // current object chosen to place on the map
        this.editorCurrentObjectBrush = {
            type: this.CONST.TYPES.OBSTACLE,
            imageUrl: "url('images/obstacle2.png')",
        };
        this.editorMode = false;
        this.editorUnits = [];
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

        this.editorPlayBtn.addEventListener(
            "click",
            this.playTheEditorLevel.bind(this)
        );

        this.editorSaveBtn.addEventListener(
            "click",
            this.saveTheEditorLevel.bind(this)
        );

        this.editorLoadBtn.addEventListener(
            "click",
            this.loadTheEditorLevel.bind(this)
        );

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

            loadImage.call(this, "images/obstacle2.png", function (
                image
            ) {
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

    playTheEditorLevel() {
        const player = this.cswArr[0];
        this.destroyAll();

        // TODO: add player1 to the empty array
        this.cswArr.push(player);
        this.editorUnits.forEach(function (unit) {
            if (unit.type === this.CONST.TYPES.SHIP) {
                this.createCSW(unit.x, unit.y, this.CONST.COMPUTER, 0);
            }
            if (unit.type === this.CONST.TYPES.OBSTACLE) {
                this.createCSW(
                    unit.x,
                    unit.y,
                    this.CONST.COMPUTER,
                    0,
                    this.CONST.TYPES.OBSTACLE
                );
            }
            if (unit.type === this.CONST.TYPES.SPACEBRICK) {
                this.createCSW(
                    unit.x,
                    unit.y,
                    this.CONST.COMPUTER,
                    0,
                    this.CONST.TYPES.SPACEBRICK
                );
            }
        }, this);

        this.toggleEditorControls();
    }

    saveTheEditorLevel() {
        window.__editor_save_str = this.editorUnits.reduce(function (
            prev,
            curr
        ) {
            return prev + curr.type + "," + curr.x + "," + curr.y + "|";
        },
        "");
    }

    loadTheEditorLevel() {
        window.__editor_load_str =
            "1,0,480|1,40,480|1,80,480|1,120,480|1,120,440|1,120,400|1,120,360|1,120,320|1,280,280|1,320,280|1,360,280|1,520,200|1,560,200|1,600,200|1,640,200|1,360,400|1,400,400|1,440,400|1,480,400|1,640,320|1,640,360|1,640,400|1,680,400|1,720,400|1,760,400|1,800,200|1,840,200|1,880,200|1,880,160|1,920,160|1,920,120|1,920,80|1,320,120|1,360,120|1,400,120|1,440,120|2,160,440|2,160,400|2,200,400|2,240,400|2,280,400|2,320,400|2,280,440|2,240,440|2,240,480|2,280,480|2,320,480|2,320,520|2,360,520|2,400,520|2,520,400|2,560,400|2,600,400|2,600,360|2,600,320|2,560,320|2,560,360|2,560,440|2,560,480|2,600,480|2,600,440|2,520,440|2,480,440|2,360,440|2,320,440|2,760,440|2,800,440|2,840,440|2,840,400|2,880,440|2,920,440|2,920,400|2,960,400|2,960,440|2,880,400|2,880,360|2,920,360|2,960,360|2,960,320|2,400,280|2,440,280|2,440,240|2,480,240|2,480,200|2,440,200|2,400,240|2,400,200|2,360,200|2,680,200|2,720,200|2,760,200|2,920,200|2,960,200|2,960,160|2,960,120|2,960,80|2,120,280|2,80,280|2,40,280|2,40,240|2,40,200|2,80,240|2,120,240|2,120,200|2,280,120|2,240,120|2,200,120|2,200,160|2,160,160|1,160,200|1,160,240|1,200,240|1,200,200|1,480,520|1,520,520|1,520,560|1,560,560|1,600,560|0,760,40|0,720,40|0,680,40|0,640,40|0,600,40|0,560,40|0,520,40|0,480,40|0,440,40|0,400,40|0,360,40|0,320,40|0,280,40|0,240,40|0,200,40|0,200,80|0,160,80|0,120,80|0,120,40|0,80,40|0,40,40|0,40,0|0,0,0|0,80,0|0,120,0|0,160,40|0,200,0|0,240,0|0,280,0|0,320,0|0,360,0|0,400,0|0,440,0|0,480,0|0,520,0|0,560,0|0,600,0|0,640,-40|0,680,-40|0,680,0|0,720,0|0,760,0|0,800,0|0,840,0|0,880,0|0,920,0|0,960,0|0,960,40|0,920,40|0,880,40|0,840,40|0,800,40|0,640,0|0,400,80|0,360,80|0,320,80|0,280,80|0,240,80|0,440,80|0,480,80|0,520,80|0,560,80|0,600,80|0,640,80|0,680,80|0,720,80|0,760,80|0,800,80|0,840,80|0,NaN,NaN|2,320,680|2,320,640|2,360,640|2,360,600|2,400,600|2,440,600|2,480,600|2,480,640|2,520,640|2,520,680|2,560,680|2,480,680|2,520,600|2,560,640|2,440,640|2,400,640|2,400,680|2,360,680|2,440,680|";
        //"1,320,200|1,320,160|1,320,120|1,360,120|1,360,80|1,400,80|1,440,80|1,480,80|1,480,120|1,520,120|1,520,160|1,520,200|1,520,240|1,480,240|1,480,280|1,440,280|1,400,280|1,360,280|1,360,240|1,320,240|0,400,120|0,400,160|0,440,160|0,440,120|0,480,160|0,480,200|0,440,200|0,400,200|0,360,200|0,360,160|0,400,240|0,440,240|";
        window.__editor_load_str.split("|").forEach(function (objStr) {
            var fields = objStr.split(",");
            this.createEditorUnit(+fields[1], +fields[2], +fields[0]);
        }, this);
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

    createEditorUnit(x, y, type) {
        let newUnit = null;
        const who = this.CONST.COMPUTER;
        if (
            this.editorUnits.some(function (unit) {
                return unit.x === x && unit.y === y;
            })
        ) {
            return;
        }
        if (type === this.CONST.TYPES.OBSTACLE) {
            newUnit = new this.obstacle(this.CONST, this.bullet);
            newUnit.init(x, y, who, this);
            this.editorUnits.push(newUnit);
        }
        if (type === this.CONST.TYPES.SHIP) {
            newUnit = new this.staticShip(this.CONST, this.bullet);
            newUnit.init(x, y, who, this);
            this.editorUnits.push(newUnit);
        }
        if (type === this.CONST.TYPES.SPACEBRICK) {
            newUnit = new this.spaceBrick(this.CONST, this.bullet);
            newUnit.init(x, y, who, this);
            this.editorUnits.push(newUnit);
        }
    }

    removeEditorObjectAt(x, y) {
        this.editorUnits = this.editorUnits.filter(function (unit) {
            return !(unit.x === x && unit.y === y);
        });
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
        const tArr = this.cswArr.filter(function (csw) {
            return !(csw.type !== this.CONST.TYPES.SHIP || whoAsks === csw);
        }, this).reduce(function (csw1, csw2) {
            // const { width, height } = csw.dimensions[csw.d];
            const bullets = csw2.bulletsArray.filter(function (b) { return b.isfire; });
            const collidedBullets = bullets.filter(function (b) {
                return (
                    x >= b.x &&
                    x <= b.x + 4 &&
                    y >= b.y &&
                    y <= b.y + 4
                );
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

    createDelayedPic(x, y) {
        const dp = new this.delayedPic(this.CONST);
        dp.init(x, y, this.delayedPics.length, this);
        this.delayedPics.push(dp);
    }

    removeDelayedPic() {

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

    setCurrentEditorBrushObject(brushObjectType) {
        switch (brushObjectType) {
            case this.CONST.TYPES.SHIP: {
                this.editorCurrentObjectBrush = {
                    type: brushObjectType,
                    imageUrl: "url('images/csw-mt5bigger2x_0.png')",
                };
                break;
            }
            case this.CONST.TYPES.OBSTACLE: {
                this.editorCurrentObjectBrush = {
                    type: brushObjectType,
                    imageUrl: "url('images/obstacle2.png')",
                };
                break;
            }
            case this.CONST.TYPES.SPACEBRICK: {
                this.editorCurrentObjectBrush = {
                    type: brushObjectType,
                    imageUrl: "url('images/space_brick-0.png')",
                };
                break;
            }
            case this.CONST.TYPES.ERASER: {
                this.editorCurrentObjectBrush = {
                    type: brushObjectType,
                    imageUrl: "",
                };
                break;
            }
            default:
                break;
        }
        this.editorCurrentObject.style.backgroundImage = this.editorCurrentObjectBrush.imageUrl;
    }

    toggleEditorControls() {
        this.editorMode = !this.editorMode;
        if (this.editorMode) {
            this.gameInfo.style.display = "none";

            this.editorBlock.style.display = "flex";
            this.editorBlock.style.justifyContent = "center";

            this.editorCurrentObject.style.backgroundImage = this.editorCurrentObjectBrush.imageUrl;
            this.editorCurrentObject.style.width = "40px";
            this.editorCurrentObject.style.height = "40px";
        } else {
            this.gameInfo.style.display = "";
            this.gameInfo.style.textAlign = "center";
            this.editorBlock.style.display = "none";
        }
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
