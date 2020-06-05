console.log("main!");

// -----------------------------
//        Основная логика
// -----------------------------
BattleTankGame.deps.game = function (CONST, BTank, Utils) {
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
                BTank.showLogo();
                BTank.showNames();

                player1 = BTank.createCSW(0, 0, CONST.USER);

                // BTank.createCSW(
                //     41,
                //     41,
                //     CONST.COMPUTER,
                //     0,
                //     CONST.TYPES.OBSTACLE
                // );
                // BTank.createCSW(
                //     41,
                //     81,
                //     CONST.COMPUTER,
                //     0,
                //     CONST.TYPES.OBSTACLE
                // );
                // BTank.createCSW(
                //     41,
                //     162,
                //     CONST.COMPUTER,
                //     0,
                //     CONST.TYPES.OBSTACLE
                // );

                // BTank.createCSW(500, 300, CONST.COMPUTER, 1000);
                // BTank.createCSW(940, 360, CONST.COMPUTER, 2030);
                // BTank.createCSW(940, 420, CONST.COMPUTER, 3300);
                // BTank.createCSW(940, 480, CONST.COMPUTER, 4444);
                // BTank.createCSW(250, 540, CONST.COMPUTER, 5005);
                // BTank.createCSW(250, 600, CONST.COMPUTER, 6007);
                // BTank.createCSW(250, 460, CONST.COMPUTER, 7008);
                // BTank.createCSW(250, 660, CONST.COMPUTER, 9001);
                // BTank.createCSW(250, 100, CONST.COMPUTER, 11003);
                // BTank.createCSW(250, 220, CONST.COMPUTER, 17009);
                // BTank.createCSW(250, 340, CONST.COMPUTER, 23005);
                // BTank.createCSW(250, 400, CONST.COMPUTER, 41009);

                // BTank.createCSW(250, 460, CONST.COMPUTER, 7);
                // BTank.createCSW(250, 480, CONST.COMPUTER, 8);
                // BTank.createCSW(250, 500, CONST.COMPUTER, 9);
                // BTank.createCSW(250, 520, CONST.COMPUTER, 10);
                // BTank.createCSW(250, 540, CONST.COMPUTER, 11);
                // BTank.createCSW(250, 560, CONST.COMPUTER, 12);

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
                // BTank.gameFieldBlock.addEventListener("click", this.editorOnClickHandler.bind(this));
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

        if (BTank.editorMode) {
            this.editorCycle(timestamp);
        } else {
            this.gameCycle(timestamp);
        }

        mainIntervalId = window.requestAnimationFrame(
            this.mainCycle.bind(this)
        );
    };

    this.editorCycle = function (timestamp) {
        BTank.editorUnits.forEach(function (unit) {
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

        BTank.displayLifeBar(player1);

        // if (BTank.cswArr.filter(c => (c.iam === CONST.COMPUTER && c.type === CONST.TYPES.SHIP)).length === 0) {
        //     win = true;
        // }

        if (!gameOver && (win || player1.life === 0)) {
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
        // console.log(event);
        if (BTank.editorMode && event.buttons === 1) {
            const x = event.offsetX,
                y = event.offsetY;
            const cellx = Math.floor(x / 40)*40;
            const celly = Math.floor(y / 40)*40;
            if (BTank.editorCurrentObjectBrush.type !== CONST.TYPES.ERASER) {
                BTank.createEditorUnit(cellx, celly, BTank.editorCurrentObjectBrush.type);
            } else {
                // console.log([cellx, celly])
                BTank.removeEditorObjectAt(cellx, celly);
            }
        }
    };

    this.keyUpHandler = function (kc) {
        // TODO: keysUp array for keys that are up to know which direction isn't getting acceleration
        player1.stopAccel = true;
        timeCount = 0;

        if (kc === Utils.KEY_CODE.F1_KEY) {
            // console.log("f1 !");
            this.toggleEditor();
        }
    };

    this.toggleEditor = function () {
        BTank.toggleEditorControls();
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
        // console.log(kc);
        if (event.type === "keyup") {
            this.keyUpHandler(kc);
        }
        this.editorKeys(kc);
    };

    this.editorKeys = function (kc) {
        if (BTank.editorMode && kc === Utils.KEY_CODE.N1_KEY) {
            BTank.setCurrentEditorBrushObject(CONST.TYPES.OBSTACLE);
        }
        if (BTank.editorMode && kc === Utils.KEY_CODE.N2_KEY) {
            BTank.setCurrentEditorBrushObject(CONST.TYPES.SHIP);
        }
        if (BTank.editorMode && kc === Utils.KEY_CODE.N3_KEY) {
            BTank.setCurrentEditorBrushObject(CONST.TYPES.ERASER);
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
        if (
            keys[Utils.KEY_CODE.UP] ||
            keys[Utils.KEY_CODE.DOWN] ||
            keys[Utils.KEY_CODE.LEFT] ||
            keys[Utils.KEY_CODE.RIGHT]
        ) {
            // this.handler_accelerateWhileDownAndStopOnceUp();
        }
    };
};

BattleTankGame.gameInstance = new BattleTankGame.deps.game(
    BattleTankGame.deps.const,
    new BattleTankGame.deps.BTankManager(
        BattleTankGame.deps.const,
        BattleTankGame.deps.csw,
        // BattleTankGame.deps.cswAI_0,
        BattleTankGame.deps.cswAI_1,
        BattleTankGame.deps.obstacle,
        BattleTankGame.deps.staticShip,
        BattleTankGame.deps.bulletPixel,
        BattleTankGame.deps.images
    ),
    BattleTankGame.deps.utils
);

BattleTankGame.gameInstance.start();
