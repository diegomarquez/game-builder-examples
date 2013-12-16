define(function(require) {	
	var basic_game_object = require('basic_game_object'); 
	var box_renderer      = require('box_renderer');

	var BasicBundle = require('bundle').extend({
		create: function() {
			//Create the renderer components pool.
			//An Id, Class and amount are specified
			this.gameObjectPool.createPool("Base", basic_game_object, 1);
			this.componentPool.createPool("Box_Renderer", box_renderer, 1);
			
			//Create a configuration for the components in the pool
			//When a component with with ID 'Red_Renderer' is created, it will take this arguments
			//This particular render will draw a box with the specified parameters
			this.componentPool.createConfiguration("Red_Renderer", 'Box_Renderer')
				.args({	
					color:'#FF0000',
					offsetX: -50,
					offsetY: -50,
					width: 100,
					height: 100,
				  });			
			
			//Create a configuration for the game_objects in the pool
			//When a game_object with with ID 'Base_1' is created, it will take this arguments
			//NOTICE: The ID being sent in through setRenderer(), it mates the one just above.
			this.gameObjectPool.createConfiguration("Base_1", "Base")
				.args({x:this.canvas.width/2, y:this.canvas.height/2, rotation_speed: 3})
				.setRenderer('Red_Renderer');
		}
	});

	return new BasicBundle();
});