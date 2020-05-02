console.log('csw!');
// TODO: csw: cosmo ship war, the old title
// TODO: rename csw to something more understandable - tank?
BattleTankGame.deps.csw = function (CONST, bullet) {
  // var self = this;
  
  this.iam = new players();
  this.btank = null;
  this.lastBulletTimeStamp = 0;
  
  // TODO: place code from init above!
  this.init = function(mx, my, who, num, BTankInst){
      this.__proto__.init.call(this, mx, my, 0);
      this.pow = 5;
      this.life = CONST.MAXLIFES;
      // this.dn = 0; // { 0 - right< , 1 - down^, 2 - left>, 3 - up }
      this.iam = who;
      this.speed = 0; // make speed more precise
                      // rename speed variable
      // draw;
      this.n = num;
      this.btank = BTankInst;
      // this.b = new bullet(CONST, BTankInst);
      // this.b.isfire = false;
      this.bulletsCount = 0;
      this.bulletsArray = [];
      for(var bc = 0; bc < CONST.MAXBULLETS; bc++) {
        const newBullet = new bullet(CONST, BTankInst);
        newBullet.init(mx, my, 0, this, bc);
        this.bulletsArray.push(newBullet);
      }
  };
    
  this.draw = function(){
    if(this.iam===CONST.USER){
      this.btank.drawcswmt9(this.x, this.y)
    }
    else{
      this.btank.drawcswmt5(this.x, this.y)
    }
  };
    
  this.erase = function(){
    this.btank.DrawBlack(this.x, this.y)  
  };

  this.createNewBullet = function(startX, startY, startD) {
    const freeBullet = this.bulletsArray.find(b => !b.isfire);

    // if (this.iam !== CONST.COMPUTER) console.log(freeBullet);

    if (freeBullet) {

      // if (this.iam !== CONST.COMPUTER) console.log(['setCoords!', startX, startY, startD]);
    
      freeBullet.setCoords(startX, startY, startD);
      freeBullet.isfire = true;
    }
  }

  this.fire = function(timestamp) {
      // if (this.iam !== CONST.COMPUTER) console.log(['timestamp, lastBulletTimestamp: ', timestamp, this.lastBulletTimeStamp, timestamp - this.lastBulletTimeStamp]);
      if (timestamp - this.lastBulletTimeStamp >= 100) {
        this.lastBulletTimeStamp = timestamp;
        this.createNewBullet(this.x, this.y, this.d);
      }
  }
    
  this.updateBullets = function() {
    this.bulletsArray.forEach(b => {
      if (b.isfire) {
        // if (this.iam !== CONST.COMPUTER) console.log('b.fly!');
        b.fly();
      }
    });
  }

  // TODO: remove this function and use only update
  this.move = function(direction) {
    if(this.speed < CONST.MAXSPEED){
      this.speed++;
      return;
    }
    var ux = 0;
    var uy = 0;
    this.speed = 0;
    // if(this.speed < CONST.MAXSPEED){
    //   this.speed++;
    // }
    var ux = (-(direction >> 1)| 1)*((direction & 1) ^ 1);
    var uy = (-(direction >> 1)| 1)*((direction & 1) & 1);

    if(((this.x+ux)>CONST.MAXX)||((this.x+ux)<0)){
      ux = 0;
    }
      
    if(((this.y+uy)>CONST.MAXY)||((this.y+uy)<0)){
      uy = 0;
    }

    if((ux!=0)||(uy!=0)){
      if(this.btank.getCSW(this.x+ux, this.y+uy)){
        ux = 0;
        uy = 0;
      }
    }

    this.erase();
    this.x = this.x + ux;
    this.y = this.y + uy;
    
    this.draw();
    this.d = direction;

    // if(this.life>0){
      // this.draw();
    // }
  }

  this.update = function(direction, isMoving){
    var ux = 0;
    var uy = 0;
    var makeMove = true;

    // if (this.iam !== CONST.COMPUTER) console.log('update!');
    this.updateBullets();
    
    if (this.iam === CONST.COMPUTER) {

      //if(self.iam==CONST.COMPUTER){
        if(this.speed < CONST.MAXSPEED){
          this.speed++;
          makeMove = false;
        }
        else {
          makeMove = true;
        }
      //}

      if(makeMove){
        this.speed = 0;
        if(isMoving){
          ux = (-(direction >> 1)| 1)*((direction & 1) ^ 1);
          uy = (-(direction >> 1)| 1)*((direction & 1) & 1);
          
          if(((this.x+ux)>CONST.MAXX)||((this.x+ux)<0)){
            ux = 0;
          }
            
          if(((this.y+uy)>CONST.MAXY)||((this.y+uy)<0)){
            uy = 0;
          }

          if((ux!=0)||(uy!=0)){
            if(this.btank.getCSW(this.x+ux, this.y+uy)){
              ux = 0;
              uy = 0;
            }
          }

          this.erase();
          this.x = this.x + ux;
          this.y = this.y + uy;
          
          this.draw();
          this.d = direction;
          isMoving = false;
        }
      }
  }
      this.draw();
  },
    
  this.destroy = function(){
    // erase();
  }

}
BattleTankGame.deps.csw.prototype = BattleTankGame.deps.baseCoordinates;

function players() {

}