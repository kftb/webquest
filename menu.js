Game.Menu = function (game) {
this.fadeGraphic = null
};

Game.Menu.prototype = {

	create: function() {
		spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spacebar.onDown.add(function() {
			this.startGame();
			//console.log("triggered");
		}, this);

		this.playMusic();

		var logo = game.add.sprite(0, 0, 'title');
		//logo.anchor.setTo(0.5, 0.5);
		logo.alpha = 0;
		game.add.tween(logo).to({ alpha: 1 }, 1000, Phaser.Easing.Bounce.Out), 3500, Phaser.Easing.Linear.None, true, 500, 0, true;

		if (savegame.exists()) {
		var label = game.add.text(w/2, h-200, 'Continue', {font: "40px VT323", fill: "#7a5638", align: "center"});
		var info = game.add.text(w/2, h-60, 'Press Spacebar to continue', {font: "20px VT323", fill: "#7a5638", align: "center"});
		var version = game.add.text(w*0.94, h*0.95, globalVersionNr, {font: "20px VT323", fill: "#7a5638", align: "center"});
		version.alpha = 0.7;

	} else {
		var label = game.add.text(w/2, h-200, 'New Game', {font: "40px VT323", fill: "#7a5638", align: "center"});
		var info = game.add.text(w/2, h-60, 'Press Spacebar to start a new game', {font: "20px VT323", fill: "#7a5638", align: "center"});

	}
		info.anchor.setTo(0.5, 0.5);
		label.anchor.setTo(0.5, 0.5);
		//label.alpha = 0;
		game.add.tween(logo).delay(5000).to({ alpha: 1}, 3000).start();
		game.add.tween(label).to({alpha: 0.5}, 2000).to({alpha: 1}, 2000).loop().start();

		//this.sound_toggle = this.game.add.button(w-50, 50, 'sound', this.toggle_sound, this);
		//this.sound_toggle.anchor.setTo(1, 0);
		//this.sound_toggle.alpha = 0;
	},

	update: function() {

	},

	playMusic: function() {
		if(window.music && window.music.name == "title") {
			return;
		} else if(window.music) {
			music.stop();
		}

		music = game.add.audio('title', 1, true);
		music.play('', 0, .1, true);
	},

	toggle_sound: function() {
		if (this.sound_toggle.frame == 0) {
			this.sound_toggle.frame = 1;
			sound = false;
		}
		else {
			this.sound_toggle.frame = 0;
			sound = true;
		}
	},

	createFadeTween: function (alphaFrom, alphaTo, fadeDuration) {
		fadeDuration = fadeDuration || 3000;

		this.fadeGraphic = game.add.graphics(0, 0);
		this.fadeGraphic.beginFill(0x000000, 1);
		this.fadeGraphic.drawRect(0, 0, game.camera.width, game.camera.height);
		this.fadeGraphic.fixedToCamera = true;

		this.fadeGraphic.alpha = alphaFrom;
		this.fadeGraphic.endFill();


		var tween = game.add.tween(this.fadeGraphic);
		tween.to({alpha: alphaTo}, fadeDuration, null);
		return tween;
	},


	startGame: function() {
		if (savegame.exists()) {
			tween = this.createFadeTween(0,1, 500);
			tween.start();
			music.fadeOut(1000);
			game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
			music.stop();
			this.game.state.start('Room_Gems');
		}, this);
		} else {
			music.fadeOut(1000);
			game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
			music.stop();
			this.game.state.start('Character');
		}, this);
	}
},
}
