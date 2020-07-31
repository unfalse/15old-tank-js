console.log("utils!");
BattleTankGame.deps.utils = new (function () {

    this.KEY_CODE = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        a_KEY: 65,
        s_KEY: 83,
        F1_KEY: 112,
        N1_KEY: 49,
        N2_KEY: 50,
        N3_KEY: 51,
        N4_KEY: 52,
        N5_KEY: 53,
        N6_KEY: 54
    };

    // event.type должен быть keypress
    this.getChar = function (event) {
        if (event.which == null) {
            // IE
            if (event.keyCode < 32) return null; // спец. символ
            return String.fromCharCode(event.keyCode);
        }

        if (event.which != 0 && event.charCode != 0) {
            // все кроме IE
            if (event.which < 32) return null; // спец. символ
            return String.fromCharCode(event.which); // остальные
        }

        return null; // спец. символ
    };

    // использование Math.round() даст неравномерное распределение!
    this.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    this.text = function (str) {
        console.log(str);
    };
})();
