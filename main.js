console.log('main!');

// -----------------------------
//        Основная логика
// -----------------------------
BattleTankGame.deps.game = function(CONST, BTank, Utils) {
//GAME = {
  let mainIntervalId = null;
  let speed = 0;
  let stop = false;
  let key = -1;
  let keys = {};
  const controlsMap = {
    [Utils.KEY_CODE.UP]: 3,
    [Utils.KEY_CODE.LEFT]: 2,
    [Utils.KEY_CODE.RIGHT]: 0,
    [Utils.KEY_CODE.DOWN]: 1,
    [Utils.KEY_CODE.a_KEY]: 4
  }
  let cpuKey = null;
  let player1 = null;
  let cpus = [];
  // scripts: ['stekcosm.js', 'utils.js', 'csw.js', 'bullet.js'],
  let move = false; // флаг того, что игрок двигается
  let startTime;

  // loadScripts: function(){
  //   for(var src in this.scripts){
  //     var script = document.createElement('script');
  //     script.src = this.scripts[src];
  //     document.head.appendChild(script);
  //   }
  // },
  
  this.start = function(){
    //this.loadScripts();
    //ShowHelp();
    //text('Battle Tank!');
//    console.log(BattleTankGame);
    BTank.init();
    BTank.showLogo();
    BTank.showNames();
    
    player1 = BTank.createCSW(1, 1, CONST.USER, 1);
    
    cpus[0] = BTank.createCSW(5, 4, CONST.COMPUTER, 1);
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
    mainIntervalId = window.requestAnimationFrame(this.mainCycle.bind(this)); // setInterval(this.mainCycle.bind(this), speed);
  },

  this.mainCycle = function(timestamp) {
    // console.log('start!');
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    // TODO: refactor to make a separate function to move player's tank
    // place the move function call directly into the keysHandler
    this.detectMovement();
    player1.update();
    
    // if(playerFire){
    //   player1.fire();
    //   playerFire = false;
    // }
    
    // random AI
    cpus.filter(function(cpu){
      cpuKey = Utils.getRandomInt(0,3);
      cpu.update(cpuKey, true); // true чтобы CPU двигался
      cpu.fire();
    });

    BTank.displayLifeBar(player1);
    BTank.displayLifeBar(cpus[0]);

    if(player1.life===0){
      Utils.text('GAME OVER');
      stop = true; 
    }

    if(cpus[0].life<=0){
      Utils.text('YOU WIN');
      stop = true;
    }

    // if(stop){
    //   clearInterval(mainIntervalId);
    //   BTank.showGameOver(player1.life);
    // }

    // console.log(progress);
    // console.log('next!');
    // if (progress < 2000) {
      mainIntervalId = window.requestAnimationFrame(this.mainCycle.bind(this));
    // }
  },

  // TODO: try to use https://stackoverflow.com/questions/29118791/how-to-move-an-element-via-arrow-keys-continuously-smoothly
  this.keysHandler = function(event) {
    if (event.preventDefault) {
      //event.preventDefault();
    } else {
      event.returnValue = false;
    }
    var kc = event.keyCode || event.which;
    keys[kc] = event.type == 'keydown';
  };
  
  this.detectMovement = function() {
    // console.log(key);
    if (keys[Utils.KEY_CODE.UP]) {
      player1.move(controlsMap[Utils.KEY_CODE.UP]);
    }
    if (keys[Utils.KEY_CODE.LEFT]) {
      player1.move(controlsMap[Utils.KEY_CODE.LEFT]);
    }
    if (keys[Utils.KEY_CODE.RIGHT]) {
      player1.move(controlsMap[Utils.KEY_CODE.RIGHT]);
    }
    if (keys[Utils.KEY_CODE.DOWN]) {
      player1.move(controlsMap[Utils.KEY_CODE.DOWN]);
    }
    if (keys[Utils.KEY_CODE.a_KEY]) {
      player1.fire();
    }
  }
}

BattleTankGame.gameInstance = new BattleTankGame.deps.game(
  BattleTankGame.deps.const,
  new BattleTankGame.deps.stekcosm(
    BattleTankGame.deps.const,
    BattleTankGame.deps.csw,
    BattleTankGame.deps.bullet
  ),
  BattleTankGame.deps.utils
);
BattleTankGame.gameInstance.start();
//document.onload = GAME.start();