Game.Credits = function (game) {
	this.displayText = "";
	this.info = null;
	this.trigger = false;
	this.counter;
};

Game.Credits.prototype = {
	create: function () {
		elements = game.add.group();
		elements.alpha = 0;
		this.counter = 0;

		this.displayText = game.add.text(
			w * 0.5,
			h * 0.3,
			player_name + ", thank you for playing!",
			{
				font: "40px VT323",
				fill: "#7a5638",
				align: "center",
			}
		);

		this.displayText.anchor.setTo(0.5, 0.5);

		elements.add(this.displayText);

		character = {};

		character[character_select] = game.add.sprite(650, 400, "character");
		character[character_select].animations.add(
			"up",
			[36 + mod, 37 + mod, 38 + mod],
			7,
			true
		);
		character[character_select].frame = 0 + mod;
		character[character_select].scale.setTo(1.4, 1.4);
		elements.add(character[character_select]);

		this.startCredits();
	},

	makeSmaller: function (trigger) {
		if (!trigger == false) {
			i = this.counter;
			character[character_select].scale.setTo(1.4 - i * 0.001, 1.4 - i * 0.001);
			console.log("now");
			this.counter++;
		}

		if (this.counter == 1000) {
			this.fadeOut();
		}
	},

	update: function () {
		this.makeSmaller(this.trigger);
	},

	fadeOut: function () {
		game.time.events.add(
			Phaser.Timer.SECOND * 2,
			function () {
				game.add
					.tween(character[character_select])
					.delay(1600)
					.to({ alpha: 0 }, 500)
					.start();
			},
			this
		);

		game.time.events.add(
			Phaser.Timer.SECOND * 3,
			function () {
				this.game.state.start("Menu");
			},
			this
		);
	},

	startCredits: function () {
		game.add.tween(elements).delay(0).to({ alpha: 1 }, 1500).start();

		game.time.events.add(
			Phaser.Timer.SECOND * 4,
			function () {
				game.add
					.tween(this.displayText)
					.delay(1600)
					.to({ alpha: 0 }, 1500)
					.start();
			},
			this
		);

		game.time.events.add(
			Phaser.Timer.SECOND * 7,
			function () {
				this.displayText.alpha = 0;
				this.displayText.setText(
					"Written, Developed and Programmed by: \n Kevin \n"
				);
				this.displayText.anchor.setTo(0.5, 0.2);
				game.add
					.tween(this.displayText)
					.delay(1600)
					.to({ alpha: 1 }, 1500)
					.start();
			},
			this
		);

		game.time.events.add(
			Phaser.Timer.SECOND * 15,
			function () {
				game.add
					.tween(this.displayText)
					.delay(1600)
					.to({ alpha: 0 }, 1500)
					.start();
			},
			this
		);

		game.time.events.add(
			Phaser.Timer.SECOND * 18,
			function () {
				this.displayText = game.add.text(
					w * 0.5,
					h * 0.3,
					player_name + ", thank you for playing!",
					{
						font: "30px VT323",
						fill: "#7a5638",
						align: "center",
					}
				);

				this.displayText.alpha = 0;
				this.displayText.setText("See ya soon!");
				this.displayText.anchor.setTo(0.5, 0.2);
				game.add
					.tween(this.displayText)
					.delay(1600)
					.to({ alpha: 1 }, 1500)
					.start();
			},
			this
		);

		game.time.events.add(
			Phaser.Timer.SECOND * 30,
			function () {
				game.add
					.tween(this.displayText)
					.delay(1600)
					.to({ alpha: 0 }, 1500)
					.start();
			},
			this
		);

		game.time.events.add(
			Phaser.Timer.SECOND * 30,
			function () {
				character[character_select].animations.play("up");
				this.trigger = true;
			},
			this
		);
	},

	calculateSpriteSheet: function (choice) {
		if (choice > 3) {
			mod = choice * 3 + 36;
			return mod;
		} else {
			mod = choice * 3;
			return mod;
		}
	},
};
