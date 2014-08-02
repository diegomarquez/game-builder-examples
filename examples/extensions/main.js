/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [aspect-ratio-resize](@@aspect-ratio-resize@@),
 * [basic-display-setup](@@basic-display-setup@@),
 * [pause](@@pause@@),
 * [resume](@@resume@@),
 * [layering-bundle](@@layering-bundle@@),
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	var game = gb.game;

	// These extensions add some punch to the basic setup
	game.add_extension(require("aspect-ratio-resize"));
	game.add_extension(require("basic-display-setup"));
	game.add_extension(require("pause"));
	game.add_extension(require("resume"));
	game.add_extension(require("activity-display"));
	
	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		require('layering-bundle').create();

		gb.add('Base_3', 'First', 'MainFront');
		gb.add('Base_2', 'First', 'MainMiddle');
		gb.add('Base_1', 'First', 'MainBack');
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("extensions has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("extensions has regained focus");
	});

	// This is called when the **pause** method of [game](@@game@@) is called
	// This event is added to [game](@@game@@) when using the [puase](@@puase@@) extensions
	game.on(game.PAUSE, this, function() {
		console.log("extensions has been paused");
	});

	// This is called when the **resume** method of [game](@@game@@) is called
	// This event is added to [game](@@game@@) when using the [resume](@@resume@@) extensions
	game.on(game.RESUME, this, function() {
		console.log("extensions has been resumed");
	});

	// This is the main update loop
	game.on(game.UPDATE, this, function() {
		// Do stuff here that needs constant updating
		
		// this.delta => Time delta between updates
		// this.context => 2D Context where stuff is drawn
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
