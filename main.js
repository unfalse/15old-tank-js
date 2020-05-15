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

    let player1 = null;
    //let cpus = [];

    this.start = function () {
        BTank.init().then((function() {
            BTank.showLogo();
            BTank.showNames()        
    
            player1 = BTank.createCSW(1, 1, CONST.USER, 1);
    
            setTimeout(() => BTank.createCSW(500, 300, CONST.COMPUTER, 1), 1000);
            setTimeout(() => BTank.createCSW(940, 360, CONST.COMPUTER, 2), 2030);
            setTimeout(() => BTank.createCSW(940, 420, CONST.COMPUTER, 3), 3300);
            setTimeout(() => BTank.createCSW(940, 480, CONST.COMPUTER, 4), 4444);
            setTimeout(() => BTank.createCSW(250, 540, CONST.COMPUTER, 5), 5005);
            setTimeout(() => BTank.createCSW(250, 600, CONST.COMPUTER, 6), 6007);
            setTimeout(() => BTank.createCSW(250, 460, CONST.COMPUTER, 7), 7008);
            setTimeout(() => BTank.createCSW(250, 660, CONST.COMPUTER, 8), 9001);
            setTimeout(() => BTank.createCSW(250, 100, CONST.COMPUTER, 9), 11003);
            setTimeout(() => BTank.createCSW(250, 220, CONST.COMPUTER, 10), 17009);
            setTimeout(() => BTank.createCSW(250, 340, CONST.COMPUTER, 11), 23005);
            setTimeout(() => BTank.createCSW(250, 400, CONST.COMPUTER, 12), 41009);
    
    
            // BTank.createCSW(250, 460, CONST.COMPUTER, 7);
            // BTank.createCSW(250, 480, CONST.COMPUTER, 8);
            // BTank.createCSW(250, 500, CONST.COMPUTER, 9);
            // BTank.createCSW(250, 520, CONST.COMPUTER, 10);
            // BTank.createCSW(250, 540, CONST.COMPUTER, 11);
            // BTank.createCSW(250, 560, CONST.COMPUTER, 12);
    
    
    
            stop = false;
    
            document.addEventListener("keydown", this.keysHandler.bind(this));
            document.addEventListener("keyup", this.keysHandler.bind(this));
    
            mainIntervalId = window.requestAnimationFrame(
                this.mainCycle.bind(this)
            );
        }).bind(this));
    };

    this.mainCycle = function (timestamp) {
        // console.log(timestamp);
        // BTank.drawContext.fillStyle = "black";
        // BTank.drawContext.fillRect(0, 0, 420, 420);
        BTank.drawBackground();
        
        this.detectMovement(timestamp);
        player1.update();

        // random AI
        BTank.getCPUs().filter(function (cpu) {
            cpu.AI_update(timestamp);
        });

        BTank.displayLifeBar(player1);
        // BTank.displayLifeBar(cpus[0]);

        if (player1.life === 0) {
            Utils.text("GAME OVER");
            stop = true;
        }

        // if (cpus[0].life <= 0) {
        //     Utils.text("YOU WIN");
        //     stop = true;
        // }

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
            player1.setDirectionAndAddAccel(controlsMap[Utils.KEY_CODE.UP], ACCEL);
        }
        if (keys[Utils.KEY_CODE.LEFT]) {
            player1.setDirectionAndAddAccel(controlsMap[Utils.KEY_CODE.LEFT], ACCEL);
        }
        if (keys[Utils.KEY_CODE.RIGHT]) {
            player1.setDirectionAndAddAccel(controlsMap[Utils.KEY_CODE.RIGHT], ACCEL);
        }
        if (keys[Utils.KEY_CODE.DOWN]) {
            player1.setDirectionAndAddAccel(controlsMap[Utils.KEY_CODE.DOWN], ACCEL);
        }
        if (keys[Utils.KEY_CODE.a_KEY]) {
            player1.fire(timestamp);
        }
        if (keys[Utils.KEY_CODE.UP] || keys[Utils.KEY_CODE.DOWN] || keys[Utils.KEY_CODE.LEFT] || keys[Utils.KEY_CODE.RIGHT]) {
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
        BattleTankGame.deps.bulletPixel,
        BattleTankGame.deps.images
    ),
    BattleTankGame.deps.utils
);

BattleTankGame.gameInstance.start();