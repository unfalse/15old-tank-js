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
            
            if((self.x>CONST.MAXX)||(self.x<0)){
                self.isfire = false;
            }
        
            if((self.y>CONST.MAXY)||(self.y<0)){
                self.isfire = false;
            }

            if(self.isfire) {
                self.draw();
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
                    //console.log((curCSW.iam?'(1P)':'(CPU)')+'HIT! Life = ', curCSW.life);
                }
                
                // text('HIT!');
                // eraseText('HIT!');
                }
            }
        }
    };
}