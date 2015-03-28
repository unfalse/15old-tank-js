GAME = {
  mainIntervalId: null,
  speed: 1,
  stop: false,
  key: null,
  cpuKey: null,
  player1: null,
  cpu: null,
  scripts: ['stekcosm.js', 'utils.js'],
  move: false, // флаг того, что игрок двигается
  playerFire: false, // флаг того, что игрок выстрелил

  loadScripts: function(){
    for(var src in this.scripts){
      var script = document.createElement('script');
      script.src = this.scripts[src];
      document.head.appendChild(script);
    }
  },
  
  start: function(){
    //ShowHelp();
    //text('Battle Tank!');
    var gameField     = document.getElementById('gameField');
    gameField.height  = 500;
    gameField.width   = 500;
    
    var gameInfo      = document.getElementById('gameInfo');
    
    //this.loadScripts();
    BTank.drawContext = gameField.getContext('2d');
    BTank.infoContext = gameInfo.getContext('2d');
    BTank.showLogo();
    BTank.showNames();
    BTank.DrawGameField();
    
    this.player1 = BTank.createCSW(1, 1, CONST.USER, 1);
    this.cpu = BTank.createCSW(5, 4, CONST.COMPUTER, 1);
    this.stop = false;
    document.addEventListener("keydown", this.keysHandler);
    this.mainIntervalId = setInterval(this.mainCycle, this.speed);
  },

  mainCycle: function(){
    BTank.DrawGameField();
    GAME.player1.update(GAME.key, GAME.move);
    GAME.move = false;
    
    if(GAME.playerFire){
      GAME.player1.fire();
      GAME.playerFire = false;
    }
    
    GAME.cpuKey = Utils.getRandomInt(0,3);
    GAME.cpu.update(GAME.cpuKey, true); // true чтобы CPU двигался
    GAME.cpu.fire();

    GAME.player1.displayLife();
    GAME.cpu.displayLife();

    if(GAME.player1.life==0){
      Utils.text('GAME OVER');
      GAME.stop = true; 
    }

    if(GAME.cpu.life<=0){
      Utils.text('YOU WIN');
      GAME.stop = true;
    }

    if(GAME.stop){
      clearInterval(GAME.mainIntervalId);
      BTank.showGameOver(GAME.player1.life);
    }
  },

  keysHandler: function(event){
    switch(event.keyCode) {
      case Utils.KEY_CODE.LEFT:
        GAME.key = 2;
        GAME.move = true;
      break;
      case Utils.KEY_CODE.UP:
        GAME.key = 3;
        GAME.move = true;
      break;
      case Utils.KEY_CODE.RIGHT:
        GAME.key = 0;
        GAME.move = true;
      break;
      case Utils.KEY_CODE.DOWN:
        GAME.key = 1;
        GAME.move = true;
      break;
      case Utils.KEY_CODE.a_KEY:
        GAME.playerFire = true;
      break;
      default:
    }
  },
  
  readKeys: function(event){
    this.key = Utils.getChar(event);
    this.move = true;
  }
}

//document.onload = GAME.start();