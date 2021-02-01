var game = new Phaser.Game(w, h, Phaser.AUTO, 'gameContainer');

createText="";
spaceBlub = "test";
//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['VT323']
    }

};

var BLACK_HEX_CODE = "#000000";

function FadableState() {}

FadableState.prototype = {
	createFadeTween: function (alphaFrom, alphaTo, fadeDuration) {
		fadeDuration = fadeDuration || 300;

		this.fadeGraphic = game.add.graphics(0, 0);
		this.fadeGraphic.beginFill(BLACK_HEX_CODE, 1);
		this.fadeGraphic.drawRect(0, 0, game.camera.width, game.camera.height);
		this.fadeGraphic.fixedToCamera = true;

		this.fadeGraphic.alpha = alphaFrom;
		this.fadeGraphic.endFill();

		var tween = game.add.tween(this.fadeGraphic);
		tween.to({alpha: alphaTo}, fadeDuration, null);
		return tween;
	},

	createFadeInTween: function(fadeDuration) {
		return this.createFadeTween(1, 0, fadeDuration);
	},

	createFadeOutTween: function(fadeDuration) {
		return this.createFadeTween(0, 1, fadeDuration);
	},

	fadeOut: function(callback, callbackContext, fadeDuration) {
		callbackContext = callbackContext ? callbackContext : this;

		var fadeOutTween = this.createFadeOutTween(fadeDuration);

		if(typeof callback === 'function') {
			fadeOutTween.onComplete.add(callback, callbackContext);
		}

		fadeOutTween.start();
	},

	fadeIn: function(callback, callbackContext, fadeDuration) {
		callbackContext = callbackContext ? callbackContext : this;

		var fadeInTween = this.createFadeInTween(fadeDuration);

		if(typeof callback === 'function') {
			fadeInTween.onComplete.add(callback, this);
		}

		fadeInTween.start();
	}
}

savegame = new SaveGame();


game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Character', Game.Character);
game.state.add('Room_Gems', Game.Gems);
game.state.add('Credits', Game.Credits);

game.state.start('Boot');
