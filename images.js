console.log("bulletPixel!");
BattleTankGame.deps.images = function (BTankInst, src) {
    this.image = new Image();
    this.loaded = false;

    this.init = function (src) {

        this.image.addEventListener(
            "load",
            function () {
                this.loaded = true;
            }.bind(this),
            false
        );

        this.image.src = src;
    };

    this.draw = function (x, y, delayParam, onDelayEnd) {
        const delay = delayParam || 0;
        if (this.loaded) {
            let startTime = 0;

            const delayedDraw = function (timestamp) {
                if (!startTime) startTime = timestamp;
            
                const timePassed = timestamp - startTime;
            
                BTankInst.drawContext.drawImage(this.image, x, y);
            
                if (delay > 0 && timePassed <= delay) {
                    window.requestAnimationFrame(delayedDraw.bind(this));
                } else {
                    if (onDelayEnd) onDelayEnd();
                }
            };

            delayedDraw.call(this, 0);
        }
    };

    this.init(src);
};
