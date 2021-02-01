Game.Character = function(game) {
    this.displayText = "";
    this.info = null;
};

Game.Character.prototype = {

    create: function() {


        character_selection = game.add.group();

		click = game.add.audio("click", 0.4, false);
		bump = game.add.audio("bump", 0.2, false);


        this.displayText = game.add.text(w * 0.5, h * 0.3, player_name + ', wähle deinen Charakter', {
            font: "40px VT323",
            fill: "#7a5638",
            align: "center"
        });
        this.info = game.add.text(w / 2, h - 60, 'Move with arrow keys, confirm with spacebar to continue', {
            font: "20px VT323",
            fill: "#7a5638",
            align: "center"
        });

        this.info.anchor.setTo(0.5, 0.5);
        this.displayText.anchor.setTo(0.5, 0.5);

        character_selection.add(this.displayText);
        character_selection.add(this.info);

        character = {};

        for (i = 0; i < 7; i++) {
            mod = this.calculateSpriteSheet(i);
            character[i] = game.add.sprite(150 + (i * 75), 300, 'character');
            character[i].animations.add('down', [0 + mod, 1 + mod, 2 + mod], 7, true);
            character[i].frame = 0 + mod;
            character[i].tint = 0x9f9f9f;
            character[i].scale.setTo(1.2, 1.2);
            character_selection.add(character[i]);
        }


        character[0].tint = 0xFFFFFF;
        character[0].scale.setTo(1.4, 1.4);
        character[0].animations.play("down");


        this.characterSelection();
    },

    update: function() {

    },

    toggle_sound: function() {
        if (this.sound_toggle.frame == 0) {
            this.sound_toggle.frame = 1;
            sound = false;
        } else {
            this.sound_toggle.frame = 0;
            sound = true;
        }
    },

    startGame: function() {
        if (savegame.exists()) {
            this.game.state.start('Room_Gems');
        } else {
            this.game.state.start('Character');
        }
    },

    moveChosenCharacter: function() {
        character[character_select].animations.play("down");
    },

    characterSelection: function() {
      speech = game.cache.getJSON('dialogue');
        right = game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
        left = game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
        spacebar = game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        backspace = game.input.keyboard.removeKey(Phaser.Keyboard.BACKSPACE);


        spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        spacebar.onDown.add(function() {
            spacebar = game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
            this.confirmSelection();
			click.play();
        }, this);

        this.displayText.setText(player_name + speech["general"]["Character choice"]);
        this.info.setText(speech["general"]["Movement instructions"]);

        this.cursor = this.game.input.keyboard.createCursorKeys();

        right.onDown.add(function() {

            if (character_select < 6) {
				click.play();

                character[character_select].tint = 0x9f9f9f;
                character[character_select].scale.setTo(1.2, 1.2);
                character[character_select].animations.stop();

                character_select++;

                character[character_select].tint = 0xFFFFFF;
                character[character_select].scale.setTo(1.4, 1.4);
                character[character_select].animations.play("down");

            }
			else {
				bump.play();
			}
        }, this);


        left.onDown.add(function() {

            if (character_select > 0) {
				click.play();

                character[character_select].tint = 0x9f9f9f;
                character[character_select].scale.setTo(1.2, 1.2);
                character[character_select].animations.stop();

                character_select--;

                character[character_select].tint = 0xFFFFFF;
                character[character_select].scale.setTo(1.4, 1.4);
                character[character_select].animations.play("down");

			}else {
					bump.play();
				}
        }, this);

        for (i = 0; i < 7; i++) {
            if (i != character_select) {
                game.add.tween(character[i]).to({
                    alpha: 1
                }, 800).start();
            }
        }




    },

    confirmSelection: function() {
        right = this.game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
        left = this.game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);


        backspace = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
        backspace.onDown.add(function() {
            this.characterSelection()
        }, this);

        spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spacebar.onDown.add(function() {
            this.startIntro();


        }, this);

        this.displayText.setText(speech["general"]["Confirmation"]);
        this.info.setText("Confirm with Spacebar, return with Backspace");

        //this.displayText.alpha = 0;
        for (i = 0; i < 7; i++) {
            if (i != character_select) {
                game.add.tween(character[i]).to({
                    alpha: 0.3
                }, 800).start();
            }
        }

    },

    startIntro: function() {
        right = this.game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
        left = this.game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
        spacebar = game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);


        game.add.tween(character_selection).delay(0).to({
            alpha: 0
        }, 1500).start();

        game.time.events.add(Phaser.Timer.SECOND * 2, function() {

        }, this);

        game.time.events.add(Phaser.Timer.SECOND * 4, function() {
            this.displayText.alpha = 0;
            this.displayText.setText("It was a calm night.")

            var label = game.add.text(w / 2, h * 0.3, 'It was a calm night.', {
                font: "30px VT323",
                fill: "#7a5638",
                align: "center"
            });
            label.alpha = 0;
            label.anchor.setTo(0.5, 0.5);

            var label2 = game.add.text(w / 2, h * 0.5, 'But once in bed \n I started to dream \n in vivid colors and motives.', {
                font: "30px VT323",
                fill: "#7a5638",
                align: "center"
            });
            label2.alpha = 0;
            label2.anchor.setTo(0.5, 0.5);

            //console.log(this.displayText);
            //console.log(this.displayText.alpha);
            game.add.tween(label).to({
                alpha: 1
            }, 800).start();
            game.time.events.add(Phaser.Timer.SECOND * 4, function() {

                game.add.tween(label2).delay(1500).to({
                    alpha: 1
                }, 800).start();

                game.time.events.add(Phaser.Timer.SECOND * 4, function() {

                    var label3 = game.add.text(w / 2, h * 0.72, 'Then, I was somewhere else.', {
                        font: "30px VT323",
                        fill: "#7a5638",
                        align: "center"
                    });
                    label3.alpha = 0;
                    label3.anchor.setTo(0.5, 0.5);
                    game.add.tween(label3).delay(1500).to({
                        alpha: 1
                    }, 800).start();

					game.time.events.add(Phaser.Timer.SECOND * 6, function() {
						game.add.tween(label).delay(2000).to({	alpha: 0}, 800).start();
						game.add.tween(label2).delay(2000).to({	alpha: 0}, 800).start();
						game.add.tween(label3).delay(2000).to({	alpha: 0}, 800).start();

						game.time.events.add(Phaser.Timer.SECOND * 2, function() {
							game.state.start("Room_Gems");
						}, this);
					}, this);
                }, this);

            }, this);

        }, this);





        //game.state.start("Room_Gems");
        //player.npc_choice = character_select;


    },

    calculateSpriteSheet: function(choice) {

        if (choice > 3) {
            mod = (choice * 3) + 36;
            return mod
        } else {
            mod = choice * 3;
            return mod
        }
    }
};
