/* 
 * # Delegate
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 */

// Dependencies: @util, @class

// An implementation of a [Multicast Delegate](http://en.wikipedia.org/wiki/Delegation_pattern) 
// Sounds like a mouthful? The more friendly name is, 'Event system', which sounds about a million times less cool.

// Basically this class is a hash, with each key of the hash being an array of functions. 

// Add funtions using the .on() method, always providing an id and scope with the function.
// At some point in the future call the method .execute() with a given id, all the funtions registered under the id provided will be executed.
// Simple, flexible and powerful.
// Keep reading for method signatures.
define(["util", "class"], function(util) {
	var removeAllNulls = function(list) {
		for (var i = list.length - 1; i >= 0; i--) {
			var callbackObject = list[i];

			if (!callbackObject) {
				list.splice(i, 1);
			}
		}
	}

	var Delegate = Class.extend({
		init: function() {
			this.callbackList = {};
			this.list = null;
		},

		/**
		 * [Use this method to add functions to the delegate instance]
		 * @param  {[String]} name - Id that the function will be associated with
		 * @param  {[Object]} scope - scope of the function, most of the time you will be passing 'this'.
		 * @param  {Function} callback - Function you want to execute.
		 * @param  {[Boolean=false]} removeOnExecute - The function will be removed from the corresponding list, after executing it once.
		 * @param  {[Boolean=false]} inmediate - Execute function inmediatelly after adding it.
		 * @param  {[Boolean=false]} keepOnCleanUp - Save the function when executing the softCleanUp() method.
		 * @param  {[Boolean=false]} single - Do not add function if there is already one with the same id.
		 */
		on: function(name, scope, callback, removeOnExecute, inmediate, keepOnCleanUp, single) {
			if (!this.callbackList[name]) {
				this.callbackList[name] = [];
			}

			if (inmediate) {
				callback();
			}

			if (single) {
				if (this.callbackList[name].length == 1) {
					return;
				}				
			}

			this.callbackList[name].push({
				scope: scope,
				callback: callback,
				removeOnExecute: removeOnExecute,
				keep: keepOnCleanUp
			});
		},

		remove: function(name, scope, callback) {
			this.list = this.callbackList[name];

			if (!this.list) return;

			for (var i = this.list.length - 1; i >= 0; i--) {
				var callbackObject = this.list[i];

				if (scope === callbackObject.scope && callback === callbackObject.callback) {
					this.list.splice(i, 1);
				}
			}
		},

		removeAll: function(name) {
			var list = this.callbackList[name];

			if (list) {
				list.splice(0, list.lenght);
				list.lenght = 0;
				list = null;
			}
		},

		softCleanUp: function() {
			for (var k in this.callbackList) {
				this.list = this.callbackList[k];

				if (!this.list) return;

				for (var i = this.list.length - 1; i >= 0; i--) {
					var callbackObject = this.list[i];

					if (!callbackObject.keep) {
						this.list.splice(i, 1);
					}
				}
			}
		},

		hardCleanUp: function() {
			for (var k in this.callbackList) {
				this.removeAll(k);
			}
		},

		destroy: function() {
			util.destroyObject(this);
		},

		execute: function(name, args) {
			this.list = this.callbackList[name];

			if (!this.list) return;

			for (var i = 0; i < this.list.length; i++) {
				var callbackObject = this.list[i];

				if (!callbackObject) continue;

				callbackObject.callback.call(callbackObject.scope, args);

				if (callbackObject.removeOnExecute) {
					this.list[i] = null;
				}
			}

			removeAllNulls(this.list);
		}
	});

	return Delegate;
});