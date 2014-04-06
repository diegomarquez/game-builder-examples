/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [root](@@root@@),
 * [layers](@@layers@@),
 * [basic-layer-setup](@@basic-layer-setup@@),
 * [rendering-bundle](@@rendering-bundle@@)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;
	
	game.add_extension(require('basic-layer-setup'));

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		require('rendering-bundle').create();

		gb.addToLayer('Middle', 'Base_1');
		gb.addToLayer('Middle', 'Base_2');
		gb.addToLayer('Middle', 'Base_3');
		gb.addToLayer('Middle', 'Base_4');

		gb.addTextToLayer('Middle', 'Text_1', 'Text');
		gb.addTextToLayer('Middle', 'Text_2', 'Another Text');
		gb.addTextToLayer('Middle', 'Text_3', 'adsfjfghjsd');
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("renderers has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("renderers has regained focus");
	});

	// This is the main update loop
	game.on(game.UPDATE, this, function() {
		// Updates ALL the things.
		root.update(game.delta);
		// Draws ALL the things.
		root.transformAndDraw(game.context);
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
