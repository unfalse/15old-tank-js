const BattleTankGame = {
    deps: {},
};
// BattleTankGame.deps.baseCoordinates = function () {
BattleTankGame.deps.baseCoordinates = class {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.d = 0;
    }

    getVXY(d) {
        // returns direction where to go
        return {
            vx: (-(d >> 1) | 1) * ((d & 1) ^ 1),
            vy: (-(d >> 1) | 1) * (d & 1 & 1),
        };
    }

    //   >  0 - right
    //   v  1 - down
    //   <  2 - left
    //   ^  3 - up
    getVXYAndAngle(d) {
        const mapDirections = {
            0: { vx: 1, vy: 0, angle: 90 },
            1: { vx: 0, vy: 1, angle: 180 },
            2: { vx: -1, vy: 0, angle: 270 },
            3: { vx: 0, vy: -1, angle: 0 },
        };
        return mapDirections[d];
    }

    initCoords(nx, ny, nd) {
        //x: 0, // x coordinate
        //y: 0, // y coordinate
        //d: 0,  // direction { 0 - right > , 1 - down v, 2 - left <, 3 - up ^ }

        this.x = nx;
        this.y = ny;
        this.d = nd;
    }
};
