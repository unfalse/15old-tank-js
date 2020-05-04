const BattleTankGame = {
    deps: {
        baseCoordinates: {
            //x: 0, // x coordinate
            //y: 0, // y coordinate
            //d: 0,  // direction (0/1/2/3)
            getVXY: function (d) {
                // returns direction where to go
                return {
                    vx: (-(d >> 1) | 1) * ((d & 1) ^ 1),
                    vy: (-(d >> 1) | 1) * (d & 1 & 1),
                };
            },
            initCoords: function (nx, ny, nd) {
                this.x = nx;
                this.y = ny;
                this.d = nd;
            },
        },
    },
};
