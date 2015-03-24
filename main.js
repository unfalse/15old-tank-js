GAME = {
  mainIntervalId: null,
  speed: 0,
  stop: false,
  key: null,
  cpuKey: null,
  player1: null,
  cpu: null,
  scripts: ['stekcosm.js', 'utils.js'],
  move: false,

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
    //this.loadScripts();
    BTank.drawContext = gameField.getContext('2d');
    this.player1 = BTank.createCSW(1, 1, CONST.USER, 1);
    this.cpu = BTank.createCSW(5, 4, CONST.COMPUTER, 1);
    this.stop = false;
    document.addEventListener("keypress", this.readKeys);
    this.mainIntervalId = setInterval(this.mainCycle, this.speed);
  },

  mainCycle: function(){
    GAME.player1.update(GAME.key, GAME.move);
    GAME.move = false;
    
    GAME.cpuKey = Utils.getRandomInt(0,3);
    GAME.cpu.update(GAME.cpuKey, true);
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
    }
  },

  readKeys: function(event){
    this.key = Utils.getChar(event);
    this.move = true;
  }
}

//document.onload = GAME.start();