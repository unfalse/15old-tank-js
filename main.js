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
    //let cpus = [];

    this.start = function () {
        BTank.init().then(
            function () {
                Editor.init(BTank);
                BTank.showLogo();
                BTank.showNames();

                player1 = BTank.createCSW(0, 600, CONST.USER);

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
        Editor.editorUnits.forEach(function (unit) {
            unit.update(timestamp);
        });
    };

    this.gameCycle = function (timestamp) {
        if (player1.life > 0) {
            this.detectMovement(timestamp);
            player1.update();
        }

        BTank.getAllShips().forEach(function (ship) {
            ship.update(timestamp);
        });

        BTank.getAllDelayedPics().forEach(function (pic) {
            pic.draw();
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
    };

    this.editorMouseDownHandler = function (event) {
        if (Editor.editorMode && event.buttons === 1) {
            const x = event.offsetX,
                y = event.offsetY;
            const cellx = Math.floor(x / 40) * 40;
            const celly = Math.floor(y / 40) * 40;
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
        if (Editor.editorMode && kc === Utils.KEY_CODE.N1_KEY) {
            Editor.setCurrentEditorBrushObject(CONST.TYPES.ERASER);
        }
        if (Editor.editorMode && kc === Utils.KEY_CODE.N2_KEY) {
            Editor.setCurrentEditorBrushObject(CONST.TYPES.OBSTACLE);
        }
        if (Editor.editorMode && kc === Utils.KEY_CODE.N3_KEY) {
            Editor.setCurrentEditorBrushObject(CONST.TYPES.SHIP);
        }
        if (Editor.editorMode && kc === Utils.KEY_CODE.N4_KEY) {
            Editor.setCurrentEditorBrushObject(CONST.TYPES.SPACEBRICK);
        }
    };

    this.detectMovement = function (timestamp) {
        // code here must change ONLY DIRECTION
        const ACCEL = 0.1;
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
        BattleTankGame.deps.cswAI_1,
        BattleTankGame.deps.obstacle,
        BattleTankGame.deps.staticShip,
        BattleTankGame.deps.spaceBrick,
        BattleTankGame.deps.bulletPixel,
        BattleTankGame.deps.images,
        BattleTankGame.deps.delayedPic
    ),
    new BattleTankGame.deps.editor(
        BattleTankGame.deps.const,
        BattleTankGame.deps.obstacle,
        BattleTankGame.deps.staticShip,
        BattleTankGame.deps.spaceBrick
    ),
    BattleTankGame.deps.utils
);

BattleTankGame.gameInstance.start();
