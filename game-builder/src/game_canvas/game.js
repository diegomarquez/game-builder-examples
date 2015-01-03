/**
 * # game.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [delegate](@@delegate@@)
 *
 * Depends of:
 * [root](@@root@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines the object which is responsible for the main update loop of the application.
 *
 * It does so by using [request animation frame](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
 *
 * It also hooks into the focus and blur events of [window](https://developer.mozilla.org/en-US/docs/Web/API/window),
 * in order to be able to pause and resume the application if needed.
 *
 * It's main behaviour can be extended by the use of [extensions](@@extension@@)
 *
 * ### Game extends [delegate](@@delegate@@) so it provides a few events to hook into:
 *
 * ### **create**
 * On application startup
 *
 * ``` javascript
 * game.on(game.CREATE, function(repeatsLeft) {});
 * ```
 *
 * ### **blur**
 * When the application looses focus
 *
 * ``` javascript
 * game.on(game.BLUR, function() {});
 * ```
 *
 * ### **focus**
 * When the application gains focus
 *
 * ``` javascript
 * game.on(game.FOCUS, function() {});
 * ```
 *
 * ### **update**
 * On each update cycle
 *
 * The delta time between update cycles is sent to registered callbacks
 * ``` javascript
 * game.on(game.UPDATE, function(delta) {});
 * ```
 */

/**
 * Main Update loop
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
  var delegate = require("delegate");
  var root = require("root");

  var Game = delegate.extend({
    init: function() {
      this._super();

      this.focus = true;
      this.blur = true;
      this.initialized = false;
      this.lastUpdate = Date.now();
      this.delta = null;

      // A reference to the main div in the corresponding index.html file
      this.mainContainer = null;
      // A reference to the canvas
      this.canvas = null;
      // A reference to the context of the canvas
      this.context = null;
    },

    /**
     * <p style='color:#AD071D'><strong>execute_extensions</strong></p>
     *
     * Executes all the extensions for the given state of the application
     *
     * @param  {String} state The state of the application. ej. 'create'
     */
    execute_extensions: function(state) {
      for(var i=0; i<this.extensions[state].length; i++) {
      	var ex = this.extensions[state][i];

        ex.extension.execute(ex.args);
      }
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>add_extension</strong></p>
     *
     * Use this to add extensions.
     *
     * @param {[extension](@@extension@@)} extensionModule A module that extends [extension](@@extension@@)
     * @param {Object=null} args An object with arguments that will be passed to the extension when it is executed
     */
    add_extension: function(extensionModule, args) {
      var ex = new extensionModule();
      
      this.extensions[ex.type()].push({
      	extension: ex,
      	args: args
      });

      if (this.initialized && ex.type() == this.CREATE) {
      	ex.execute(args);
      }
    },
    /**
     * --------------------------------
     */
    
    /**
     * <p style='color:#AD071D'><strong>get_extension</strong></p>
     *
     * Use this to get an instance of a currently active [extension](@@extension@@).
     *
     * @param {[extension](@@extension@@)} extensionModule The constructor for the [extension](@@extension@@) to retrieve
     *
     * @return {[extension](@@extension@@)} The matching [extension](@@extension@@) 
     */
    get_extension: function(extensionModule) {
      for (var t in this.extensions) {
    		var list = this.extensions[t];
    		
    		for (var i = list.length-1; i >= 0; i--) {
	    		if (list[i].extension.constructor === extensionModule) {
	    			return list[i].extension;
	    		}
	    	}	
    	}
    },
    /**
     * --------------------------------
     */
    
    /**
     * <p style='color:#AD071D'><strong>remove_extension</strong></p>
     *
     * Use this to remove extensions.
     *
     * @param {[extension](@@extension@@)} extensionModule The [extension](@@extension@@) module to remove
     */
    remove_extension: function(extensionModule) {     
    	for (var t in this.extensions) {
    		var list = this.extensions[t];

    		for (var i = list.length-1; i >= 0; i--) {
	    		if (list[i].extension.constructor === extensionModule) {
	    			list[i].extension.destroy();
	    			list.splice(i, 1);
	    		}
	    	}	
    	}
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>create</strong></p>
     *
     * The main method that will kick start everything.
     *
     * This method does a bunch of things. The main one being setting up the update loop
     * using [request animation frame](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
     *
     * The focus and blur events are also setup here.
     *
     * If the application does not have focus as soon as it starts, it waits until it has focus
     * to setup the update loop.
     *
     * @param  {ElementObject} mainContainer The Dom element that contains the canvas
     * @param  {Canvas} canvas A [Canvas](https://developer.mozilla.org/en-US/docs/HTML/Canvas) object
     */
    create: function(mainContainer, canvas) {
      this.mainContainer = mainContainer;
      this.canvas = canvas;
      this.context = this.canvas.getContext("2d");

      var mainLoop;
      var self = this;

      // This styling puts the canvas at the top left
      mainContainer.style.position = 'relative';

      document.querySelector('html').style.margin = 0;
      document.querySelector('html').style.padding = 0;
      document.querySelector('body').style.margin = 0;
      document.querySelector('body').style.padding = 0;
      document.querySelector('div').style.margin = 0;
      document.querySelector('div').style.padding = 0;
      document.querySelector('canvas').style.margin = 0;
      document.querySelector('canvas').style.padding = 0;

      // When this is called the application has trully started.
      var setupUpdateLoop = function() {
        self.initialized = true;
        // Execute all create extensions
        self.execute_extensions(self.CREATE);
        // Execute all create events
        self.execute(self.CREATE);

        var now;

        mainLoop = function() {
          now = Date.now();
          self.delta = (now - self.lastUpdate) / 1000;
          self.lastUpdate = now;

          // Execute all update extensions
          self.execute_extensions(self.UPDATE);
          // Update all [game-objects](@@game-objects@@)
          root.update(self.delta);
          // Execute all update events
          self.execute(self.UPDATE);
          // Draw to all the [viewports](@@viewport@@)
          root.draw(self.context);

          window.requestAnimationFrame(mainLoop);
        }

        var vendors = ['ms', 'moz', 'webkit', 'o'];

        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
          window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = function(callback) {
            return window.setTimeout(callback, 1000 / 60);;
          };
        }

        if (!window.cancelAnimationFrame) {
          window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
          };
        }

        self.lastUpdate = Date.now();

        window.requestAnimationFrame(mainLoop);
      };

      // The blur and focus event callbacks
      // Plus additional logic so that they don't get executed
      // more than needed.
      var blur = false;

      var onBlur = function() {
        var oldBlur = self.blur;

        if (self.blur) {
          self.blur = false;
          self.focus = true;

          if (!blur) {
            // Execute all blur state extensions
            self.execute_extensions(self.BLUR);
            // Execute all blur events
            self.execute(self.BLUR);

            blur = true;
          }
        }

        return oldBlur;
      };

      var onFocus = function() {
        var oldFocus = self.focus;

        // In the case the game is not already created when the document gains focus
        // for the first time, it is created here.
        if (!self.initialized) {
          setupUpdateLoop();
        } else {
          if (self.focus) {
            self.blur = true;
            self.focus = false;

            if (blur) {
              // Execute all focus state extensions
              self.execute_extensions(self.FOCUS);
              // Execute all blur events
              self.execute(self.FOCUS);

              blur = false;
            }
          }
        }

        return oldFocus;
      }

      // References to the blur and focus callbacks
      // The [pause](@@pause@@) and [resume](@@resume@@)
      // extensions use these.
      this.blurAction = onBlur;
      this.focusAction = onFocus;

      // Actually setting up the listener to the events
      // window dispatches.
      window.addEventListener("blur", onBlur);
      window.addEventListener("focus", onFocus);

      // Making sure we have focus setting up the update loop.
      // If there is no focus, wait until it is gained to setup the update loop.
      if (document.hasFocus()) {
        setupUpdateLoop();
      }
    }
    /**
     * --------------------------------
     */
  });

  // ### Getters for all the types of events game can hook into
  Object.defineProperty(Game.prototype, "CREATE", { get: function() { return 'create'; } });
  Object.defineProperty(Game.prototype, "UPDATE", { get: function() { return 'update'; } });
  Object.defineProperty(Game.prototype, "FOCUS", { get: function() { return 'focus'; } });
  Object.defineProperty(Game.prototype, "BLUR", { get: function() { return 'blur'; } });

  Object.defineProperty(Game.prototype, "CHANGE_WIDTH", { get: function() { return 'change_width'; } });
  Object.defineProperty(Game.prototype, "CHANGE_HEIGHT", { get: function() { return 'change_height'; } });

  Object.defineProperty(Game.prototype, "WIDTH", { 
  	get: function() {
  		return this.canvas.width;
  	},
  	set: function (value) { 
	  	this.canvas.width = value;
	  	this.execute(this.CHANGE_WIDTH, value); 
	  } 
	});

  Object.defineProperty(Game.prototype, "HEIGHT", { 
  	get: function() {
  		return this.canvas.height;
  	},
  	set: function (value) { 
  		this.canvas.height = value;
  		this.execute(this.CHANGE_HEIGHT, value); 
  	} 
  });

  var game = new Game();

  game.prototype = Game.prototype;

  game.extensions = {
    'create': [],
    'update': [],
    'focus': [],
    'blur': []
  };

  return game;
});
