console.log("images!");

BattleTankGame.deps.images = function (BTankInst, src, onLoadHandler) {
    this.image = new Image();
    this.loaded = false;
    this.BTankInst = BTankInst;

    this.init(src, onLoadHandler);
};

BattleTankGame.deps.images.prototype.init = function (src, onLoadHandler) {
    this.image.addEventListener(
        "load",
        function () {
            this.loaded = true;
            console.log(src + ' has loaded!');
            onLoadHandler();
        }.bind(this),
        false
    );

    this.image.src = src;
};

BattleTankGame.deps.images.prototype.draw = function (
    x,
    y,
    delayParam,
    onDelayEnd
) {
    const delay = delayParam || 0;
    if (this.loaded) {
        let startTime = 0;

        const delayedDraw = function (timestamp) {
            if (!startTime) startTime = timestamp;

            const timePassed = timestamp - startTime;

            this.BTankInst.drawContext.drawImage(this.image, x, y);

            if (delay > 0 && timePassed <= delay) {
                window.requestAnimationFrame(delayedDraw.bind(this));
            } else {
                if (onDelayEnd) onDelayEnd();
            }
        };

        delayedDraw.call(this, 0);
    }
};
