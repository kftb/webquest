Game = {};

var h = 600;
var w = 800;
var gameCounter = 0;
var player_name = "demo";
var doorCounter = 0;
var character_select = 0;
var globalWordWrapWidth = 600;
var globalVersionNr = "v0.1";
window.music;
var cursorOn = true;

Game.Boot = function (game) {};

Game.Boot.prototype = {
	preload: function () {
		game.load.image("character", "assets/images/title.png");
		this.load.image("loading", "assets/images/loading.png");
		this.load.image(
			"load_progress_bar_dark",
			"assets/images/progress_bar_bg.png"
		);
		this.load.image("load_progress_bar", "assets/images/progress_bar_fg.png");

		//game.time.advancedTiming = true;
	},

	create: function () {
		this.game.state.start("Load");
	},
};

Game.Load = function (game) {};

Game.Load.prototype = {
	preload: function () {
		this.displayLoadScreen();
		this.loadAssets();
	},

	displayLoadScreen: function () {
		var centerX = game.camera.width / 2;
		var centerY = game.camera.height / 2;

		this.loading = game.add.sprite(centerX, centerY - 20, "loading");
		this.loading.anchor.setTo(0.5, 0.5);

		this.barBg = game.add.sprite(
			centerX,
			centerY + 40,
			"load_progress_bar_dark"
		);
		this.barBg.anchor.setTo(0.5, 0.5);

		this.bar = game.add.sprite(
			centerX - 192,
			centerY + 40,
			"load_progress_bar"
		);
		this.bar.anchor.setTo(0, 0.5);
		this.load.setPreloadSprite(this.bar);

		// onLoadComplete is dispatched when the final file in the load queue has been loaded/failed. addOnce adds that function as a callback, but only to fire once.
		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
	},

	loadAssets: function () {
		//  Load the Google WebFont Loader script
		game.load.script(
			"webfont",
			"//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"
		);

		game.load.spritesheet("character", "assets/images/characters.png", 48, 48);
		game.load.image("room_entrance", "assets/images/room_entrance.png");
		game.load.image("room_gems", "assets/images/room_gems.png");
		game.load.image("box", "assets/images/platform.png");
		game.load.image("box_ver", "assets/images/platform_ver.png");

		game.load.image("fade_white", "assets/images/fade_white.png");
		game.load.image("fade_black", "assets/images/fade_black.png");

		game.load.image("dialogue_large", "assets/images/dialogue_large.png");
		game.load.image("altar", "assets/images/altar.png");
		game.load.image("gem_blue", "assets/images/blue_gem.png");
		game.load.image("gem_red", "assets/images/red_gem.png");
		game.load.image("gem_green", "assets/images/green_gem.png");
		game.load.image("gem_yellow", "assets/images/yellow_gem.png");
		game.load.image("gem_purple", "assets/images/purple_gem.png");
		game.load.image("gem_gold", "assets/images/gold_gem.png");
		game.load.image("title", "assets/images/title.png");

		game.load.audio("bump", "assets/sounds/bump.ogg");
		game.load.audio("title", "assets/sounds/title.ogg");
		game.load.audio("theme", "assets/sounds/theme.ogg");
		game.load.audio("run", "assets/sounds/run.ogg");
		game.load.audio("click", "assets/sounds/click.ogg");
		game.load.audio("error", "assets/sounds/error.ogg");
		game.load.audio("angel", "assets/sounds/angel.ogg");

		game.load.json("dialogue", "assets/text/dialogue.json");
		this.game.add.plugin(PhaserInput.Plugin);
	},

	// create: function() {
	//     // Come back later to Menu
	//     game.state.start('Menu');
	//     //	game.state.start('Room_Gems');
	// },

	update: function () {
		if (!!this.ready) {
			// !! is "bang bang you're a boolean". Not sure why it's necessary here....
			this.game.state.start("Menu");
		}
	},

	onLoadComplete: function () {
		this.ready = true;
	},
};
