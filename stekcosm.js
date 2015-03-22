CONST ={
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
        this.cswArr.filter(function(c){
            return (c.x==x1)&&(c.y==y1);
        });
    },
    
    destroyAll: function(){
        this.cswArr = [];
    },

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
                // drawcswmt9(self.x-1, self.y-1)
            }
            else{
                // drawcswmt5(self.x-1, self.y-1)
            }
        },
        
        this.erase = function(){
          // DrawBlack(self.x-1, self.y-1)  
        },
        
        this.fire = function(){
            if(life!=0){
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
                self.fly();
            }
            
            if((self.life==0)||(self.life>CONST.MAXLIFES)){
                self.life = 0;
            }
            else{
                if(self.iam==CONST.COMPUTER){
                    if(self.speed<CONST.MAXSPEED){
                        speed++;
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
                        
                        if(((self.x+ux)>CONST.MAXX)||((self.x+ux)<1)){
                            ux = 0;
                        }
                        
                        if(((self.y+uy)>CONST.MAXY)||((self.y+uy)<1)){
                            uy = 0;
                        }
                        
                        if((ux!=0)||(uy!=0)){
                            if(getCSW(self.x+ux, self.y+uy)){
                                ux = 0;
                                uy = 0;
                                // SetColor(black);
                                // outtextxy(self.x*20+40,self.y*20,'*');
                                // setcolor(random(16));
                                // outtextxy(self.x*20+40,self.y*20,'*');
                            }
                        }
                        
                        //erase();
                        self.x = self.x + ux;
                        self.y = self.y + uy;
                        
                        //draw();
                        self.dn = d;
                        ism = false;
                        if(self.life>CONST.MAXLIFES){
                            self.life = 0;
                        }
                    }
                }
            }
        },
        
        this.destroy(){
            // erase();
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
            var vx = (-(d >> 1)| 1)*((d & 1) ^ 1);
            var vy = (-(d >> 1)| 1)*((d & 1) & 1);
            if(self.isfire){
                self.erase();
                self.x = self.x + vx;
                self.y = self.y + vy;
                self.draw();
                
                if((self.x>CONST.MAXX)||(x<1)){
                    self.isfire = false;
                }
                
                if((self.y>CONST.MAXY)||(y<1)){
                    self.isfire = false;
                }
                
                // TODO: дописать
                if(isfire){
                    //if(check
                }
            }
        };
    }

    function players(){
        
    }
}
