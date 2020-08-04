console.log("images!");

// BattleTankGame.deps.images = function (BTankInst, src, onLoadHandler) {
BattleTankGame.deps.images = class {
    constructor(BTankInst, src, onLoadHandler) {
        this.image = new Image();
        this.loaded = false;
        this.BTankInst = BTankInst;

        this.init(src, onLoadHandler);
    }

    init(src, onLoadHandler) {
        this.image.addEventListener(
            "load",
            function () {
                this.loaded = true;
                console.log(src + " has loaded!");
                onLoadHandler();
            }.bind(this),
            false
        );

        this.image.src = src;
    }

    draw(x, y, dw, dh, delayParam, onDelayEnd) {
        // const delay = delayParam || 0;
        if (this.loaded) {
            this.BTankInst.drawContext.drawImage(this.image, x, y, dw, dh);
            // let startTime = 0;

            // const delayedDraw = function (timestamp) {
            //     if (!startTime) startTime = timestamp;

            //     const timePassed = timestamp - startTime;

            //     this.BTankInst.drawContext.drawImage(this.image, x, y);

            //     if (delay > 0 && timePassed <= delay) {
            //         console.log('req!');
            //         window.requestAnimationFrame(delayedDraw.bind(this));
            //     } else {
            //         if (onDelayEnd) onDelayEnd();
            //     }
            // };

            // delayedDraw.call(this, 0);
        }
    }
};

BattleTankGame.deps.images.loadImage = function (imagePath, onLoad) {
    return new Promise(
        function (resolve) {
            onLoad.call(
                this,
                new this.images(this, imagePath, function () {
                    resolve();
                })
            );
        }.bind(this)
    );
};

BattleTankGame.deps.images.loadManyImages = function (
    imagePaths,
    targetImages
) {
    return new Promise((allResolved) => {
        const ps = imagePaths.map(
            (ip) =>
                new Promise((resolve) => {
                    const newImage = new this.images(this, ip, function () {
                        resolve(newImage);
                    });
                })
        );
        Promise.all(ps).then((images) => {
            images.forEach((im, i) => {
                targetImages[i] = im;
            });
            allResolved();
        });
    });
};
