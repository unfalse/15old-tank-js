console.log("editor!");

BattleTankGame.deps.editor = class {
    constructor(CONST, obstacle, staticShip, spaceBrick) {
        this.CONST = CONST;
        this.obstacle = obstacle;
        this.staticShip = staticShip;
        this.spaceBrick = spaceBrick;
    }

    init(BTankInst) {
        this.BTankInst = BTankInst;

        this.editorBlock = document.querySelector("#editorBlock");
        this.editorCurrentObject = document.querySelector(
            "#editorCurrentObject"
        );
        this.editorPlayBtn = document.querySelector("#editorPlayBtn");
        this.editorSaveBtn = document.querySelector("#editorSaveBtn");
        this.editorLoadBtn = document.querySelector("#editorLoadBtn");
        window.__editor_load_str = "";

        this.editorCurrentObjectBrush = {
            type: this.CONST.TYPES.OBSTACLE,
            imageUrl: "url('images/obstacle2.png')",
        };
        this.editorMode = false;
        this.editorUnits = [];

        this.editorPlayBtn.addEventListener(
            "click",
            this.playTheEditorLevel.bind(this)
        );

        this.editorSaveBtn.addEventListener(
            "click",
            this.saveTheEditorLevel.bind(this)
        );

        this.editorLoadBtn.addEventListener(
            "click",
            this.loadTheEditorLevel.bind(this)
        );
    }

    playTheEditorLevel() {
        const player = this.BTankInst.getAllShips()[0];
        this.BTankInst.destroyAll();

        // TODO: add player1 to the empty array
        this.BTankInst.addShip(player);
        this.editorUnits.forEach(function (unit) {
            if (unit.type === this.CONST.TYPES.SHIP) {
                this.BTankInst.createCSW(unit.x, unit.y, this.CONST.COMPUTER, 0);
            }
            if (unit.type === this.CONST.TYPES.OBSTACLE) {
                this.BTankInst.createCSW(
                    unit.x,
                    unit.y,
                    this.CONST.COMPUTER,
                    0,
                    this.CONST.TYPES.OBSTACLE
                );
            }
            if (unit.type === this.CONST.TYPES.SPACEBRICK) {
                this.BTankInst.createCSW(
                    unit.x,
                    unit.y,
                    this.CONST.COMPUTER,
                    0,
                    this.CONST.TYPES.SPACEBRICK
                );
            }
        }, this);

        this.toggleEditorControls();
    }

    saveTheEditorLevel() {
        window.__editor_save_str = this.editorUnits.reduce(function (
            prev,
            curr
        ) {
            return prev + curr.type + "," + curr.x + "," + curr.y + "|";
        },
        "");
    }

    loadTheEditorLevel() {
        window.__editor_load_str =
            "1,0,480|1,40,480|1,80,480|1,120,480|1,120,440|1,120,400|1,120,360|1,120,320|1,280,280|1,320,280|1,360,280|1,520,200|1,560,200|1,600,200|1,640,200|1,360,400|1,400,400|1,440,400|1,480,400|1,640,320|1,640,360|1,640,400|1,680,400|1,720,400|1,760,400|1,800,200|1,840,200|1,880,200|1,880,160|1,920,160|1,920,120|1,920,80|1,320,120|1,360,120|1,400,120|1,440,120|2,160,440|2,160,400|2,200,400|2,240,400|2,280,400|2,320,400|2,280,440|2,240,440|2,240,480|2,280,480|2,320,480|2,320,520|2,360,520|2,400,520|2,520,400|2,560,400|2,600,400|2,600,360|2,600,320|2,560,320|2,560,360|2,560,440|2,560,480|2,600,480|2,600,440|2,520,440|2,480,440|2,360,440|2,320,440|2,760,440|2,800,440|2,840,440|2,840,400|2,880,440|2,920,440|2,920,400|2,960,400|2,960,440|2,880,400|2,880,360|2,920,360|2,960,360|2,960,320|2,400,280|2,440,280|2,440,240|2,480,240|2,480,200|2,440,200|2,400,240|2,400,200|2,360,200|2,680,200|2,720,200|2,760,200|2,920,200|2,960,200|2,960,160|2,960,120|2,960,80|2,120,280|2,80,280|2,40,280|2,40,240|2,40,200|2,80,240|2,120,240|2,120,200|2,280,120|2,240,120|2,200,120|2,200,160|2,160,160|1,160,200|1,160,240|1,200,240|1,200,200|1,480,520|1,520,520|1,520,560|1,560,560|1,600,560|0,760,40|0,720,40|0,680,40|0,640,40|0,600,40|0,560,40|0,520,40|0,480,40|0,440,40|0,400,40|0,360,40|0,320,40|0,280,40|0,240,40|0,200,40|0,200,80|0,160,80|0,120,80|0,120,40|0,80,40|0,40,40|0,40,0|0,0,0|0,80,0|0,120,0|0,160,40|0,200,0|0,240,0|0,280,0|0,320,0|0,360,0|0,400,0|0,440,0|0,480,0|0,520,0|0,560,0|0,600,0|0,640,-40|0,680,-40|0,680,0|0,720,0|0,760,0|0,800,0|0,840,0|0,880,0|0,920,0|0,960,0|0,960,40|0,920,40|0,880,40|0,840,40|0,800,40|0,640,0|0,400,80|0,360,80|0,320,80|0,280,80|0,240,80|0,440,80|0,480,80|0,520,80|0,560,80|0,600,80|0,640,80|0,680,80|0,720,80|0,760,80|0,800,80|0,840,80|0,NaN,NaN|2,320,680|2,320,640|2,360,640|2,360,600|2,400,600|2,440,600|2,480,600|2,480,640|2,520,640|2,520,680|2,560,680|2,480,680|2,520,600|2,560,640|2,440,640|2,400,640|2,400,680|2,360,680|2,440,680|";
        //"1,320,200|1,320,160|1,320,120|1,360,120|1,360,80|1,400,80|1,440,80|1,480,80|1,480,120|1,520,120|1,520,160|1,520,200|1,520,240|1,480,240|1,480,280|1,440,280|1,400,280|1,360,280|1,360,240|1,320,240|0,400,120|0,400,160|0,440,160|0,440,120|0,480,160|0,480,200|0,440,200|0,400,200|0,360,200|0,360,160|0,400,240|0,440,240|";
        window.__editor_load_str.split("|").forEach(function (objStr) {
            var fields = objStr.split(",");
            this.createEditorUnit(+fields[1], +fields[2], +fields[0]);
        }, this);
    }

    createEditorUnit(x, y, type) {
        let newUnit = null;
        const who = this.CONST.COMPUTER;
        if (
            this.editorUnits.some(function (unit) {
                return unit.x === x && unit.y === y;
            })
        ) {
            return;
        }
        if (type === this.CONST.TYPES.OBSTACLE) {
            newUnit = new this.obstacle(this.CONST);
            newUnit.init(x, y, who, this.BTankInst);
            this.editorUnits.push(newUnit);
        }
        if (type === this.CONST.TYPES.SHIP) {
            newUnit = new this.staticShip(this.CONST, this.bullet);
            newUnit.init(x, y, who, this.BTankInst);
            this.editorUnits.push(newUnit);
        }
        if (type === this.CONST.TYPES.SPACEBRICK) {
            newUnit = new this.spaceBrick(this.CONST, this.bullet);
            newUnit.init(x, y, who, this.BTankInst);
            this.editorUnits.push(newUnit);
        }
    }

    removeEditorObjectAt(x, y) {
        this.editorUnits = this.editorUnits.filter(function (unit) {
            return !(unit.x === x && unit.y === y);
        });
    }

    setCurrentEditorBrushObject(brushObjectType) {
        switch (brushObjectType) {
            case this.CONST.TYPES.SHIP: {
                this.editorCurrentObjectBrush = {
                    type: brushObjectType,
                    imageUrl: "url('images/csw-mt5bigger2x_0.png')",
                };
                break;
            }
            case this.CONST.TYPES.OBSTACLE: {
                this.editorCurrentObjectBrush = {
                    type: brushObjectType,
                    imageUrl: "url('images/obstacle2.png')",
                };
                break;
            }
            case this.CONST.TYPES.SPACEBRICK: {
                this.editorCurrentObjectBrush = {
                    type: brushObjectType,
                    imageUrl: "url('images/space_brick-0.png')",
                };
                break;
            }
            case this.CONST.TYPES.ERASER: {
                this.editorCurrentObjectBrush = {
                    type: brushObjectType,
                    imageUrl: "",
                };
                break;
            }
            default:
                break;
        }
        this.editorCurrentObject.style.backgroundImage = this.editorCurrentObjectBrush.imageUrl;
    }

    toggleEditorControls() {
        this.editorMode = !this.editorMode;
        const gameInfo = this.BTankInst.gameInfo;
        if (this.editorMode) {
            gameInfo.style.display = "none";

            this.editorBlock.style.display = "flex";
            this.editorBlock.style.justifyContent = "center";

            this.editorCurrentObject.style.backgroundImage = this.editorCurrentObjectBrush.imageUrl;
            this.editorCurrentObject.style.width = "40px";
            this.editorCurrentObject.style.height = "40px";
        } else {
            gameInfo.style.display = "";
            gameInfo.style.textAlign = "center";
            this.editorBlock.style.display = "none";
        }
    }
};
