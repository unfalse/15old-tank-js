// Использовать вместо функций паттерн IIFE
function bullet(){
    var self = this;
    self.steps = 0;
    self.STEPSTOMOVE = 8;
    
    this.init = function(nx,ny,d1,parentTank){
        self.x = nx;
        self.y = ny;
        self.d = d1;
        self.parentTank = parentTank;
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
        var makeMove = false;
        
        // TODO: дописать
        // Проверка попадания в танк
        if(self.isfire){
            // TODO: убрать сильную связанность с BTank
            var curCSW = BTank.getCSW(self.x, self.y);
            if(curCSW && curCSW!=self.parentTank){
                var vx1 = vx;
                var vy1 = vy;
                vx = 0;
                vy = 0;

                if(curCSW.life==0){
                    vx = vx1;
                    vy = vy1;
                }
                else{
                    curCSW.life--;
                    curCSW.erase();
                    BTank.DrawCrash(curCSW.x, curCSW.y);
                    self.isfire = false;
                    //console.log((curCSW.iam?'(1P)':'(CPU)')+'HIT! Life = ', curCSW.life);
                }
            
            // text('HIT!');
            // eraseText('HIT!');
            }
        }

        // TODO: добавить поле MaxSpeed в класс bullet и использовать
        // вместо MAXSPEED. Переименовать в StepsToGo
        // Поле speed переименовать в steps
        if(self.steps < self.STEPSTOMOVE){
            self.steps++;
            makeMove = false;
        }
        else{
            makeMove = true;
        }

        if(self.isfire && makeMove){
            self.steps = 0;
            self.erase();
            self.x = self.x + vx;
            self.y = self.y + vy;
            
            if((self.x>CONST.MAXX)||(self.x<0)){
                self.isfire = false;
            }
        
            if((self.y>CONST.MAXY)||(self.y<0)){
                self.isfire = false;
            }
        }

        if(self.isfire) {
            self.draw();
        }
        
    };
}