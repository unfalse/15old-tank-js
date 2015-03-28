CONST = {
  MAXLIFES: 10,
  MAXSPEED: 1,
  
  COMPUTER: 0,
  USER: 1,
  
  MAXX: 20,
  MAXY: 20,
  BEGX: 20,
  BEGY: 20
}

BTank = {
  cswArr: [],
	drawContext: null,
  infoContext: null,

  checkCSW: function(x,y){
    return 
      cswArr.filter(function(csw){
        return ((csw.x==x)&&(csw.y==y))
      }).length>0;
  },

  changeCSW: function(x1, y1){
      return 
          cswArr.filter(function(csw){
              return ((csw.x==x1)&&(csw.y==y1))
          })[0];
  },

  createCSW: function(x, y, who, num){
      var c1 = new csw();
      c1.init(x,y,who,num);
      this.cswArr.push(c1);
      return c1;
  },
  
  deleteCSW: function(x, y){
      var ca = 0;
      while(1){
          if((this.cswArr[ca].x==x)&&(this.cswArr[ca].y==y)){
              this.cswArr.splice(ca,1);
              break;
          }
          ca++;
          if(ca==this.cswArr.length){
              break;
          }
      }
  },
  
  // Returns CSW on coords in params
  // old: changeCSW
  // also used instead of checkCSW
  getCSW: function(x1, y1){
      var tArr = this.cswArr.filter(function(c){
            return (c.x==x1)&&(c.y==y1);
        });
      
      return tArr.length ? tArr[0] : null;
  },
  
  destroyAll: function(){
      this.cswArr = [];
  },
  
  // user
  drawcswmt9: function(x,y){
    BTank.drawContext.fillStyle = "#0F0"
    BTank.drawContext.fillRect((x*20), (y*20), 20, 20);
  },
  
  // cpu
  drawcswmt5: function(x,y){
    BTank.drawContext.fillStyle = "#F00";
    BTank.drawContext.fillRect((x*20), (y*20), 20, 20);
  },
  
  DrawBlack: function(x,y){
    BTank.drawContext.clearRect((x*20), (y*20), 20, 20);
  },
  
  DrawCrash: function(x,y){
    BTank.drawContext.fillStyle = "yellow";
    BTank.drawContext.fillRect((x*20), (y*20), 20, 20);
  },
  
  DrawGameField: function(){
    BTank.drawContext.strokeStyle = '#000';
    BTank.drawContext.strokeRect(0,0,420,420);
  },
  
  showLogo: function(){
    BTank.infoContext.fillStyle = "#000";
    BTank.infoContext.strokeStyle = "#F00";
    BTank.infoContext.font = "30pt Arial";
    BTank.infoContext.fillText("Battle Tank!", 0, 30);
  },
  
  showNames: function(){
    BTank.infoContext.fillStyle = "#00f";
    BTank.infoContext.strokeStyle = "#F00";
    BTank.infoContext.font = "20pt Arial";
    BTank.infoContext.fillText("p1 life:", 0, 60);  

    BTank.infoContext.fillStyle = "#00f";
    BTank.infoContext.strokeStyle = "#F00";
    BTank.infoContext.font = "20pt Arial";
    BTank.infoContext.fillText("cpu life:", 0, 90);
  },
  
  showGameOver: function(won){
    if(won){
      BTank.drawContext.fillStyle = "#00f";
      BTank.drawContext.strokeStyle = "#F00";
      BTank.drawContext.font = "bold 25pt Comic";
      BTank.drawContext.fillText("YOU WIN", 100, 200);
    }
    else{
      BTank.drawContext.fillStyle = "#00f";
      BTank.drawContext.strokeStyle = "#F00";
      BTank.drawContext.font = "bold 25pt Comic";
      BTank.drawContext.fillText("GAME OVER", 100, 200);
    }
  }
}

// use: new csw()
function csw(){
  var self = this;
  this.b = new bullet();
  this.iam = new players();
  
  this.init = function(mx, my, who, num){
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
  },
    
  this.draw = function(){
    if(self.iam==CONST.USER){
      BTank.drawcswmt9(self.x, self.y)
    }
    else{
      BTank.drawcswmt5(self.x, self.y)
    }
  },
    
  this.erase = function(){
    BTank.DrawBlack(self.x, self.y)  
  },
    
  this.fire = function(){
    if(self.life!=0){
      if(!self.b.isfire){
        self.b.isfire = true;
        self.b.init(self.x, self.y, self.dn);
      }
    }
  }
    
  this.update = function(d, ism){
    var ux = 0;
    var uy = 0;
    var m = true;
    var govno = 0;
        
    if(self.b.isfire){
      // TODO: переписать
      self.b.fly();
    }
        
    if((self.life==0)||(self.life>CONST.MAXLIFES)){
      self.life = 0;
    }
    else{
      if(self.iam==CONST.COMPUTER){
        if(self.speed<CONST.MAXSPEED){
          self.speed++;
          m = false;
        }
        else{
          m = true;
        }
      }

      if(m){
        self.speed = 0;
        if(ism){
          ux = (-(d >> 1)| 1)*((d & 1) ^ 1);
          uy = (-(d >> 1)| 1)*((d & 1) & 1);
          
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
          self.dn = d;
          ism = false;
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
  },
    
  this.displayLife = function(){
    if(self.iam){ // player
      BTank.infoContext.fillStyle = "#FFF";
      BTank.infoContext.fillRect(100, 40, 200, 20);

      BTank.infoContext.fillStyle = "#0F0";
      BTank.infoContext.strokeStyle = "#0F0";
      BTank.infoContext.strokeRect(100, 40, 200, 20);
      BTank.infoContext.fillRect(100, 40, 20 * self.life, 20);
    }
    else{
      BTank.infoContext.fillStyle = "#FFF";
      BTank.infoContext.fillRect(100, 70, 200, 20);

      BTank.infoContext.fillStyle = "#F00";
      BTank.infoContext.strokeStyle = "#F00";
      BTank.infoContext.strokeRect(100, 70, 200, 20);
      BTank.infoContext.fillRect(100, 70, 20 * self.life, 20);    
    }
  }
}

  function bullet(){
    var self = this;
    
    this.init = function(nx,ny,d1){
      self.x = nx;
      self.y = ny;
      self.d = d1;
    };
    
    this.draw = function(){
        // putpixel(x*20+10, y*20+10, yellow)
      BTank.drawContext.fillRect((self.x*20)+8, (self.y*20)+8, 4, 4);
    };
    
    this.erase = function(){
        // putpixel(x*20+10, y*20+10, 0)
      BTank.drawContext.clearRect((self.x*20)+8, (self.y*20)+8, 4, 4);
    };
    
    this.fly = function(){
      var d = self.d;
      var vx = (-(d >> 1)| 1)*((d & 1) ^ 1);
      var vy = (-(d >> 1)| 1)*((d & 1) & 1);
      
      if(self.isfire){
        self.erase();
        self.x = self.x + vx;
        self.y = self.y + vy;
        self.draw();
            
        if((self.x>CONST.MAXX)||(self.x<1)){
            self.isfire = false;
            self.erase();
        }
        
        if((self.y>CONST.MAXY)||(self.y<1)){
            self.isfire = false;
            self.erase();
        }
        
        // TODO: дописать
        if(self.isfire){
          if(BTank.getCSW(self.x, self.y)){
            var vx1 = vx;
            var vy1 = vy;
            vx = 0;
            vy = 0;
            
            var curCSW = BTank.getCSW(self.x, self.y);
            
            if(curCSW.life==0){
              vx = vx1;
              vy = vy1;
            }
            else{
              curCSW.life--;
              curCSW.erase();
              BTank.DrawCrash(curCSW.x, curCSW.y);
              console.log((curCSW.iam?'(1P)':'(CPU)')+'HIT! Life = ', curCSW.life);
            }
            
            // text('HIT!');
            // eraseText('HIT!');
          }
        }
      }
    };
}

function players(){
    
}