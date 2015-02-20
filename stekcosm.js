unfalse.stekcosm = {

    MAXLIFES: 10,
    MAXSPEED: 1,

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
        
    };
}

function players(){
    
}
