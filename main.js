// -----------------------------
//        Основная логика
// -----------------------------
GAME = {
  mainIntervalId: null,
  speed: 1,
  stop: false,
  key: null,
  cpuKey: null,
  player1: null,
  cpu: [],
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
    BTank.init();
    BTank.showLogo();
    BTank.showNames();
    
    this.player1 = BTank.createCSW(1, 1, CONST.USER, 1);
    
    this.cpu[0] = BTank.createCSW(5, 4, CONST.COMPUTER, 1);
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


    this.stop = false;
    document.addEventListener("keydown", this.keysHandler.bind(this));
    document.addEventListener("keyup", this.keysHandler.bind(this));
    this.mainIntervalId = setInterval(this.mainCycle.bind(this), this.speed);
  },

  mainCycle: function(){
    this.player1.update(this.key, this.move);
    
    if(this.playerFire){
      this.player1.fire();
    }
    
    var self = this;
    this.cpu.filter(function(cpu){
      self.cpuKey = Utils.getRandomInt(0,3);
      cpu.update(self.cpuKey, true); // true чтобы CPU двигался
      cpu.fire();
    });

    BTank.displayLifeBar(this.player1);
    BTank.displayLifeBar(this.cpu[0]);

    if(this.player1.life==0){
      Utils.text('GAME OVER');
      this.stop = true; 
    }


    if(this.cpu[0].life<=0){
      Utils.text('YOU WIN');
      this.stop = true;
    }


    if(this.stop){
      clearInterval(this.mainIntervalId);
      BTank.showGameOver(this.player1.life);
    }
  },

  keysHandler: function(event){
    if(event.type=="keydown"){
      switch(event.keyCode) {
        case Utils.KEY_CODE.LEFT:
          this.key = 2;
          this.move = true;
        break;
        case Utils.KEY_CODE.UP:
          this.key = 3;
          this.move = true;
        break;
        case Utils.KEY_CODE.RIGHT:
          this.key = 0;
          this.move = true;
        break;
        case Utils.KEY_CODE.DOWN:
          this.key = 1;
          this.move = true;
        break;
        case Utils.KEY_CODE.a_KEY:
          this.playerFire = true;
        break;
        default:
      }
    }

    if(event.type=="keyup"){
      switch(event.keyCode) {
        case Utils.KEY_CODE.a_KEY:
          this.playerFire = false;
        break;
        default:
          this.move = false;
          break;
      }
    }
  },
  
  readKeys: function(event){
    this.key = Utils.getChar(event);
    this.move = true;
  }
}

//document.onload = GAME.start();