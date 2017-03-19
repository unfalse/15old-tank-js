// use: new csw()
function csw(){
  var self = this;
  this.b = new bullet();
  this.iam = new players();
  this.btank = null;
  
  this.init = function(mx, my, who, num, BTankInst){
      self.x = mx;
      self.y = my;
      self.pow = 5;
      self.life = CONST.MAXLIFES;
      self.dn = 0; // { 0 - right< , 1 - down^, 2 - left>, 3 - up }
      self.b.isfire = false;
      self.iam = who;
      self.speed = 0;
      // draw;
      self.n = num;
      self.btank = BTankInst;
  },
    
  this.draw = function(){
    if(self.iam==CONST.USER){
      self.btank.drawcswmt9(self.x, self.y)
    }
    else{
      self.btank.drawcswmt5(self.x, self.y)
    }
  },
    
  this.erase = function(){
    self.btank.DrawBlack(self.x, self.y)  
  },
    
  this.fire = function(){
    if(self.life!=0){
      if(!self.b.isfire){
        self.b.isfire = true;
        self.b.init(self.x, self.y, self.dn, self);
      }
    }
  }
    
  this.update = function(direction, isMoving){
    var ux = 0;
    var uy = 0;
    var makeMove = true;
        
    if(self.b.isfire){
      // TODO: переписать
      // объект "пуля" летит благодаря функции "танка" update.
      // Если танка не будет, пуля перестанет лететь.
      // Нужно завести отдельный массив пуль.
      self.b.fly();
    }
        
    if((self.life==0)||(self.life>CONST.MAXLIFES)){
      self.life = 0;
    }
    else{
      //if(self.iam==CONST.COMPUTER){
        if(self.speed<CONST.MAXSPEED){
          self.speed++;
          makeMove = false;
        }
        else{
          makeMove = true;
        }
      //}

      if(makeMove){
        self.speed = 0;
        if(isMoving){
          ux = (-(direction >> 1)| 1)*((direction & 1) ^ 1);
          uy = (-(direction >> 1)| 1)*((direction & 1) & 1);
          
          if(((self.x+ux)>CONST.MAXX)||((self.x+ux)<0)){
            ux = 0;
          }
            
          if(((self.y+uy)>CONST.MAXY)||((self.y+uy)<0)){
            uy = 0;
          }

          if((ux!=0)||(uy!=0)){
            if(BTank.getCSW(self.x+ux, self.y+uy)){
              ux = 0;
              uy = 0;
              // SetColor(black);
              // outtextxy(self.x*20+40,self.y*20,'*');
              // setcolor(random(16));
              // outtextxy(self.x*20+40,self.y*20,'*');
            }
          }

          self.erase();
          self.x = self.x + ux;
          self.y = self.y + uy;
          
          self.draw();
          self.dn = direction;
          isMoving = false;
          if(self.life>CONST.MAXLIFES){
            self.life = 0;
          }
        }
      }
    }
        
    if(self.life>0){
      self.draw();
    }
  },
    
  this.destroy = function(){
    // erase();
  }

}

function players() {

}