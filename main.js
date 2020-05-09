console.log("main!");

// -----------------------------
//        Основная логика
// -----------------------------
BattleTankGame.deps.game = function (CONST, BTank, Utils) {
    let mainIntervalId = null;
    let stop = false;
    let keys = {};
    let timeCount = 0;

    const controlsMap = {
        [Utils.KEY_CODE.UP]: 3,
        [Utils.KEY_CODE.LEFT]: 2,
        [Utils.KEY_CODE.RIGHT]: 0,
        [Utils.KEY_CODE.DOWN]: 1,
        [Utils.KEY_CODE.a_KEY]: 4,
    };

    let cpuKey = null;
    let player1 = null;
    let cpus = [];

    this.start = function () {
        BTank.init();
        BTank.showLogo();
        BTank.showNames();

        player1 = BTank.createCSW(1, 1, CONST.USER, 1);

        cpus[0] = BTank.createCSW(250, 340, CONST.COMPUTER, 1);
        // cpus[1] = BTank.createCSW(6, 4, CONST.COMPUTER, 2);
        // cpus[2] = BTank.createCSW(7, 4, CONST.COMPUTER, 3);
        // cpus[3] = BTank.createCSW(8, 4, CONST.COMPUTER, 4);
        // cpus[4] = BTank.createCSW(9, 4, CONST.COMPUTER, 5);
        // cpus[5] = BTank.createCSW(10, 4, CONST.COMPUTER, 6);
        // cpus[6] = BTank.createCSW(9, 5, CONST.COMPUTER, 7);
        // cpus[7] = BTank.createCSW(9, 6, CONST.COMPUTER, 8);
        // cpus[8] = BTank.createCSW(9, 7, CONST.COMPUTER, 9);
        // cpus[9] = BTank.createCSW(9, 8, CONST.COMPUTER, 10);
        // cpus[10] = BTank.createCSW(3, 2, CONST.COMPUTER, 11);
        // cpus[11] = BTank.createCSW(2, 3, CONST.COMPUTER, 12);

        stop = false;

        document.addEventListener("keydown", this.keysHandler.bind(this));
        document.addEventListener("keyup", this.keysHandler.bind(this));

        mainIntervalId = window.requestAnimationFrame(
            this.mainCycle.bind(this)
        );
    };

    this.mainCycle = function (timestamp) {
        BTank.drawContext.fillStyle = "black";
        BTank.drawContext.fillRect(0, 0, 420, 420);
        BTank.drawBackground();
        
        this.detectMovement(timestamp);
        player1.update();

        // random AI
        cpus.filter(function (cpu) {
            cpuKey = Utils.getRandomInt(0, 3);
            cpu.update(cpuKey, true); // true чтобы CPU двигался
            cpu.fire(timestamp);
        });

        BTank.displayLifeBar(player1);
        BTank.displayLifeBar(cpus[0]);

        if (player1.life === 0) {
            Utils.text("GAME OVER");
            stop = true;
        }

        if (cpus[0].life <= 0) {
            Utils.text("YOU WIN");
            stop = true;
        }

        if (stop) {
            BTank.showGameOver(player1.life);
        }

        if (!stop) {
            mainIntervalId = window.requestAnimationFrame(
                this.mainCycle.bind(this)
            );
        }
    };

    // ----------- ACCELERATION -----------

    this.accelerateWhileDownAndStopOnceUp = function () {
        player1.addAccel(0.1);
        timeCount++;
        if (!player1.stopAccel) {
            setTimeout(this.accelerateWhileDownAndStopOnceUp.bind(this), 10);
        }
    }

    this.handler_accelerateWhileDownAndStopOnceUp = function () {
        player1.stopAccel = false;
        setTimeout(this.accelerateWhileDownAndStopOnceUp.bind(this), 10);
    }

    this.keyUpHandler = function () {
        // TODO: keysUp array for keys that are up to know which direction isn't getting acceleration
        player1.stopAccel = true;
        if (player1.getAccel() < 0) {
            player1.setAccel(0);
        }
        timeCount = 0;
    }

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
            this.keyUpHandler();
        }
    };

    this.detectMovement = function (timestamp) {
        // code here must change ONLY DIRECTION
        const ACCEL = 0.1;
        if (keys[Utils.KEY_CODE.UP]) {
            player1.setDirectionAndAccel(controlsMap[Utils.KEY_CODE.UP], ACCEL);
        }
        if (keys[Utils.KEY_CODE.LEFT]) {
            player1.setDirectionAndAccel(controlsMap[Utils.KEY_CODE.LEFT], ACCEL);
        }
        if (keys[Utils.KEY_CODE.RIGHT]) {
            player1.setDirectionAndAccel(controlsMap[Utils.KEY_CODE.RIGHT], ACCEL);
        }
        if (keys[Utils.KEY_CODE.DOWN]) {
            player1.setDirectionAndAccel(controlsMap[Utils.KEY_CODE.DOWN], ACCEL);
        }
        if (keys[Utils.KEY_CODE.a_KEY]) {
            player1.fire(timestamp);
        }
        if (keys[Utils.KEY_CODE.UP] || keys[Utils.KEY_CODE.DOWN] || keys[Utils.KEY_CODE.LEFT] || keys[Utils.KEY_CODE.RIGHT]) {
            this.handler_accelerateWhileDownAndStopOnceUp();
        }
    };
};

BattleTankGame.gameInstance = new BattleTankGame.deps.game(
    BattleTankGame.deps.const,
    new BattleTankGame.deps.BTankManager(
        BattleTankGame.deps.const,
        BattleTankGame.deps.csw,
        BattleTankGame.deps.bulletPixel,
        BattleTankGame.deps.images
    ),
    BattleTankGame.deps.utils
);

BattleTankGame.gameInstance.start();