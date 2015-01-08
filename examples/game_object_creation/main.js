/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [game](@@game@@),
 * [gb](@@gb@@),
 * [game-object-pool](@@game-object-pool@@),
 * [component-pool](@@component-pool@@),
 * [assembler](@@assembler@@),
 * [groups](@@groups@@)
 * [viewports](@@viewports@@)
 * [basic-display-setup](@@basic-display-setup@@),
 * [basic-game-object](@@basic-game-object@@),
 * [box-renderer](@@box-renderer@@)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	// Storing some references to avoid excesive typing
	var game = gb.game;
	var assembler = gb.assembler;
	var gameObjectPool = gb.goPool;
	var componentPool = gb.coPool;
	var groups = gb.groups;
	var viewports = gb.viewports;
	var canvas = gb.canvas;

	// This piece of code takes care of creating a basic display structure.
	// it adds 3 [groups](@@group@@) to work with, 'First', 'Second' and 'Third'
	// This groups control the updating order
	// The [viewports](@@viewport@@) are set up here aswell, in this case there is a single one called 'Main'
	game.add_extension(require('basic-display-setup'));
	game.add_extension(require("activity-display"));
	
	// Getting the prototype for [basic-game-object](@@basic-game-object@@)
	var basic_game_object = require('basic-game-object'); 
	// Getting the prototype for [box-renderer](@@box-renderer@@) component
	var box_renderer = require('box-renderer');

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log('Welcome to Game-Builder!');
		// Create a pool of [box-renderer](@@box-renderer@@) objects and give it the id **Box_Renderer**.
		// This is later used to create configurations for this type of objects.
		componentPool.createPool('Box_Renderer', box_renderer);
		
		// Create a **Red_Renderer** configuration for the components in the **Box_Renderer** pool.
		// When a [component](@@component@@) with with id **Red_Renderer** is requested, an object in the **Box_Renderer** pool
		// will be taken and have these agruments applied to it.
		// This particular render will draw a box with the specified parameters.
		componentPool.createConfiguration('Red_Renderer', 'Box_Renderer')
			.args({	
				color:'#FF0000',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100,
			  });

		// Create a [basic-game-object](@@basic-game-object@@) pool and give it the id **Base**.
		// The last arguments specifies the amount of objects to create in the pool. In this case 1.
		gameObjectPool.createPool('Base', basic_game_object, 1);

		// Create a **Base_1** configuration for the [game-objects](@@game-object@@) in the pool **Base**
		// When a [game-object](@@game-object@@) with with id **Base_1** is requested, 
		// it will take this arguments.
		// **NOTICE: The id being sent in through setRenderer(), it matches the one of the component configuration above.**
		gameObjectPool.createConfiguration('Base_1', 'Base')
			.args({x:canvas.width/2, y:canvas.height/2, rotation_speed: 3})
			.setRenderer('Red_Renderer');

		// Use the [assembler](@@assembler@@) to put 
		// together the [game-object](@@game-object@@) with id **Base_1**. 
		// In the process it applies all the configurations we just set.
		var go = assembler.get('Base_1');
		// Use the [groups](@@groups@@) module to 
		// add the [game-object](@@game-object@@) an updating [group](@@group@@)
		groups.get('First').add(go);
		// Use the [viewports](@@viewports@@) module to 
		// add the [game-object](@@game-object@@) a rendering [layer](@@layer@@)
		viewports.get('Main').addGameObject('Back', go);
		// Start the [game-object](@@game-object@@). 
		// If this is not called, it is not updated nor drawn.
		go.start();
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log('game-object-creation has lost focus');
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log('game-object-creation has regained focus');
	});

	// This is the main update loop
	game.on(game.UPDATE, this, function() {
		// Do stuff here that needs constant updating
		
		// this.delta => Time delta between updates
		// this.context => 2D Context where stuff is drawn
	});

	// This is the main setup that kicks off the whole thing
	game.create();
});
