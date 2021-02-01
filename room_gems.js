Game.Gems = function (game) {
	this.state_name = "Gems";
	this.fadeGraphic;
};

// character_choice from 1 to 7
character_choice = 1;
if (character_choice > 3) {
	character_mod = character_choice * 3 + 36;
} else {
	character_mod = character_choice * 3;
}

frame_rate = 10;

setting_draw_grid = false;
grid_size = 50;
border_alpha = 0.4;
map_scale = 1.3;
show_fps = false;
convo_save = null;
tracker = 0;
convo_next = "1000";
chars = "";

var spacebar;

var directions = "";
var speaker = "";
var style_dialogue = {
	font: "25px VT323",
	fill: "#7a5638",
	align: "center",
};
var style_speaker = {
	font: "20px VT323",
	fill: "#b49073",
	align: "center",
};

var convo_gatekeeper_start = 1000;
var convo_gatekeeper_next = 1001;

var start_inscription;
start_inscription = "2000";

inscriptionFollowUp = null;

function calculateSpriteSheet(choice) {
	if (choice > 3) {
		mod = choice * 3 + 36;
		return mod;
	} else {
		mod = choice * 3;
		return mod;
	}
}

SaveGame = function () {
	this.counter = 0;
	this.fadeGraphic = null;
};

SaveGame.prototype = {
	saveGame: function (state) {
		gem_blue_save = gem_blue.serialize();
		gem_yellow_save = gem_yellow.serialize();
		gem_red_save = gem_red.serialize();
		gem_green_save = gem_green.serialize();
		gem_purple_save = gem_purple.serialize();
		gem_gold_save = gem_gold.serialize();

		player_coords = player.serialize();

		state_obj = { state: state };
		state = JSON.stringify(state_obj);

		localStorage.setItem("gem_blue", gem_blue_save);
		localStorage.setItem("gem_yellow", gem_yellow_save);
		localStorage.setItem("gem_red", gem_red_save);
		localStorage.setItem("gem_green", gem_green_save);
		localStorage.setItem("gem_purple", gem_purple_save);
		localStorage.setItem("gem_gold", gem_gold_save);
		localStorage.setItem("player_coords", player_coords);
		localStorage.setItem("state", state);

		return gem_blue_save;
	},

	reloadCriticals: function () {
		if (this.exists()) {
			player_coords = localStorage.getItem("player_coords");
			player_coords = JSON.parse(player_coords);
			if (player_coords != null) {
				character_select = player_coords["npc_choice"];
			}
		}
	},

	reloadSaveGame: function () {
		gem_blue_save = localStorage.getItem("gem_blue");
		gem_blue_save = JSON.parse(gem_blue_save);

		if (gem_blue_save != null) {
			gem_blue.reloadSaveGame(gem_blue_save["status"]);
		}

		gem_yellow_save = localStorage.getItem("gem_yellow");
		gem_yellow_save = JSON.parse(gem_yellow_save);

		if (gem_yellow_save != null) {
			gem_yellow.reloadSaveGame(gem_yellow_save["status"]);
		}

		gem_red_save = localStorage.getItem("gem_red");
		gem_red_save = JSON.parse(gem_red_save);

		if (gem_red_save != null) {
			gem_red.reloadSaveGame(gem_red_save["status"]);
		}

		gem_green_save = localStorage.getItem("gem_green");
		gem_green_save = JSON.parse(gem_green_save);
		if (gem_green_save != null) {
			gem_green.reloadSaveGame(gem_green_save["status"]);
		}
		gem_purple_save = localStorage.getItem("gem_purple");
		gem_purple_save = JSON.parse(gem_purple_save);
		if (gem_purple_save != null) {
			gem_purple.reloadSaveGame(gem_purple_save["status"]);
		}
		gem_gold_save = localStorage.getItem("gem_gold");
		gem_gold_save = JSON.parse(gem_gold_save);
		if (gem_gold_save != null) {
			gem_gold.reloadSaveGame(gem_gold_save["status"]);
		}
		player_coords = localStorage.getItem("player_coords");
		player_coords = JSON.parse(player_coords);
		if (player_coords != null) {
			if (player_coords["x"] - 375 < 35 && 500 - player_coords["y"] < 50) {
				player.sprite.y = player_coords["y"] - 25;
			} else {
				player.sprite.x = player_coords["x"];
				player.sprite.y = player_coords["y"];
			}
			gatekeeper.start_inscription = player_coords["gatekeeper_start"];
			gatekeeper.sprite.x = player_coords["gatekeeper_x"];
			gatekeeper.sprite.y = player_coords["gatekeeper_y"];
			player.npc_choice = player_coords["npc_choice"];
			character_select = player_coords["npc_choice"];
			player.initializeNPCAnimation();
		}
	},

	hitDoor: function () {
		speech = game.cache.getJSON("dialogue");

		if (gem_gold.status == "unsolved") {
			dialogWindow.visible = true;
			inscriptionText = speech["general"]["Prevent leave"];

			displayInscription.setText(inscriptionText);
			displayInscription.wordWrap = true;
			displayInscription.wordWrapWidth = globalWordWrapWidth;

			inscriptionTitle = "Inner Thoughts";
			displayTitle.setText(inscriptionTitle);
			displayTitle.wordWrap = true;
			displayTitle.wordWrapWidth = globalWordWrapWidth;

			game.time.events.add(
				Phaser.Timer.SECOND * 1,
				function () {
					player.sprite.y = 455;
					player.sprite.direction = 1;
				},
				this
			);

			game.time.events.add(
				Phaser.Timer.SECOND * 2,
				function () {
					displayInscription.setText("");
					displayTitle.setText("");
					dialogWindow.visible = false;
					// console.log(gem_gold.status);
				},
				this
			);
		} else {
			if (doorCounter == 0) {
				doorCounter++;

				fade_black = game.add.sprite(0, 0, "fade_black");
				fade_black.scale.setTo(1, 1);
				fade_black.alpha = 0;
				tween_fadeout = game.add
					.tween(fade_black)
					.to(
						{ alpha: 1 },
						2500,
						Phaser.Easing.Linear.None,
						false,
						100,
						0,
						false
					);
				//	tween_fadein= game.add.tween(fade_black).to( { alpha: 0 }, 3500, Phaser.Easing.Linear.None, false, 500, 0, false);
				tween_fadeout.start();

				game.time.events.add(
					Phaser.Timer.SECOND * 6,
					function () {
						game.state.start("Credits");
					},
					this
				);

				// 	tween = gem_gold.createFadeTweeen(1,0, 4000);
				// 	tween.start();
				// 	game.time.events.add(Phaser.Timer.SECOND * 5, function() {
				// 	doorCounter++;
				// }, this);
			}
		}
	},

	fadeIn: function () {
		fade_black = game.add.sprite(0, 0, "fade_black");
		fade_black.scale.setTo(1, 1);
		fade_black.alpha = 0;
		tween_fadeout = game.add
			.tween(fade_black)
			.to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, false, 500, 0, true);
		tween_fadeout.start();
	},

	exists: function () {
		player_coords = localStorage.getItem("player_coords");
		gem_purple_save = localStorage.getItem("gem_purple");

		if (player_coords != null && gem_purple_save != null) {
			return true;
		} else {
			return false;
		}
	},
};

Gem = function (xSpawnPos, ySpawnPos, name) {
	this.sprite = null;
	this.name = null;
	this.xSpawnPos = xSpawnPos;
	this.ySpawnPos = ySpawnPos;
	this.maxChars = null;
	this.start_inscription = null;
	this.solution_line = [];
	this.solution_char = [];
	this.status = "unsolved";
	this.solutionField = null;
	this.enter = null;
	this.counter = 0;
	this.characteristic = null;
	this.fadeGraphic = null;

	this.solutionField = game.add.inputField(90, 480, {
		font: "25px VT323",
		backgroundColor: "#f2dcbb",
		fill: "#7a5638",
		width: 350,
		padding: 8,
		borderWidth: 0,
		borderColor: "#f2dcbb",
		borderRadius: 1,
		placeHolder: "Your Answer (" + this.maxChars + ")",
		placeHolderColor: "#7a5638",
		max: this.maxChars,
	});
	this.solutionField.visible = false;
};

Gem.prototype = {
	serialize: function () {
		var fields = ["name", "status"];

		fields["name"] = this.name;
		if (this.status != "solving") {
			fields["status"] = this.status;
		} else {
			fields["status"] = "unsolved";
		}

		var obj = {};
		for (var i in fields) {
			var field = fields[i];
			obj[field] = this[field];
		}
		return JSON.stringify(obj);
	},

	reloadSaveGame: function (status) {
		this.status = status;

		if (this.status == "solved") {
			this.sprite.visible = true;
			if (this.name == "Diamond") {
				this.sprite.alpha = 1;
				this.sprite.x = 395;
				this.sprite.y = 380;
			}
		} else if (this.status == "solving") {
			this.status = "unsolved";
		}
		// console.log(this.name + " / " + this.status);
	},

	initializeGemSprite: function (
		scaleX,
		scaleY,
		color,
		maxChars,
		name,
		start_inscription,
		solution,
		characteristic
	) {
		speech = game.cache.getJSON("dialogue");

		gem_sprite = "gem_" + color;
		this.name = name;
		this.maxChars = maxChars;
		this.sprite = game.add.sprite(this.xSpawnPos, this.ySpawnPos, gem_sprite);
		game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;
		this.sprite.body.immovable = true;
		this.characteristic = speech["conversations"][this.name]["characteristic"];

		this.sprite.scale.setTo(scaleX, scaleY);

		this.solution = solution;

		this.sprite.visible = false;

		//var solution_line = [];
		inscriptionText = "";
		inscriptionTitle = "";
		inscriptionHint = "";
		this.start_inscription = start_inscription;

		displayInscription = game.add.text(
			game.world.centerX,
			game.world.centerY + 200,
			inscriptionText,
			style_dialogue
		);
		displayInscription.anchor.set(0.5);
		displayInscription.wordWrap = true;
		displayInscription.wordWrapWidth = globalWordWrapWidth;

		displayTitle = game.add.text(230, 424, inscriptionTitle, style_speaker);
		displayTitle.anchor.set(0.5);

		displayHint = game.add.text(
			game.world.centerX,
			game.world.centerY + 200,
			inscriptionText,
			style_speaker
		);
		//saveGems = this.serialize();
		//localStorage.setItem("save", saveGems);
		//old_save = localStorage.getItem("save");
		//console.log(old_save);
	},

	initializeGemSize: function (sizeX, sizeY, sizeW, sizeH) {
		this.sprite.body.setSize(sizeX, sizeY, sizeW, sizeH);
	},

	createFadeTweeen: function (alphaFrom, alphaTo, fadeDuration) {
		fadeDuration = fadeDuration || 3000;

		this.fadeGraphic = game.add.graphics(0, 0);
		this.fadeGraphic.beginFill(0x000000, 1);
		this.fadeGraphic.drawRect(0, 0, game.camera.width, game.camera.height);
		this.fadeGraphic.fixedToCamera = true;

		this.fadeGraphic.alpha = alphaFrom;
		this.fadeGraphic.endFill();

		var tween = game.add.tween(this.fadeGraphic);
		tween.to({ alpha: alphaTo }, fadeDuration, null);
		return tween;
	},

	addToGroup: function (group) {
		group.add(this.sprite);
	},

	hoverGem: function () {
		if (this.sprite.body.y < this.ySpawnPos - 5) {
			this.sprite.body.velocity.y = 2;
		} else if (this.sprite.body.y >= this.ySpawnPos) {
			this.sprite.body.velocity.y = -2;
		}
	},

	checkGemRequirements: function (object, x, y, y_min) {
		if (player.checkGemProximityRequirements(object, x, y, y_min)) {
			//    console.log("0. Starting Gem Interaction with " + object.name)
			object.startGemInteraction();
			click.play();
		}
	},

	update: function () {
		this.hoverGem();
	},

	startGemInteraction: function (name) {
		speech = game.cache.getJSON("dialogue");
		//	console.log(this.status);
		//	console.log("1. Hier gehts los");
		if (this.status == "solved") {
			dialogWindow.visible = true;

			// Pull inscrption text from JSON
			if (this.name != "Diamond") {
				inscriptionText =
					speech["general"]["Post solve"] +
					this.name +
					".\n" +
					this.characteristic;
			} else {
				inscriptionText = speech["general"]["Final text"];
			}

			displayInscription.setText(inscriptionText);
			displayInscription.wordWrap = true;
			displayInscription.wordWrapWidth = globalWordWrapWidth;

			cursorOn = false;
			inscriptionTitle = this.name + " Inscription";

			displayTitle.setText(inscriptionTitle);
			displayTitle.wordWrap = true;
			displayTitle.wordWrapWidth = globalWordWrapWidth;

			if (this.counter > 0) {
				this.clearSolutionInput();
				this.counter = 0;
			} else {
				this.counter++;
			}

			// Determine Followup
			//inscriptionFollowUp = "end";
		} else if (this.status == "wrong") {
			displayHint.setText("");
			dialogWindow.visible = true;

			inscriptionText = speech["general"]["Failed attempt"];

			displayInscription.setText(inscriptionText);
			displayInscription.wordWrap = true;
			displayInscription.wordWrapWidth = globalWordWrapWidth;

			cursorOn = false;
			inscriptionTitle = "The Answer";

			displayTitle.setText(inscriptionTitle);
			displayTitle.wordWrap = true;
			displayTitle.wordWrapWidth = globalWordWrapWidth;

			this.status = "unsolved";

			if (this.counter > 0) {
				this.clearSolutionInput();
				this.counter = 0;
			} else {
				this.counter++;
			}
		} else if (this.status != "solving") {
			//	console.log("1b. Weiter");

			speech = game.cache.getJSON("dialogue");
			cursorOn = false;

			if (inscriptionFollowUp == "end") {
				// Set text to ""
				displayInscription.setText("");
				displayTitle.setText("");

				// Let window vanish and restart game
				//dialogWindow.visible = false;
				cursorOn = true;

				// Set new value for restart
				this.start_inscription =
					speech["conversations"][this.name]["elements"][
						this.start_inscription
					]["next"];

				// Empty Followup
				inscriptionFollowUp = null;

				//Call Solution entry
				charCounter = 0;
				this.writeSolution();
				//spaceBlub = game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
			} else {
				//		console.log("1c. Weiter");

				// Make Dialogwindow visible
				dialogWindow.visible = true;

				// Pull inscrption text from JSON
				inscriptionText =
					speech["conversations"][this.name]["elements"][
						this.start_inscription
					]["text"];
				displayInscription.setText(inscriptionText);
				displayInscription.wordWrap = true;
				displayInscription.wordWrapWidth = globalWordWrapWidth;

				inscriptionTitle = this.name + " Inscription";
				displayTitle.setText(inscriptionTitle);

				// Determine Followup
				inscriptionFollowUp =
					speech["conversations"][this.name]["elements"][
						this.start_inscription
					]["followups"][0];

				if (inscriptionFollowUp != "end") {
					this.start_inscription = inscriptionFollowUp;
				}
			}
		}
	},

	writeSolution: function () {
		if (this.status == "solved") {
			this.clearSolutionInput();
		} else {
			cursorOn = false;
			click.play();

			enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
			displayHint = game.add.text(
				90,
				450,
				speech["general"]["Text entry"],
				style_speaker
			);

			this.solutionField = game.add.inputField(90, 480, {
				font: "25px VT323",
				backgroundColor: "#f2dcbb",
				fill: "#7a5638",
				width: 350,
				padding: 8,
				borderWidth: 0,
				borderColor: "#f2dcbb",
				borderRadius: 1,
				placeHolder: "Your Answer (" + this.maxChars + ")",
				placeHolderColor: "#7a5638",
				max: this.maxChars,
			});
			this.solutionField.visible = true;

			this.status = "solving";
			//this.displaySolutionLines(this.maxChars);
			displayTitle.setText("The Answer");

			enter.onDown.add(function () {
				click.play();

				this.checkSolution(this.solutionField.value);
				this.solutionField.visible = false;
			}, this);
		}
	},

	checkSolution: function (proposal) {
		proposal = proposal.toLowerCase();
		enc_proposal = CryptoJS.MD5(proposal);
		if (enc_proposal == this.solution) {
			this.status = "solved";
			this.activateGem();
			this.clearSolutionInput();
		} else {
			this.status = "wrong";
			this.startGemInteraction();
			//    this.clearSolutionInput();
		}
	},

	encodeSolution: function (str) {
		var encoded = "";
		for (i = 0; i < str.length; i++) {
			var a = str.charCodeAt(i);
			var b = a ^ 123; // bitwise XOR with any number, e.g. 123
			encoded = encoded + String.fromCharCode(b);
		}
		return encoded;
	},

	clearSolutionInput: function () {
		for (i = 0; i < this.solution_line.length; i++) {
			this.solution_line[i].setText("");
		}
		for (i = 0; i < this.solution_char.length; i++) {
			this.solution_char[i].setText("");
		}
		displayTitle.setText("");
		cursorOn = true;

		dialogWindow.visible = false;
		displayInscription.setText("");

		displayHint.setText("");
		enter = game.input.keyboard.removeKey(Phaser.Keyboard.ENTER);
	},

	activateGem: function () {
		this.sprite.y = this.ySpawnPos - 15;
		this.sprite.body.velocity.y = 7;
		this.sprite.visible = true;
		this.checkForWinningCondition();
		angel.play();
		music.volume = 0.01;

		game.time.events.add(
			Phaser.Timer.SECOND * 5,
			function () {
				music.volume = 0.05;
			},
			this
		);
	},

	checkForWinningCondition: function () {
		if (
			gem_blue.status == "solved" &&
			gem_yellow.status == "solved" &&
			gem_red.status == "solved" &&
			gem_green.status == "solved" &&
			gem_purple.status == "solved"
		) {
			this.triggerWin();
		}
	},

	triggerWin: function () {
		fade_black = game.add.sprite(0, 0, "fade_white");
		fade_black.scale.setTo(1, 1);
		fade_black.alpha = 0;
		tween_fadeout = game.add
			.tween(fade_black)
			.to({ alpha: 1 }, 3000, Phaser.Easing.Linear.None, false, 500, 0, true);
		//	tween_fadein= game.add.tween(fade_black).to( { alpha: 0 }, 3500, Phaser.Easing.Linear.None, false, 500, 0, false);
		tween_fadeout.start();

		game.time.events.add(
			Phaser.Timer.SECOND * 4,
			this.startFinalConversation,
			this
		);
	},

	moveCharactersWin: function () {
		player.sprite.x = 415;
		player.sprite.y = 310;
		player.sprite.direction = 4;

		gatekeeper.sprite.x = 385;
		gatekeeper.sprite.y = 310;
		gatekeeper.sprite.direction = 4;
		gem_gold.status = "solved";
	},

	startFinalConversation: function () {
		this.moveCharactersWin();
		gatekeeper.start_inscription = ["1100"];
		inscriptionFollowUp = "";
		game.time.events.add(
			Phaser.Timer.SECOND * 4,
			this.startFinalGatekeeperConversationgatekeeper,
			this
		);
	},

	startFinalGatekeeperConversationgatekeeper: function () {
		params = {};
		emailjs.send("default_service", "template_xxx", params, "user_xxx");
		gatekeeper.startNPCInteraction();
	},

	initializeEnd: function () {
		if (this.sprite.alpha == 0) {
			angel.play();
			music.volume = 0.01;

			game.time.events.add(
				Phaser.Timer.SECOND * 5,
				function () {
					music.volume = 0.05;
				},
				this
			);

			this.sprite.x = 395;
			this.sprite.y = 380;
			//this.sprite.body.velocity.y = 7;
			this.sprite.visible = true;
			this.status = "solved";
			game.time.events.add(
				Phaser.Timer.SECOND * 0.5,
				function () {
					tween_gem_gold = game.add
						.tween(gem_gold.sprite)
						.to(
							{ alpha: 1 },
							1000,
							Phaser.Easing.Linear.None,
							true,
							500,
							0,
							false
						);
				},
				this
			);
		}
	},
};

// Types: 0 = PC, 1 = NPC,
NPC = function (
	xSpawnPos,
	ySpawnPos,
	type,
	npc_choice,
	name,
	start_interaction
) {
	if (npc_choice == null) {
		this.npc_choice = character_select;
	} else {
		this.npc_choice = npc_choice;
	}
	game = game;
	this.sprite = null;
	this.name = name;
	this.xSpawnPos = xSpawnPos;
	this.ySpawnPos = ySpawnPos;

	this.sprite_mod = calculateSpriteSheet(this.npc_choice);
	this.type = type;

	inscriptionText = "";
	inscriptionTitle = "";
	this.start_inscription = start_interaction;

	displayInscription = game.add.text(
		game.world.centerX,
		game.world.centerY + 200,
		inscriptionText,
		style_dialogue
	);
	displayInscription.anchor.set(0.5);
	displayInscription.wordWrap = true;
	displayInscription.wordWrapWidth = globalWordWrapWidth;

	displayTitle = game.add.text(230, 424, inscriptionTitle, style_speaker);
	displayTitle.anchor.set(0.5);
};

NPC.prototype = {
	create: function () {},
	checkNPCRequirements: function (object) {
		if (player.checkNPCProximityRequirements(object)) {
			object.startNPCInteraction();
		}
	},

	initializeNPCSprite: function (scaleX, scaleY) {
		this.sprite = game.add.sprite(this.xSpawnPos, this.ySpawnPos, "character");
		game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;

		if (this.type == "1") {
			this.sprite.body.immovable = true;
		}

		this.sprite.scale.setTo(scaleX, scaleY);
		//this.sprite.body.setSize(30, 10, 5,8)
	},

	initializeNPCAnimation: function () {
		this.cursor = game.input.keyboard.createCursorKeys();
		this.sprite.animations.add(
			"down",
			[0 + this.sprite_mod, 1 + this.sprite_mod, 2 + this.sprite_mod],
			frame_rate,
			true
		);
		this.sprite.animations.add(
			"left",
			[12 + this.sprite_mod, 13 + this.sprite_mod, 14 + this.sprite_mod],
			frame_rate,
			true
		);
		this.sprite.animations.add(
			"right",
			[24 + this.sprite_mod, 25 + this.sprite_mod, 26 + this.sprite_mod],
			frame_rate,
			true
		);
		this.sprite.animations.add(
			"up",
			[36 + this.sprite_mod, 37 + this.sprite_mod, 38 + this.sprite_mod],
			frame_rate,
			true
		);
		this.sprite.frame = 0 + this.sprite_mod;
	},

	initializeNPCSize: function (sizeX, sizeY, sizeW, sizeH) {
		this.sprite.body.setSize(sizeX, sizeY, sizeW, sizeH);
	},

	checkGemProximityRequirements: function (object, x, y, y_min) {
		x_abs = x || 10;
		y_abs = y || 50;
		y_abs_min = y_min || 0;

		if (
			Math.abs(this.sprite.body.x - object.sprite.body.x) < x_abs &&
			this.sprite.body.y - object.sprite.body.y > y_abs_min &&
			this.sprite.body.y - object.sprite.body.y < y_abs
		) {
			//console.log(object.name + ":" + true);
			return true;
		} else {
			//console.log(object.name + ":" + false);
			return false;
		}
	},

	checkNPCProximityRequirements: function (object) {
		x_abs = Math.round(Math.abs(this.sprite.x - object.sprite.body.x));
		y_abs = Math.round(Math.abs(this.sprite.y - object.sprite.body.y));
		if (x_abs < 30 && y_abs < 14) {
			//console.log(object.name + ":" + true + " (X: "+ x_abs + " / Y: " + y_abs + ")");
			return true;
		} else {
			// console.log(object.name + ":" + false + " (X: "+ x_abs + " / Y: " + y_abs + ")");

			return false;
		}
	},

	startNPCInteraction: function () {
		speech = game.cache.getJSON("dialogue");
		cursorOn = false;
		this.setDirectionDialogue(gatekeeper);
		if (inscriptionFollowUp == "final_end") {
			// Set text to ""
			displayInscription.setText("");
			displayTitle.setText("");

			// Let window vanish and restart game
			dialogWindow.visible = false;
			cursorOn = true;

			// console.log(this.start_inscription);

			// Set new value for restart
			this.start_inscription =
				speech["conversations"][this.name]["elements"][this.start_inscription][
					"next"
				];

			// Empty Followup
			inscriptionFollowUp = null;

			// Move Gatekeeper
			gatekeeper.sprite.frame = 0 + gatekeeper.sprite_mod; // down

			gem_gold.initializeEnd();
		} else if (inscriptionFollowUp == "end") {
			// Set text to ""
			displayInscription.setText("");
			displayTitle.setText("");

			// Let window vanish and restart game
			dialogWindow.visible = false;
			cursorOn = true;

			// Set new value for restart
			this.start_inscription =
				speech["conversations"][this.name]["elements"][this.start_inscription][
					"next"
				];

			// Empty Followup
			inscriptionFollowUp = null;

			// Move Gatekeeper
			gatekeeper.sprite.frame = 0 + gatekeeper.sprite_mod; // down
		} else {
			click.play();

			// Make Dialogwindow visible
			dialogWindow.visible = true;

			// Pull inscrption text from JSON
			inscriptionText =
				speech["conversations"][this.name]["elements"][this.start_inscription][
					"text"
				];
			displayInscription.setText(inscriptionText);
			displayInscription.wordWrap = true;
			displayInscription.wordWrapWidth = globalWordWrapWidth;

			inscriptionTitle =
				speech["conversations"][this.name]["elements"][this.start_inscription][
					"speaker"
				];
			displayTitle.setText(inscriptionTitle);

			// Determine Followup
			inscriptionFollowUp =
				speech["conversations"][this.name]["elements"][this.start_inscription][
					"followups"
				][0];

			if (inscriptionFollowUp != "end" && inscriptionFollowUp != "final_end") {
				this.start_inscription = inscriptionFollowUp;
			}
		}
	},

	turnWindowsOff: function () {
		if (dialogWindow.visible == false) {
			dialogWindow.visible = true;
		} else {
			dialogWindow.visible = false;
			dialogText.visible = false;
		}
	},

	createDialogue: function () {
		// Dialogue box+
		dialogues = game.add.group();

		dialogWindow = game.add.sprite(50, 410, "dialogue_large");

		dialogWindow.scale.setTo(2.1, map_scale);
		dialogWindow.visible = false;

		var directions = "";
		var speaker = "";
		var style_dialogue = {
			font: "25px VT323",
			fill: "#7a5638",
			align: "center",
		};
		var style_speaker = {
			font: "20px VT323",
			fill: "#b49073",
			align: "center",
		};

		dialogText = game.add.text(
			game.world.centerX,
			game.world.centerY + 200,
			directions,
			style_dialogue
		);
		dialogText.anchor.set(0.5);
		dialogText.wordWrap = true;
		dialogText.wordWrapWidth = globalWordWrapWidth;

		dialogSpeaker = game.add.text(230, 422, speaker, style_speaker);
		dialogSpeaker.anchor.set(0.5);
	},

	setDirectionDialogue: function (object) {
		// Direction drift
		if (object.type == 1) {
			if (player.sprite.direction == 4) {
				object.sprite.frame = 24 + object.sprite_mod; // left
			} else if (player.sprite.direction == 3) {
				object.sprite.frame = 12 + object.sprite_mod; // left
			} else if (player.sprite.direction == 1) {
				object.sprite.frame = 0 + object.sprite_mod; // down
			} else if (player.sprite.direction == 2) {
				object.sprite.frame = 36 + object.sprite_mod; // up
			}
		}
	},

	serialize: function () {
		var fields = ["x", "y"];

		fields["x"] = player.sprite.x;
		fields["y"] = player.sprite.y;
		fields["gatekeeper_start"] = gatekeeper.start_inscription;

		var obj = {};

		obj = {
			x: fields["x"],
			y: fields["y"],
			gatekeeper_start: fields["gatekeeper_start"],
			gatekeeper_x: gatekeeper.sprite.x,
			gatekeeper_y: gatekeeper.sprite.y,
			npc_choice: player.npc_choice,
		};
		//console.log(obj);
		//console.log(character_select);
		//console.log(player.npc_choice);
		return JSON.stringify(obj);
	},

	move: function () {
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;

		run_volume = 0.01;

		var speed = 180;
		if (cursorOn != false) {
			if (this.cursor.left.isDown) {
				run.play("", "", run_volume, false, false);

				if (this.tween) this.sprite.body.velocity.x = -50;
				else this.sprite.body.velocity.x = -speed;
				this.sprite.direction = 4;
				this.sprite.animations.play("left");
			} else if (this.cursor.right.isDown) {
				run.play("", "", run_volume, false, false);

				if (this.tween) this.sprite.body.velocity.x = 50;
				else this.sprite.body.velocity.x = speed;
				this.sprite.direction = 3;
				this.sprite.animations.play("right");
			} else if (this.cursor.up.isDown) {
				run.play("", "", run_volume, false, false);

				if (this.tween) this.sprite.body.velocity.y = -50;
				else this.sprite.body.velocity.y = -speed;
				this.sprite.direction = 1;
				this.sprite.animations.play("up");
			} else if (this.cursor.down.isDown) {
				run.play("", "", run_volume, false, false);

				if (this.tween) this.sprite.body.velocity.y = 50;
				else this.sprite.body.velocity.y = speed;
				this.sprite.direction = 2;
				this.sprite.animations.play("down");
			} else {
				if (this.sprite.direction == 1)
					this.sprite.frame = 36 + this.sprite_mod;
				// up
				else if (this.sprite.direction == 2)
					this.sprite.frame = 0 + this.sprite_mod;
				// down
				else if (this.sprite.direction == 3)
					// right
					this.sprite.frame = 24 + this.sprite_mod;
				else if (this.sprite.direction == 4)
					// left
					this.sprite.frame = 12 + this.sprite_mod;

				this.sprite.animations.stop();
			}
		}
	},

	update: function () {
		this.move();
		game.physics.arcade.collide(this.sprite, borders, function () {
			bump.play(null, null, 0.2, false, false);
		});
		game.physics.arcade.collide(this.sprite, altars, function () {
			bump.play(null, null, 0.2, false, false);
		});
		game.physics.arcade.collide(this.sprite, gatekeeper.sprite);
		game.physics.arcade.collide(this.sprite, gem_gold.sprite, function () {
			bump.play(null, null, 0.2, false, false);
		});
		game.physics.arcade.overlap(
			this.sprite,
			door,
			savegame.hitDoor,
			null,
			this
		);

		//	room_gems.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//play.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		//game.play.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},
};

Game.Gems.prototype = {
	draw_grid: function () {
		var graphics = game.add.graphics(0, 0);

		if (setting_draw_grid == true) {
			for (i = 0; i < 8 * 5; i += 1) {
				graphics.beginFill(0xff3300);
				if ((grid_size * i) % 0) {
					graphics.beginFill(0xffffff);
				}
				grid_vert = graphics.drawRect(grid_size * i, 0, 1, 1000);
				grid_hor = graphics.drawRect(0, grid_size * i, 1000, 1);
				grid_vert.alpha = 0.2;
				grid_hor.alpha = 0.2;
			}
		}
	},

	create: function () {
		var gameCounter = 0;

		// General Stuff
		game.physics.startSystem(Phaser.Physics.ARCADE);
		this.cursor = this.game.input.keyboard.createCursorKeys();

		this.playMusic();

		click = game.add.audio("click", 0.4, false);
		bump = game.add.audio("bump", 0.2, false);
		error = game.add.audio("error", 0.01, false);
		angel = game.add.audio("angel", 0.2, false);
		run = game.add.audio("run", 0.4, false);
		//bump = game.add.audio("bump", 0.2, false);

		//tween.start();

		spaceBlub = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceBlub.onDown.add(function () {
			gem_blue.checkGemRequirements(gem_blue);
			gem_red.checkGemRequirements(gem_red);
			gem_yellow.checkGemRequirements(gem_yellow);
			gem_green.checkGemRequirements(gem_green);
			gem_purple.checkGemRequirements(gem_purple);
			gem_gold.checkGemRequirements(gem_gold, 10, 50, -50);
			gatekeeper.checkNPCRequirements(gatekeeper);
		}, this);

		savegame.reloadCriticals();
		// Load Background
		this.load_map();
		this.createBorders();
		this.createAltars();

		this.draw_grid();

		// NPC init
		gatekeeper = new NPC(390, 160, 1, 7, "Gatekeeper", 1000);
		gatekeeper.initializeNPCSprite(0.6, 0.7);
		gatekeeper.initializeNPCSize(30, 10, 5, 15);
		gatekeeper.initializeNPCAnimation();

		player = new NPC(400, 455, null);
		player.initializeNPCSprite(0.6, 0.7);
		player.initializeNPCAnimation();
		player.createDialogue();

		// This position because of layering
		this.createGems();

		savegame.reloadSaveGame();
		tween = this.createFadeTween();
		tween.start();
		//console.log(tween);

		//game.world.bringToTop(tween);
	},

	playMusic: function () {
		if (window.music && window.music.name == "theme") {
			return;
		} else if (window.music) {
			music.stop();
		}

		music = game.add.audio("theme", 1, true);
		music.play("", 0, 0.05, true);
	},

	createFadeTween: function (alphaFrom, alphaTo, fadeDuration) {
		fadeDuration = fadeDuration || 3000;

		this.fadeGraphic = game.add.graphics(0, 0);
		this.fadeGraphic.beginFill(0x000000, 1);
		this.fadeGraphic.drawRect(0, 0, game.camera.width, game.camera.height);
		this.fadeGraphic.fixedToCamera = true;

		this.fadeGraphic.alpha = 1;
		this.fadeGraphic.endFill();

		var tween = game.add.tween(this.fadeGraphic);
		tween.to({ alpha: 0 }, fadeDuration, null);
		return tween;
	},

	createBorders: function () {
		// Border for collision
		borders = game.add.group();
		borders.enableBody = true;

		var border1 = borders.create(265, 150, "box");
		border1.body.immovable = true;
		border1.alpha = border_alpha;
		border1.scale.setTo(1, 0.4);

		var border2 = borders.create(265, 505, "box");
		border2.body.immovable = true;
		border2.alpha = border_alpha;
		border2.scale.setTo(1, 0.4);

		for (i = 0; i < 11; i++) {
			borderX = borders.create(100 + i * 15, 300 - i * 15, "box_ver");
			borderX.scale.setTo(0.2, 0.1);
			borderX.body.immovable = true;
		}

		for (i = 0; i < 15; i++) {
			borderX = borders.create(35 + i * 15, 300 + i * 15, "box_ver");
			borderX.scale.setTo(0.2, 0.1);
			borderX.body.immovable = true;
		}

		for (i = 0; i < 11; i++) {
			borderX = borders.create(560 + i * 15, 150 + i * 15, "box_ver");
			borderX.scale.setTo(0.2, 0.1);
			borderX.body.immovable = true;
		}

		for (i = 0; i < 10; i++) {
			borderX = borders.create(600 + i * 15, 470 - i * 15, "box_ver");
			borderX.scale.setTo(0.2, 0.1);
			borderX.body.immovable = true;
		}

		door = this.game.add.sprite(375, 500, "box");
		door.enableBody = true;
		game.physics.arcade.enable(door);
		door.body.immovable = true;
		door.alpha = 1.0;
		door.scale.setTo(0.2, 0.2);
		//borders.add(door);
	},

	createAltars: function () {
		// Start with altars because of layering
		altars = game.add.group();
		altars.enableBody = true;

		altar_blue = altars.create(295, 275, "altar");
		altar_blue.scale.setTo(map_scale, map_scale);
		altar_blue.body.immovable = true;
		altar_blue.body.setSize(25, 10, 5, 5);

		altar_yellow = altars.create(478, 275, "altar");
		altar_yellow.scale.setTo(map_scale, map_scale);
		altar_yellow.body.immovable = true;
		altar_yellow.body.setSize(25, 10, 5, 5);

		altar_red = altars.create(288, 353, "altar");
		altar_red.scale.setTo(map_scale, map_scale);
		altar_red.body.immovable = true;
		altar_red.body.setSize(25, 10, 5, 5);

		altar_green = altars.create(390, 240, "altar");
		altar_green.scale.setTo(map_scale, map_scale);
		altar_green.body.immovable = true;
		altar_green.body.setSize(25, 10, 5, 5);

		altar_purple = altars.create(485, 353, "altar");
		altar_purple.scale.setTo(map_scale, map_scale);
		altar_purple.body.immovable = true;
		altar_purple.body.setSize(25, 10, 5, 5);
	},

	createGems: function () {
		// Gems
		Gems = game.add.group();
		speech = game.cache.getJSON("dialogue");
		Gems.enableBody = true;

		//
		gem_blue = new Gem(300, 260);
		gem_blue.initializeGemSprite(
			1,
			1,
			"blue",
			4,
			"Sapphire",
			"2000",
			speech["conversations"]["Sapphire"]["solution"]
		);
		gem_blue.addToGroup(Gems);

		gem_yellow = new Gem(483, 256);
		gem_yellow.initializeGemSprite(
			1,
			1,
			"yellow",
			5,
			"Citrine",
			"4000",
			speech["conversations"]["Citrine"]["solution"]
		);
		gem_yellow.addToGroup(Gems);

		gem_red = new Gem(293, 334);
		gem_red.initializeGemSprite(
			1,
			1,
			"red",
			4,
			"Ruby",
			"6000",
			speech["conversations"]["Ruby"]["solution"]
		);
		gem_red.addToGroup(Gems);

		gem_green = new Gem(395, 225);
		gem_green.initializeGemSprite(
			1,
			1,
			"green",
			5,
			"Emerald",
			"3000",
			speech["conversations"]["Emerald"]["solution"]
		);
		gem_green.addToGroup(Gems);

		gem_purple = new Gem(490, 336);
		gem_purple.initializeGemSprite(
			1,
			1,
			"purple",
			6,
			"Amethyst",
			"5000",
			speech["conversations"]["Amethyst"]["solution"]
		);
		gem_purple.addToGroup(Gems);

		gem_gold = new Gem(0, 400);
		gem_gold.initializeGemSprite(1, 1, "gold", 4, "Diamond", "7000", "");
		gem_gold.addToGroup(Gems);
		gem_gold.sprite.alpha = 0;

		//gem_gold.visible = false;
	},

	showFPS: function (boolean) {
		if (boolean == true) {
			console.log(game.time.fps);
		}
	},

	update: function () {
		player.update();
		this.checkTime();
		player.checkNPCProximityRequirements(gatekeeper);

		gem_blue.update();
		gem_red.update();
		gem_yellow.update();
		gem_green.update();
		gem_purple.update();
		gem_gold.update();
	},

	checkTime: function () {
		if (gameCounter % 120 == 0) {
			savegame.saveGame(this.state.current);
			gameCounter = 1;
		} else {
			gameCounter++;
		}
	},

	load_map: function () {
		this.map = game.add.sprite(
			w / 2 - 284 * map_scale,
			h / 2 - 182 * map_scale,
			"room_gems"
		);
		this.map.scale.setTo(map_scale, map_scale);
	},
};
