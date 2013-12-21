// keyboard's main entry point 

define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;

	
	// This is the main initialization function
	game.on("init", this, function() {
		console.log("Welcome to Game-Builder!");
	});

	// This is called when the canvas looses focus
	game.on("blur", this, function() {
		console.log("keyboard is now paused");
	});

	// This is called when the canvas regains focus
	game.on("focus", this, function() {
		console.log("keyboard resumes action");
	});

	// This is the main update loop
	game.on("update", this, function() {
		// Updates ALL the things.
		root.update(game.delta);
		// Draws ALL the things.
		root.transformAndDraw(game.context);
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
