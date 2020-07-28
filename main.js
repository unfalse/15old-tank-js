console.log("main!");

// -----------------------------
//        Основная логика
// -----------------------------
BattleTankGame.deps.game = function (CONST, BTank, Editor, Utils) {
    let mainIntervalId = null;
    let gameOver = false;
    let win = false;
    let keys = {};
    let timeCount = 0;
    // let editor = false;

    const controlsMap = {
        [Utils.KEY_CODE.UP]: 3,
        [Utils.KEY_CODE.LEFT]: 2,
        [Utils.KEY_CODE.RIGHT]: 0,
        [Utils.KEY_CODE.DOWN]: 1,
        [Utils.KEY_CODE.a_KEY]: 4,
    };

    // TODO: move player1 into BTankManager
    let player1 = null;
    let gameCam = null;
    //let cpus = [];

    this.start = function () {
        BTank.init().then(
            function () {
                Editor.init(BTank);
                BTank.showLogo();
                BTank.showNames();

                player1 = BTank.createCSW(0, 600, CONST.USER);
                gameCam = BTank.getGameCam();

                BTank.createCSW(10, 10, CONST.COMPUTER, 0, CONST.TYPES.COUNTER);
                BTank.createCSW(50, 10, CONST.COMPUTER, 0, CONST.TYPES.COUNTER);
                BTank.createCSW(90, 10, CONST.COMPUTER, 0, CONST.TYPES.COUNTER);
                BTank.createCSW(
                    130,
                    10,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    170,
                    10,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    210,
                    10,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    250,
                    10,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    290,
                    10,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    330,
                    10,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );

                BTank.createCSW(10, 50, CONST.COMPUTER, 0, CONST.TYPES.COUNTER);
                BTank.createCSW(50, 50, CONST.COMPUTER, 0, CONST.TYPES.COUNTER);
                BTank.createCSW(90, 50, CONST.COMPUTER, 0, CONST.TYPES.COUNTER);
                BTank.createCSW(
                    130,
                    50,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    170,
                    50,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    210,
                    50,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    250,
                    50,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    290,
                    50,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    330,
                    50,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );

                BTank.createCSW(10, 90, CONST.COMPUTER, 0, CONST.TYPES.COUNTER);
                BTank.createCSW(50, 90, CONST.COMPUTER, 0, CONST.TYPES.COUNTER);
                BTank.createCSW(90, 90, CONST.COMPUTER, 0, CONST.TYPES.COUNTER);
                BTank.createCSW(
                    130,
                    90,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    170,
                    90,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    210,
                    90,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    250,
                    90,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    290,
                    90,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );
                BTank.createCSW(
                    330,
                    90,
                    CONST.COMPUTER,
                    0,
                    CONST.TYPES.COUNTER
                );

                BTank.placeBorders();

                // for (let i = 0; i < 100; i++) {
                //     BTank.createCSW(940, 480, CONST.COMPUTER, 0);
                // }

                gameOver = false;
                win = false;

                document.addEventListener(
                    "keydown",
                    this.keysHandler.bind(this)
                );
                document.addEventListener("keyup", this.keysHandler.bind(this));

                BTank.gameFieldBlock.addEventListener(
                    "mousedown",
                    this.editorMouseDownHandler.bind(this)
                );
                BTank.gameFieldBlock.addEventListener(
                    "mousemove",
                    this.editorMouseDownHandler.bind(this)
                );

                mainIntervalId = window.requestAnimationFrame(
                    this.mainCycle.bind(this)
                );
            }.bind(this)
        );
    };

    this.mainCycle = function (timestamp) {
        // console.log(timestamp);
        BTank.drawBackground();

        if (Editor.editorMode) {
            this.editorCycle(timestamp);
        } else {
            this.gameCycle(timestamp);
        }

        mainIntervalId = window.requestAnimationFrame(
            this.mainCycle.bind(this)
        );
    };

    this.editorCycle = function (timestamp) {
        this.detectEditorMovement(timestamp);
        // player1.update();
        // gameCam.setCoords(player1.x, player1.y);

        Editor.editorUnits.forEach(function (unit) {
            unit.update(timestamp);
            // unit.draw();
        }, this);

        Editor.editorGhosts.forEach(function (ghost) {
            ghost.draw();
        }, this);
    };

    this.gameCycle = function (timestamp) {
        if (player1.life > 0) {
            this.detectMovement(timestamp);
            player1.update();
            gameCam.setCoords(player1.x, player1.y);
        }

        BTank.getAllBullets().forEach(function (bullet) {
            bullet.fly(timestamp);
        });

        BTank.getAllShips().forEach(function (ship) {
            ship.update(timestamp);
        });

        BTank.getAllDelayedPics().forEach(function (pic) {
            pic.draw();
        });

        BTank.getAllGhosts().forEach(function (ghost) {
            ghost.draw();
        });

        BTank.displayLifeBar(player1);

        if (!gameOver && (win || player1.life <= 0)) {
            if (win) {
                Utils.text("YOU WIN");
                BTank.showWin();
            } else {
                Utils.text("GAME OVER");
                BTank.showGameOver();
            }

            gameOver = true;
        }
        //console.log('cswArr = ', BTank.cswArr.length);
    };

    this.editorMouseDownHandler = function (event) {
        if (Editor.editorMode && event.buttons === 1) {
            const leftTop = {
                x: BTank.gameCam.x - BTank.CONST.CAM.CENTERX,
                y: BTank.gameCam.y - BTank.CONST.CAM.CENTERY,
            };
            const x = event.offsetX + leftTop.x,
                y = event.offsetY + leftTop.y;

            // const relXY = BTank.gameCam.getRelCoords(x, y);
            const cellx =
                Math.floor(x / CONST.CELLSIZES.MAXX) * CONST.CELLSIZES.MAXX;
            const celly =
                Math.floor(y / CONST.CELLSIZES.MAXY) * CONST.CELLSIZES.MAXY;

            if (Editor.editorCurrentObjectBrush.type !== CONST.TYPES.ERASER) {
                Editor.createEditorUnit(
                    cellx,
                    celly,
                    Editor.editorCurrentObjectBrush.type
                );
            } else {
                Editor.removeEditorObjectAt(cellx, celly);
            }
        }
    };

    this.keyUpHandler = function (kc) {
        // TODO: keysUp array for keys that are up to know which direction isn't getting acceleration
        player1.stopAccel = true;
        timeCount = 0;

        if (kc === Utils.KEY_CODE.F1_KEY) {
            //BTank.toggleEditorControls();
            Editor.toggleEditorControls();
        }
    };

    // ----------- END -----------

    this.keysHandler = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
        const kc = event.keyCode || event.which;
        keys[kc] = event.type == "keydown";

        if (event.type === "keyup") {
            this.keyUpHandler(kc);
        }
        this.editorKeys(kc);
    };

    this.editorKeys = function (kc) {
        if (Editor.editorMode) {
            if (kc === Utils.KEY_CODE.N1_KEY) {
                Editor.setCurrentEditorBrushObject(CONST.TYPES.ERASER);
            }
            if (kc === Utils.KEY_CODE.N2_KEY) {
                Editor.setCurrentEditorBrushObject(CONST.TYPES.OBSTACLE);
            }
            if (kc === Utils.KEY_CODE.N3_KEY) {
                Editor.setCurrentEditorBrushObject(CONST.TYPES.SHIP);
            }
            if (kc === Utils.KEY_CODE.N4_KEY) {
                Editor.setCurrentEditorBrushObject(CONST.TYPES.SPACEBRICK);
            }
        }
    };

    this.detectEditorMovement = function (timestamp) {
        const DX = 26;
        // TODO: move the screen
        if (keys[Utils.KEY_CODE.UP]) {
            gameCam.setCoords(BTank.gameCam.x, BTank.gameCam.y - DX);
        }
        if (keys[Utils.KEY_CODE.LEFT]) {
            gameCam.setCoords(BTank.gameCam.x - DX, BTank.gameCam.y);
        }
        if (keys[Utils.KEY_CODE.RIGHT]) {
            gameCam.setCoords(BTank.gameCam.x + DX, BTank.gameCam.y);
        }
        if (keys[Utils.KEY_CODE.DOWN]) {
            gameCam.setCoords(BTank.gameCam.x, BTank.gameCam.y + DX);
        }
    };

    this.detectMovement = function (timestamp) {
        // code here must change ONLY DIRECTION
        const ACCEL = 0.3;

        if (keys[Utils.KEY_CODE.UP]) {
            player1.setDirectionAndAddAccel(
                controlsMap[Utils.KEY_CODE.UP],
                ACCEL
            );
        }
        if (keys[Utils.KEY_CODE.LEFT]) {
            player1.setDirectionAndAddAccel(
                controlsMap[Utils.KEY_CODE.LEFT],
                ACCEL
            );
        }
        if (keys[Utils.KEY_CODE.RIGHT]) {
            player1.setDirectionAndAddAccel(
                controlsMap[Utils.KEY_CODE.RIGHT],
                ACCEL
            );
        }
        if (keys[Utils.KEY_CODE.DOWN]) {
            player1.setDirectionAndAddAccel(
                controlsMap[Utils.KEY_CODE.DOWN],
                ACCEL
            );
        }
        if (keys[Utils.KEY_CODE.a_KEY]) {
            player1.fire(timestamp);
        }
        if (keys[Utils.KEY_CODE.s_KEY]) {
            player1.stop();
        }
    };
};

BattleTankGame.gameInstance = new BattleTankGame.deps.game(
    BattleTankGame.deps.const,
    new BattleTankGame.deps.BTankManager(
        BattleTankGame.deps.const,
        BattleTankGame.deps.csw,
        BattleTankGame.deps.player,
        // BattleTankGame.deps.cswAI_1,
        BattleTankGame.deps.cswAI_customPaths,
        BattleTankGame.deps.obstacle,
        BattleTankGame.deps.staticShip,
        BattleTankGame.deps.spaceBrick,
        BattleTankGame.deps.bulletPixel,
        BattleTankGame.deps.counter,
        BattleTankGame.deps.camera,
        BattleTankGame.deps.border,
        BattleTankGame.deps.images,
        BattleTankGame.deps.delayedPic
    ),
    new BattleTankGame.deps.editor(
        BattleTankGame.deps.const,
        BattleTankGame.deps.obstacle,
        BattleTankGame.deps.staticShip,
        BattleTankGame.deps.spaceBrick,
        BattleTankGame.deps.border
    ),
    BattleTankGame.deps.utils
);

BattleTankGame.gameInstance.start();
