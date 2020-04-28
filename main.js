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
  let cpu = [];
  // scripts: ['stekcosm.js', 'utils.js', 'csw.js', 'bullet.js'],
  let move = false; // флаг того, что игрок двигается

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
    
    cpu[0] = BTank.createCSW(5, 4, CONST.COMPUTER, 1);
    // this.cpu[1] = BTank.createCSW(6, 4, CONST.COMPUTER, 1);
    // this.cpu[2] = BTank.createCSW(7, 4, CONST.COMPUTER, 1);
    // this.cpu[3] = BTank.createCSW(8, 4, CONST.COMPUTER, 1);
    // this.cpu[4] = BTank.createCSW(9, 4, CONST.COMPUTER, 1);
    // this.cpu[5] = BTank.createCSW(10, 4, CONST.COMPUTER, 1);
    // this.cpu[6] = BTank.createCSW(9, 5, CONST.COMPUTER, 1);
    // this.cpu[7] = BTank.createCSW(9, 6, CONST.COMPUTER, 1);
    // this.cpu[8] = BTank.createCSW(9, 7, CONST.COMPUTER, 1);
    // this.cpu[9] = BTank.createCSW(9, 8, CONST.COMPUTER, 1);
    // this.cpu[10] = BTank.createCSW(3, 2, CONST.COMPUTER, 1);
    // this.cpu[11] = BTank.createCSW(2, 3, CONST.COMPUTER, 1);

    stop = false;
    document.addEventListener("keydown", this.keysHandler.bind(this));
    document.addEventListener("keyup", this.keysHandler.bind(this));
    mainIntervalId = setInterval(this.mainCycle.bind(this), speed);
  },

  this.mainCycle = function(){
    // TODO: refactor to make a separate function to move player's tank
    // place the move function call directly into the keysHandler
    this.detectMovement();
    player1.update();
    
    // if(playerFire){
    //   player1.fire();
    //   playerFire = false;
    // }
    
    // random AI
    cpu.filter(function(cpu){
      cpuKey = Utils.getRandomInt(0,3);
      cpu.update(cpuKey, true); // true чтобы CPU двигался
      cpu.fire();
    });

    BTank.displayLifeBar(player1);
    BTank.displayLifeBar(cpu[0]);

    if(player1.life===0){
      Utils.text('GAME OVER');
      stop = true; 
    }

    if(cpu[0].life<=0){
      Utils.text('YOU WIN');
      stop = true;
    }

    if(stop){
      clearInterval(mainIntervalId);
      BTank.showGameOver(player1.life);
    }
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