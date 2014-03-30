/**
 * # rendering-bundle.js
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
	var bitmap_renderer = require('bitmap-renderer');
	var path_renderer = require('path-renderer');

	var RenderingBundle = require('bundle').extend({
		create: function() {
			this.componentPool.createPool("Bitmap_Renderer", bitmap_renderer);
			this.componentPool.createPool("Path_Renderer", path_renderer);

			this.componentPool.createConfiguration("Pear_1", 'Bitmap_Renderer').args({ offset:'center', path: this.assetMap['80343865.JPG']});
			this.componentPool.createConfiguration("Pear_2", 'Bitmap_Renderer').args({ path: this.assetMap['80343865.JPG']});
			
			this.componentPool.createConfiguration("Path_1", 'Path_Renderer').args({ 
				name: 'Path',
				pathWidth: 10,
				pathHeight: 10,
				offset:'center',
				drawPath: function(context) {
					context.fillStyle = "#FF0000";
					context.fillRect(0, 0, 10, 10);
				}
			});

			this.gameObjectPool.createPool("Base", basic_game_object, 4); 

			this.gameObjectPool.createConfiguration("Base_1", "Base")
				.args({x: this.canvas.width/2 - 100, y: this.canvas.height/2, rotation_speed: -2, scaleX: 2})
				.setRenderer('Pear_1');

			this.gameObjectPool.createConfiguration("Base_2", "Base")
				.args({x: this.canvas.width/2 + 100, y: this.canvas.height/2, rotation_speed: 2})
				.setRenderer('Pear_2');

			this.gameObjectPool.createConfiguration("Base_3", "Base")
				.args({x: this.canvas.width/2, y: this.canvas.height/2 + 100, rotation_speed: 1})
				// BONUS: you can override the configuration of a component/renderer or just add additional parameters.
				// The object after the ID will be merged with the one set through createConfiguration
				.setRenderer('Pear_1', { width: 20, height: 20 });

			this.gameObjectPool.createConfiguration("Base_4", "Base")
				.args({x: this.canvas.width/2, y: this.canvas.height/2, rotation_speed: 3})
				.setRenderer('Path_1');
		}
	});

	return new RenderingBundle();
});
		