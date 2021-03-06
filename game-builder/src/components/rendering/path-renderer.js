/**
 * # path-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [renderer](@@renderer@@)
 *
 * Depends of: 
 * [path-cache](@@path-cache@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This renderer is similar to [bitmap-renderer](@@bitmap-renderer@@) but instead of drawing an external image
 * it receives a function that defines a path to draw on a [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).
 * 
 * The module will take care of caching the drawing into a separate canvas and drawing from there, instead of executing all the path instructions
 * each frame. 
 * 
 * This renderer can receive a bunch of configuration options
 * when setting it up in the [component-pool](@@component-pool@@). ej.
 *
 * ``` javascript
 * gb.coPool.createConfiguration("Path", 'Path_Renderer')
 	.args({ 
 		//This name is used to identify the cached drawing
 		//This is required
		name: 'RendererName',

		//These set the total width and height of the path
		//This argument is only required if the renderer does not provide it. 
		width: 100,
		height: 100,
	
		//This determines if the path is cached or not, by default it is cached
		//Skipping caching is adviced for dynamic drawing
		skipCache: true

		//Use this to define the path this renderer will draw
		//This argument is only required if the renderer does not provide it. 
		drawPath: function(context) { 'path definition goes here' }

 		//Use this if you want the registration point of the image to be the center
 		//This is optional
		offset:'center',

		//If offset is not provided this two are used
		//These are optional and default to 0
		offsetX:0,
		offsetY:0
 *	});
 * ```
 * <strong>Note: The snippet uses the reference to the <a href=@@component-pool@@>component-pool</a>
 * found in the <a href=@@gb@@>gb</a> module. 
 * The way you get a hold to a reference to the <a href=@@csomponent-pool@@>component-pool</a>
 * may vary.</strong>
 */

/**
 * Cache Paths
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["renderer", "path-cache", "error-printer"], function(Renderer, PathCache, ErrorPrinter) {

	var PathRenderer = Renderer.extend({
		init: function() {
			this._super();

			this.cache = PathCache;
		},

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * This is called by the [game-object](@@game-object@@) using this renderer.
		 * It caches the results of executing the **drawPath** method.
		 *
		 * @throws {Error} If width and height properties are not set
		 */
		start: function(parent) {
			if (this.skipCache) return;

			if (!this.width && !this.height) {
				ErrorPrinter.missingArgumentError('Path Renderer', 'width', 'height');
			}

			if (!this.name) {
				ErrorPrinter.missingArgumentError('Path Renderer', 'name');
			}

			this.cache.cache(this.name, this.width, this.height, function(context) {
				this.drawPath(context);
			}.bind(this));
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>drawPath</strong></p>
		 *
		 * This method must define the path that will be cached.
		 *
		 * @param  {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 * @param  {Object} viewport     The [viewport](@@viewport@@) this renderer is being drawn to
		 * 
		 * @throws {Error} If it is not overriden by child classes or redifined in some other way
		 */
		drawPath: function(context, viewport) {
			ErrorPrinter.mustOverrideError('Path Renderer');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draws the cached path into the canvas, applying configured properties,
		 * like **scaleX**, **scaleY** and **offsets**
		 * 
		 * @param  {Context 2D} context     [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 * @param  {Object} viewport     The [viewport](@@viewport@@) this renderer is being drawn to
		 */
		draw: function(context, viewport) {
			if (this.skipCache) {
				this.drawPath(context, viewport);
			} else {
				var canvas = this.cache.get(this.name);

				if (!canvas)
					return;

				if (this.tinted) {
					var tintedCanvas = this.tintImage(this.name, canvas);

					context.drawImage(tintedCanvas,
						Math.floor(this.rendererOffsetX()),
						Math.floor(this.rendererOffsetY()),
						Math.floor(this.rendererWidth()),
						Math.floor(this.rendererHeight())
					);
				} else {
					context.drawImage(canvas,
						Math.floor(this.rendererOffsetX()),
						Math.floor(this.rendererOffsetY()),
						Math.floor(this.rendererWidth()),
						Math.floor(this.rendererHeight())
					);
				}
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererOffsetX</strong></p>
		 *
		 * @return {Number} The offset in the X axis of the renderer
		 */
		rendererOffsetX: function() {
			if (this.offset === 'center') {
				return -this.rendererWidth() / 2 + this.offsetX;
			} else {
				return this.offsetX;
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererOffsetY</strong></p>
		 *
		 * @return {Number} The offset in the Y axis of the renderer
		 */
		rendererOffsetY: function() {
			if (this.offset === 'center') {
				return -this.rendererHeight() / 2 + this.offsetY;
			} else {
				return this.offsetY;
			}
		},
		/**
		 * --------------------------------
		 */
	});

	return PathRenderer;
});
