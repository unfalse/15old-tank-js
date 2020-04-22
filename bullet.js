console.log('bullet!');
BattleTankGame.deps.bullet = function(CONST, BTankInst){
    // var self = this;
    this.steps = 0;
    //this.STEPSTOMOVE = 8;
    this.STEPSTOMOVE = 5;
    
    this.init = function(nx,ny,nd,parentTank){
        this.__proto__.init.call(this, nx, ny, nd);
        this.parentTank = parentTank;
    };

    this.draw = function(){
        BTankInst.drawContext.fillRect((this.x*20)+8, (this.y*20)+8, 4, 4);
    };

    this.erase = function(){
        BTankInst.drawContext.clearRect((this.x*20)+8, (this.y*20)+8, 4, 4);
    };

    this.fly = function(){
        var nvxy = this.getVXY(this.d);
        var vx = nvxy.vx;
        var vy = nvxy.vy;
        var makeMove = false;
        
        // TODO: дописать
        // Проверка попадания в танк
        if(this.isfire) {
            // TODO: убрать сильную связанность с BTank
            var curCSW = BTankInst.getCSW(this.x, this.y);
            if(curCSW && curCSW!=this.parentTank){
                var vx1 = vx;
                var vy1 = vy;
                vx = 0;
                vy = 0;

                if(curCSW.life==0){
                    vx = vx1;
                    vy = vy1;
                }
                else {
                    curCSW.life--;
                    curCSW.erase();
                    BTankInst.DrawCrash(curCSW.x, curCSW.y);
                    this.isfire = false;
                    //console.log((curCSW.iam?'(1P)':'(CPU)')+'HIT! Life = ', curCSW.life);
                }            
            }
        }

        // TODO: добавить поле MaxSpeed в класс bullet и использовать
        // вместо MAXSPEED. Переименовать в StepsToGo
        // Поле speed переименовать в steps
        if(this.steps < this.STEPSTOMOVE){
            this.steps++;
            makeMove = false;
        }
        else{
            makeMove = true;
        }

        if(this.isfire && makeMove){
            this.steps = 0;
            this.erase();
            this.x = this.x + vx;
            this.y = this.y + vy;
            
            if((this.x>CONST.MAXX)||(this.x<0)){
                this.isfire = false;
            }
        
            if((this.y>CONST.MAXY)||(this.y<0)){
                this.isfire = false;
            }
        }

        if(this.isfire) {
            this.draw();
        }
        
    };
}
BattleTankGame.deps.bullet.prototype = BattleTankGame.deps.baseCoordinates;