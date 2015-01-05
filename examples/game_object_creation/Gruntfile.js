var path = require('path');

module.exports = function(grunt) {
  var t = grunt.template.process;
  var p = grunt.file.readJSON('package.json');

  var allStylesFilename = 'all_styles.css';
  var buildProdDir = 'build/prod/';
  var buildDevDir = 'build/dev/';
  var stylesDir = 'styles/';
  var stylesCssDir = 'styles/css/';
  var stylesLessDir = 'styles/less/';
  var generatedDir = 'generated/';
  var generatedCssDir = 'generated/css/'; 
  var configDir = 'config/';

  // Making sure that this path has the correct separator. Just in case.
  p.framework = p.framework.split(/[/|\\]/).join(path.sep);

  grunt.initConfig({
    pkg: p,

    'copy': {
      dev: {
        files: [
          { expand: true, src: 'assets/**', dest: buildDevDir },
          { expand: true, src: stylesCssDir + allStylesFilename, dest: buildDevDir },
          { expand: true, cwd: stylesDir, src: 'assets/**', dest: buildDevDir + stylesDir }
        ]
      },
      
      prod: {
        files: [
          { expand: true, src: 'assets/**', dest: buildProdDir },
          { expand: true, src: stylesCssDir + allStylesFilename, dest: buildProdDir },
          { expand: true, cwd: stylesDir, src: 'assets/**', dest: buildProdDir + stylesDir }
        ] 
      }
    },

    'shell': {
      // Run bower from grunt.
      bower: { 
        command: 'bower install' 
      },

      // Clone game-builder from github
      framework: {
        command: t('git clone -b <%= p.frameworkTag %> <%= p.frameworkRepo %> <%= p.framework %>', {data: {p:p}}) 
      }
    },

    'clean': {
      options: { force: true },

      // Clean the folder where game-builder is downloaded
      framework: {
        src: [path.join(p.framework)],
      },

      // Clean the folder of the development build
      'build-dev': {
        src: 'build/dev'
      },

      // Clean the folder of the production build
      'build-prod': {
        src: 'build/prod'
      }
    },

    open: {
      // Open index.html with the default browser
      index : { path : 'index.html' }
    },

    // Merge files to create asset-map.js
    'merge-json': {
      map: {
        src: [ generatedDir + 'asset-map.json', configDir + "remote-assets.json"],
        dest: generatedDir + 'asset-map.json'
      }
    },

    'less': {
      target: {
        options: {
          paths: [stylesLessDir],
          strictMath: true
        },
        files: [{
          expand: true,
          cwd: stylesLessDir,   
          src: ['*/style.less'],
          dest: generatedCssDir,
          rename: function(dest, src) {
            return dest + src.substring(0, src.indexOf('/')) + '.css';
          },
        }]
      }
    },

    'concat': {
      generated_sans_main: {
        files: [{
          expand: true,
          cwd: generatedCssDir,
          src: ['*.css', '!*main.css'],
          dest: stylesCssDir,
          rename: function(dest, src) {
            return dest + allStylesFilename;
          }
        }]
      },
      plain_sans_main: {
        files: [{
          expand: true,
          cwd: stylesCssDir,
          src: ['*.css', '!*main.css'],
          dest: stylesCssDir,
          rename: function(dest, src) {
            return dest + allStylesFilename;
          }
        }]
      },
      append_main: {
        files: [{
          expand: true,
          src: [stylesCssDir + allStylesFilename, generatedCssDir + 'main.css', stylesCssDir + 'main.css'],
          dest: stylesCssDir,
          rename: function(dest, src) {
            return dest + allStylesFilename;
          }
        }]
      }
    },

    'cssmin': {
      target: {
        options: {
          keepSpecialComments: 0
        },
        files: [{
          src: buildProdDir + stylesCssDir + allStylesFilename,
          dest: buildProdDir + stylesCssDir + allStylesFilename
        }]
      }
    },

    'requirejs': {
      options: {
        baseUrl: './',
        name: './lib/almond/almond',
        mainConfigFile: generatedDir + 'config.js',
        include: ['pre-load', 'main'],
        wrapShim: true,
        insertRequire: ['pre-load']
      },

      dev: {
        options: {
          out: buildDevDir + 'packaged.js',
          optimize: 'none',
          preserveLicenseComments: true
        }
      },

      prod: {
        options: {
          out: buildProdDir + 'packaged.js',
          optimize: 'uglify2',
          preserveLicenseComments: false
        }
      }
    },

    'create-config': {
      options: {
        configDir: configDir,
        generatedDir: generatedDir
      }
    },

    'local-assets': {
      options: {
        configDir: configDir,
        generatedDir: generatedDir
      }
    },

    'create-data-module': {
      target: {
        files: [
          { src: [generatedDir + 'asset-map.json'], dest: 'src/' },
          { src: [configDir + 'font-data.json'], dest: 'src/' }
        ]
      }
    },

    'create-build-index': {
      dev: {
        options: {
          buildDir: buildDevDir
        }
      },

      prod: {
        options: {
          buildDir: buildProdDir
        }
      }
    },

    'download-fonts': {
    	target: {
    		options: {
    			fontsDir: 'styles/assets/fonts/',
    			relativeFontsDir: '../assets/fonts/',
    			cssDir: 'styles/css/'
    		},

        files: [
          { src: 'http://fonts.googleapis.com/css?family=Exo:400,700' }
        ]
      }
    } 
  });

  // Npm goodness
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-merge-json');
  grunt.loadNpmTasks('grunt-file-append');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Local tasks
  grunt.loadTasks('tasks');
  
  // This taks creates requireJs modules out of .json files
  grunt.registerTask('data-modules', ['create-data-module']);
  // This task creates the asset map 
  grunt.registerTask('asset-map', ['local-assets', 'merge-json']);
  // This task creates all the requirejs configuration needed
  grunt.registerTask('config', ['create-config']);
  // This task downloads game-builder source code
  grunt.registerTask('framework', ['clean:framework', 'shell:framework']);  
  // This task builds the css stylesheet
  grunt.registerTask('css', ['less', 'concat:generated_sans_main', 'concat:plain_sans_main', 'concat:append_main']);
  // This task opens index.html
  grunt.registerTask('run', ['open:index']);
  // Refreshes all the data before opening index.html
  grunt.registerTask('refresh', ['css', 'asset-map', 'data-modules', 'config', 'open:index']);
  
  // This task sets up the development environment
    // Gets bower dependencies
    // Gets game-builder source
    // Builds the main stylesheet
    // Builds the asset map
    // Creates data modules
    // Generates requireJS configuration
  grunt.registerTask('setup', ['shell:bower', 'framework', 'css', 'asset-map', 'data-modules', 'config']);
  
  // Builds a development release, no minification
  grunt.registerTask('build-dev', ['clean:build-dev', 'requirejs:dev', 'copy:dev', 'create-build-index:dev']);
  // Builds a production release, js and css minified
  grunt.registerTask('build-prod', ['clean:build-prod', 'requirejs:prod', 'copy:prod', 'create-build-index:prod', 'cssmin']);

  // Default task sets up for development
  grunt.registerTask('default', ['setup']);
};