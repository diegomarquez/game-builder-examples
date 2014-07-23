/**
 * # input-bundle.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [bundle](@@bundle@@)
 *
 * Depends of:
 * [basic-game-object](@@basic-game-object@@)
 * [box-renderer](@@box-renderer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This is an example on how to encapsulate the logic needed to setup the [game-object-pool](@@game-object-pool@@)
 * and the [component-pool](@@component-pool@@)
 */

/**
 * --------------------------------
 */
define(function(require) {
	var basic_game_object = require('basic-game-object');
	var game_object = require('game-object'); 
	var box_renderer = require('box-renderer');
	var path_renderer = require('path-renderer');
	var gb = require('gb');

	var CollidersBundle = require('bundle').extend({
		create: function() {
			this.componentPool.createPool("box-renderer", box_renderer);
			this.componentPool.createPool("path-renderer", path_renderer);
			
			this.componentPool.createConfiguration("Small_box", 'box-renderer')
				.args({
					offsetX: -10, 
					offsetY: -10, 
					width: 20, 
					height: 20
				});

			this.componentPool.createConfiguration("Large_box", 'path-renderer')
				.args({
					skipCache: true, 
					drawPath: function(context) {
						context.save();

						context.beginPath();
	        			context.rect(0, 0, gb.canvas.width, gb.canvas.height);
		        		context.lineWidth = 10;
		        		context.strokeStyle = "#FFFFFF";
		        		context.stroke();        	
						context.closePath();
						
						context.restore();
					}
				});

			this.gameObjectPool.createPool("Base", basic_game_object, 20);
			this.gameObjectPool.createPool("FrameBase", basic_game_object, 1);
			
			this.gameObjectPool.createConfiguration("Base_2", "Base")
				.args({x: 200, y: 200, rotation_speed: 2})
				.setRenderer('Small_box');

			this.gameObjectPool.createConfiguration("Frame", "FrameBase")
				.args({x: 0, y: 0})
				.setRenderer('Large_box');
		}
	});

	return new CollidersBundle();
});
	