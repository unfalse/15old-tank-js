GAME = {
    mainIntervalId: null,
    speed: 80,
    stop: false,
    key: null,
    cpuKey: null,
	player1: null,
	cpu: null,

    start: function(){
		//ShowHelp();
		//text('Battle Tank!');
		var gameField = document.getElementById('gameField');
		BTank.drawContext = gameField.getContext('2d');
		this.player1 = BTank.createCSW(1, 1, CONST.USER, 1);
		this.cpu = BTank.createCSW(5, 4, CONST.COMPUTER, 1);
		this.stop = false;
		document.addEventListener("keydown", this.readKeys);
		this.mainIntervalId = setInterval(this.mainCycle, this.speed);
	},

	mainCycle: function(){
		this.player1.update(this.key);

		this.cpuKey = random(4);
		this.cpu.update(this.cpuKey);

		this.player1.displayLife();
		this.cpu.displayLife();

		if(this.player1.life==0){
			text('GAME OVER');
			this.stop = true;
		}

		if(this.cpu.life<=0){
			text('YOU WIN');
			this.stop = true;
		}

		if(this.stop){
			clearInterval(this.mainIntervalId);
		}
	},

	readKeys: function(event){
		this.key = Utils.getChar(event);
	}
}
