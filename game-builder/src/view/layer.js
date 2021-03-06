/**
 * # layer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [delegate](@@delegate@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This is the type of objects that [viewport](@@viewport@@) uses to determine the order in which [game-objects](@@game-object@@)
 * should be drawn. Each [viewport](@@viewport@@) has an array of this type of objects.
 */

/**
 * Visual organization
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate"], function(Delegate) {

	var Layer = Delegate.extend({

		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 *
		 * @param {String} name The name of the layer
		 * @param {Viewport} viewport The [viewport](@@viewport@@) the layer belongs to
		 */
		init: function(name, viewport) {
			this.name = name;
			this.gameObjects = [];
			this.visible = true;
			this.viewport = viewport;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addGameObject</strong></p>
		 *
		 * Add a [game-object](@@game-object@@) to layer for rendering
		 *
		 * @param {Object} go The [game-object](@@game-object@@) to add
		 *
		 * @return {Object|null} The [game-object](@@game-object@@) that was just added or null if the [game-object](@@game-object@@) was already part of the layer
		 */
		addGameObject: function(go) {
			var index = this.gameObjects.indexOf(go);

			if (index == -1) {
				this.gameObjects.push(go);
				go.addToViewportList(this.viewport.name, this.name);

				return go;
			}

			return null;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeGameObject</strong></p>
		 *
		 * Remove a [game-object](@@game-object@@) from the layer
		 *
		 * @param {Object} go The [game-object](@@game-object@@) to remove
		 *
		 * @return {Object|null} The [game-object](@@game-object@@) that was just removed or null if the [game-object](@@game-object@@) was not part of the layer
		 */
		removeGameObject: function(go) {
			var index = this.gameObjects.indexOf(go);

			if (index != -1) {
				this.gameObjects.splice(index, 1);
				go.removeFromViewportList(this.viewport.name, this.name);

				return go;
			}

			return null;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeAll</strong></p>
		 *
		 * Removes all the [game-objects](@@game-object@@) from the layer
		 *
		 * @return {Array} All the [game-objects](@@game-object@@) that were just removed
		 */
		removeAll: function() {
			var gos = [];

			for (var i = 0; i < this.gameObjects.length; i++) {
				gos.push(this.removeGameObject(this.gameObjects[i]));
			}

			return gos;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draws all the [game-objects](@@game-object@@)
		 *
		 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 */
		draw: function(context) {
			if (!this.visible) return;

			for (var i = 0; i < this.gameObjects.length; i++) {
				var go = this.gameObjects[i];

				if (go.isContainer()) {
					// If the game object is a container game object...
					// Call draw method, it will figure out if it actually needs to be drawn, and do the same for it's children
					go.draw(context, this.viewport);
				} else {
					// If the game object is a regular game object...
					// Try to skip drawing as soon as possible

					// Draw only if inside the viewport and is allowed to be drawn
					if (go.canDraw && this.viewport.isGameObjectInside(go, context)) {
						go.draw(context, this.viewport);
					}
				}
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>show</strong></p>
		 *
		 * Make the layer visible
		 */
		show: function() {
			this.visible = true;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>showGameObjects</strong></p>
		 *
		 * Call the **show** method on all the [game-objects](@@game-object@@) in this layer
		 */
		showGameObjects: function() {
			for (var i = 0; i < this.gameObjects.length; i++) {
				this.gameObjects[i].show();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hide</strong></p>
		 *
		 * Make the layer invisible
		 */
		hide: function() {
			this.visible = false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hideGameObjects</strong></p>
		 *
		 * Call the **hide** method on all the [game-objects](@@game-object@@) in this layer
		 */
		hideGameObjects: function() {
			for (var i = 0; i < this.gameObjects.length; i++) {
				this.gameObjects[i].hide();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>moveGameObjectToFront</strong></p>
		 *
		 * Moves the specified [game-object](@@game-object@@) to the front of the layer
		 * This means it becomes the last object to be rendered
		 *
		 * @param {Object} go
		 */
		moveGameObjectToFront: function(go) {
			var index = this.gameObjects.indexOf(go);

			if (index != -1) {
				this.gameObjects.splice(index, 1);
				this.gameObjects.push(go);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>moveGameObjectToBack</strong></p>
		 *
		 * Moves the specified [game-object](@@game-object@@) to the back of the layer
		 * This means it becomes the first object to be rendered
		 *
		 * @param {Object} go
		 */
		moveGameObjectToBack: function(go) {
			var index = this.gameObjects.indexOf(go);

			if (index != -1) {
				this.gameObjects.splice(index, 1);
				this.gameObjects.unshift(go);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isVisible</strong></p>
		 *
		 * Wether the layer is visible or not
		 *
		 * @return {Boolean}
		 */
		isVisible: function() {
			return this.visible;
		}
		/**
		 * --------------------------------
		 */
	});

	return Layer;
});
