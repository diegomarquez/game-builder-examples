/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [root](@@root@@),
 * [complex-display-setup](@@complex-display-setup@@),
 * [input-bundle](@@input-bundle@@),
 */

define(function(require){	
	var gb = require('gb');

	// Storing some references to avoid excesive typing
	var game = gb.game;
	var root = gb.root;

	var keyboard = require('keyboard');
	var util = require('util');

	game.add_extension(require('complex-display-setup'));
	game.add_extension(require("activity-display"));

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		require('input-bundle').create();

		for (var i=0; i<20; i++) {
			var go = gb.add('Base_2', 'First', 'MainMiniFront');

			go.x = util.rand_f(20, (gb.canvas.width*3)-20);
			go.y = util.rand_f(20, (gb.canvas.height*9)-20);

			go.renderer.color = util.rand_color(); 
		}

		var minimapViewArea = gb.add('Frame', 'First', 'MiniFront');

		var v = gb.viewports.get('Main');

		keyboard.onKeyDown(keyboard.UP, this, function() { 
			v.y += 10; 
			minimapViewArea.y -= 10;
		});
		
		keyboard.onKeyDown(keyboard.DOWN, this, function() { 
			v.y -= 10; 
			minimapViewArea.y += 10;
		});
		
		keyboard.onKeyDown(keyboard.LEFT, this, function() { 
			v.x += 10; 
			minimapViewArea.x -= 10;
		});
		
		keyboard.onKeyDown(keyboard.RIGHT, this, function() { 
			v.x -= 10; 
			minimapViewArea.x += 10;
		});
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("viewports has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("viewports has regained focus");
	});

	// This is the main update loop
	game.on(game.UPDATE, this, function() {
		// Updates ALL the things.
		root.update(game.delta);
		// Draws ALL the things.
		root.draw(game.context);
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});