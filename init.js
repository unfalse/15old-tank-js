const BattleTankGame = {
    deps: {}
};
BattleTankGame.deps.baseCoordinates = function () {
    this.x = 0;
    this.y = 0;
    this.d = 0;
};

BattleTankGame.deps.baseCoordinates.prototype.getVXY = function (d) {
    // returns direction where to go
    return {
        vx: (-(d >> 1) | 1) * ((d & 1) ^ 1),
        vy: (-(d >> 1) | 1) * (d & 1 & 1),
    };
};

BattleTankGame.deps.baseCoordinates.prototype.initCoords = function (
    nx,
    ny,
    nd
) {
    //x: 0, // x coordinate
    //y: 0, // y coordinate
    //d: 0,  // direction { 0 - right< , 1 - down^, 2 - left>, 3 - up }

    this.x = nx;
    this.y = ny;
    this.d = nd;
};