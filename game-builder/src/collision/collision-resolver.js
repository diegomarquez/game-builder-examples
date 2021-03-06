/**
 * # collision-resolver.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 * [sat](@@sat@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This organizes the colliders into pairs of groups. The first collection of each pair, is tested against
 * the second collection for colliders. There isn't much more to it.
 *
 * Worth noting is that the module only checks for overlaps, there is no projection. For the type
 * of projects [Game-Builder](http://diegomarquez.github.io/game-builder) attempts to tackle, it should
 * be enough.
 *
 * Also important is the fact there is no
 * [broad-phase](http://www.htmlgoodies.com/html5/client/broad-phase-collision-detection-using-spatial-partitioning.html#fbid=fsD5-BRjvS-)
 * of any kind in this collision detection system.
 * Again this shouldn't be too much of a problem for simple stuff.
 *
 * You could always implement a better collision system if you know how to,
 * as all things regarding collision detection are not coupled in anyway to the core of [Game-Builder](http://diegomarquez.github.io/game-builder)
 * But I think that for prototypes is largely unnecessary.
 */

/**
 * Resolve collisions
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['sat'], function(SAT) {

	var CollisionResolver = function() {
		this.collisionLists = {};
		this.toCollideCache = {};

		this.response = new SAT.Response();
		this.invertedResponse = new SAT.Response();
	};

	/**
	 * <p style='color:#AD071D'><strong>addToCollisionList</strong></p>
	 *
	 * Adds a component to a collision list.
	 *
	 * The component is added to the correponding lists, depending on it's collision id.
	 *
	 * @param {Object} collisionComponent An object extending [collision-component](@@collision-component@@)
	 */
	CollisionResolver.prototype.addToCollisionList = function(collisionComponent) {
		var indexes = this.toCollideCache[collisionComponent.id];

		if (indexes != null && indexes.length > 0) {
			for (var i = 0; i < indexes.length; i++) {
				this.collisionLists[indexes[i]].push(collisionComponent);
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>removeFromCollisionList</strong></p>
	 *
	 * Removes a component from a collision list.
	 *
	 * The component is removed from the corresponding lists, depending on it's collision id.
	 *
	 * @param {Obejct} collisionComponent An object extending [collision-component](@@collision-component@@)
	 */
	CollisionResolver.prototype.removeFromCollisionList = function(collisionComponent) {
		var indexes = this.toCollideCache[collisionComponent.id];

		if (indexes != null && indexes.length > 0) {
			for (m = indexes.length - 1; m >= 0; m--) {
				this.collisionLists[indexes[m]].splice(this.collisionLists[indexes[m]].indexOf(collisionComponent), 1);
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>addCollisionPair</strong></p>
	 *
	 * Use this method to setup collision pairs.
	 *
	 * @param {String} first The collidionId of the first group in the pair
	 * @param {String} second The collidionId of the second group in the pair
	 */
	CollisionResolver.prototype.addCollisionPair = function(first, second) {
		if (this.collisionLists[first] == null) {
			this.collisionLists[first] = [];
		}

		if (this.toCollideCache[second] == null) {
			this.toCollideCache[second] = [];
		}

		this.toCollideCache[second].push(first);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>removeCollisionPair</strong></p>
	 *
	 * Use this method to setup remove a collision pairs.
	 *
	 * @param {String} first The collidionId of the first group in the pair
	 * @param {String} second The collidionId of the second group in the pair
	 */
	CollisionResolver.prototype.removeCollisionPair = function(first, second) {
		this.collisionLists[first] = null;
		this.toCollideCache[second] = null;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>areColliding</strong></p>
	 *
	 * This is the actual method that does the magic.
	 *
	 * This method will make the appropiate tests according to the type of the colliders involved.
	 *
	 * @param {Object} first The first [collision-component](@@collision-component@@) in the test
	 * @param {Object} second The second [collision-component](@@collision-component@@) in the test
	 * @return {Boolean} Whether there was a collision
	 */
	CollisionResolver.prototype.areColliding = function(first, second) {
		if (first.collider == null || second.collider == null) {
			return false;
		}

		var collisionMethodKey = first.colliderType + second.colliderType;

		if (first.getResponse || second.getResponse) {
			this.invertedResponse.clear();
			this.response.clear();

			return this.collisionMethodPairs[collisionMethodKey](first.collider, second.collider, this.response);
		} else {
			return this.collisionMethodPairs[collisionMethodKey](first.collider, second.collider);
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>getLastResponse</strong></p>
	 *
	 * Get the last response from a collision check
	 *
	 * @return {Object} The response object
	 */
	CollisionResolver.prototype.getLastResponse = function() {
		return this.response;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>getLastInvertedResponse</strong></p>
	 *
	 * Get the last inverted response from a collision check
	 *
	 * @return {Object} The response object
	 */
	CollisionResolver.prototype.getLastInvertedResponse = function() {
		this.invertedResponse.copy(this.response);
		this.invertedResponse.invert();

		return this.invertedResponse;
	};
	/**
	 * --------------------------------
	 */

	// These variables are used by the concrete implementations of colliders to decide what
	// type of collider they are, and hence, which method should be used when checking for collisions
	// between them.
	CollisionResolver.prototype.circleCollider = 'circle';
	CollisionResolver.prototype.polygonCollider = 'polygon';
	CollisionResolver.prototype.fixedPolygonCollider = 'fixed';

	CollisionResolver.prototype.collisionMethodPairs = {
		'circlecircle': SAT.testCircleCircle,
		'circlepolygon': SAT.testCirclePolygon,
		'circlefixed': SAT.testCirclePolygon,
		'polygoncircle': SAT.testPolygonCircle,
		'polygonpolygon': SAT.testPolygonPolygon,
		'polygonfixed': SAT.testPolygonPolygon,
		'fixedcircle': SAT.testPolygonCircle,
		'fixedpolygon': SAT.testPolygonPolygon,
		'fixedfixed': SAT.testPolygonPolygon
	}

	return new CollisionResolver();
});
