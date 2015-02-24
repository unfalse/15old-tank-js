unfalse.stekcosm = {

    MAXLIFES: 10,
    MAXSPEED: 1,
    
    COMPUTER: 0,
    USER: 1,
    
    MAXX: 20,
    MAXY: 20,
    BEGX: 20,
    BEGY: 20,

    cswArr:[],

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
            return (c.x==x1)&&(c./destary==y1);
        });
    },
    
    destroyAll: function(){
        this.cswArr = [];
    }
}

function csw(){
    var self = this;
    this.b = new bullet();
    this.iam = new players();
    
    this.init = function(mx, my, who, num){
        self.x = mx;
        self.y = my;
        self.pow = 5;
        self.life = unfalse.MAXLIFES;
        self.dn = 0; // { 0 - right< , 1 - down^, 2 - left>, 3 - up }
        self.b.isfire = false;
        self.iam = who;
        self.speed = 0;
        // draw;
        self.n = num;
    }
    
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
        
        if((self.life==0)||(self.life>unfalse.stekcosm.MAXLIFES)){
            self.life = 0;
        }
        else{
            if(self.iam==unfalse.stekcosm.COMPUTER){
                if(self.speed<unfalse.stekcosm.MAXSPEED){
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
                    
                    if(((self.x+ux)>unfalse.stekcosm.MAXX)||((self.x+ux)<1)){
                        ux = 0;
                    }
                    
                    if(((self.y+uy)>unfalse.stekcosm.MAXY)||((self.y+uy)<1)){
                        uy = 0;
                    }
                    
                    if((ux!=0)||(uy!=0)){
                        if(checkcsw(self.x+ux, self.y+uy)){
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
                    if(self.life>unfalse.stekcosm.MAXLIFES){
                        self.life = 0;
                    }
                }
            }
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
    
    this.draw = function(x,y){
        // putpixel(x*20+10, y*20+10, yellow)
    };
    
    this.erase = function(x,y){
        // putpixel(x*20+10, y*20+10, 0)
    };
    
    this.fly = function(){
        var vx = (-(d >> 1)| 1)*((d & 1) ^ 1);
        var vy = (-(d >> 1)| 1)*((d & 1) & 1);
        if(self.isfire){
            // self.erase();
            self.x = self.x + vx;
            self.y = self.y + vy;
            // self.draw();
            
            if((self.x>Maxx)||(x<1)){
                self.isfire = false;
            }
            
            if((self.y>Maxy)||(y<1)){
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
