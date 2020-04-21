console.log('stekcosm!');
BattleTankGame.deps.const = {
  MAXLIFES: 10,
  MAXSPEED: 10,
  
  COMPUTER: 0,
  USER: 1,
  
  MAXX: 20,
  MAXY: 20,
  BEGX: 20,
  BEGY: 20
};
// -------------------------------------
//    TOFIX! bullet dep propagation
// -------------------------------------
BattleTankGame.deps.stekcosm = function(CONST, csw, bullet) {
// const CONST = {
//   MAXLIFES: 10,
//   MAXSPEED: 10,
  
//   COMPUTER: 0,
//   USER: 1,
  
//   MAXX: 20,
//   MAXY: 20,
//   BEGX: 20,
//   BEGY: 20
// };

// -----------------------------
//        Отрисовка, а ещё менеджер танков (зачем?)
// -----------------------------
// BTank = {
  let cswArr = [];
	this.drawContext = null;
  this.infoContext = null;

  this.init = function() {
    var gameField     = document.getElementById('gameField');
    gameField.height  = 420;
    gameField.width   = 420;
    
    var gameInfo      = document.getElementById('gameInfo');
    
    //this.loadScripts();
    this.drawContext = gameField.getContext('2d');
    this.infoContext = gameInfo.getContext('2d');
  };

  this.checkCSW = function(x,y) {
    const result = cswArr.filter(function(csw) {
        return ((csw.x==x)&&(csw.y==y))
      }).length>0;
    return result.length>0;
  };

  this.changeCSW = function(x1, y1){
    const result = cswArr.filter(function(csw){
      return ((csw.x==x1)&&(csw.y==y1))
    });
    return (result && result.length) ? result[0] : null;
  };

  this.createCSW = function(x, y, who, num) {
      var c1 = new csw(CONST, bullet);
      c1.init(x, y, who, num, this);
      cswArr.push(c1);
      return c1;
  },
  
  this.deleteCSW = function(x, y){
      var ca = 0;
      while(1) {
          if((cswArr[ca].x==x)&&(cswArr[ca].y==y)){
              cswArr.splice(ca,1);
              break;
          }
          ca++;
          if(ca==cswArr.length){
              break;
          }
      }
  };
  
  // Returns CSW on coords in params
  // old: changeCSW
  // also used instead of checkCSW
  this.getCSW = function(x1, y1) {
      var tArr = cswArr.filter(function(c){
            return (c.x==x1)&&(c.y==y1);
        });
      
      return tArr.length ? tArr[0] : null;
  };
  
  this.destroyAll = function(){
      cswArr = [];
  };
  
  // user
  this.drawcswmt9 = function(x,y) {
    this.drawContext.fillStyle = "#0F0"
    this.drawContext.fillRect((x*20), (y*20), 20, 20);
  };

  // cpu
  this.drawcswmt5 = function(x,y){
    this.drawContext.fillStyle = "#F00";
    this.drawContext.fillRect((x*20), (y*20), 20, 20);
  };
  
  this.DrawBlack = function(x,y){
    this.drawContext.clearRect((x*20), (y*20), 20, 20);
  };
  
  this.DrawCrash = function(x,y){
    this.drawContext.fillStyle = "yellow";
    this.drawContext.fillRect((x*20), (y*20), 20, 20);
  };
  
  this.DrawGameField = function(){
    this.drawContext.strokeStyle = '#000';
    this.drawContext.strokeRect(0,0,420,420);
  };
  
  this.showLogo = function() {
    this.infoContext.fillStyle = "#000";
    this.infoContext.strokeStyle = "#F00";
    this.infoContext.font = "30pt Arial";
    this.infoContext.fillText("Battle Tank!", 0, 30);
  };
  
  this.showNames = function() {
    this.infoContext.fillStyle = "#00f";
    this.infoContext.strokeStyle = "#F00";
    this.infoContext.font = "20pt Arial";
    this.infoContext.fillText("p1 life:", 0, 60);  

    this.infoContext.fillStyle = "#00f";
    this.infoContext.strokeStyle = "#F00";
    this.infoContext.font = "20pt Arial";
    this.infoContext.fillText("cpu life:", 0, 90);
  };
  
  this.showGameOver = function(won) {
    if(won){
      this.drawContext.fillStyle = "#00f";
      this.drawContext.strokeStyle = "#F00";
      this.drawContext.font = "bold 25pt Comic";
      this.drawContext.fillText("YOU WIN", 100, 200);
    }
    else{
      this.drawContext.fillStyle = "#00f";
      this.drawContext.strokeStyle = "#F00";
      this.drawContext.font = "bold 25pt Comic";
      this.drawContext.fillText("GAME OVER", 100, 200);
    }
  };

  this.displayLifeBar = function(player) {
    // TODO: плохо! BTank не должен знать про csw
    if(player.iam){ // player
      this.infoContext.fillStyle = "#FFF";
      this.infoContext.fillRect(100, 40, 200, 20);

      this.infoContext.fillStyle = "#0F0";
      this.infoContext.strokeStyle = "#0F0";
      this.infoContext.strokeRect(100, 40, 200, 20);
      this.infoContext.fillRect(100, 40, 20 * player.life, 20);
    }
    else{
      this.infoContext.fillStyle = "#FFF";
      this.infoContext.fillRect(100, 70, 200, 20);

      this.infoContext.fillStyle = "#F00";
      this.infoContext.strokeStyle = "#F00";
      this.infoContext.strokeRect(100, 70, 200, 20);
      this.infoContext.fillRect(100, 70, 20 * player.life, 20);    
    }
  }
}