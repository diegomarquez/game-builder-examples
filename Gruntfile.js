module.exports = function(grunt) {
  var files = [
    'examples/colliders/Gruntfile.js', 
    'examples/empty/Gruntfile.js',
    'examples/extensions/Gruntfile.js',
    'examples/fixed_state_machine/Gruntfile.js',
    'examples/game_object_creation/Gruntfile.js',
    'examples/game_object_nesting/Gruntfile.js',
    'examples/keyboard/Gruntfile.js',
    'examples/layering/Gruntfile.js',
    'examples/logic_components/Gruntfile.js',
    'examples/loose_state_machine/Gruntfile.js',
    'examples/reclaimer/Gruntfile.js',
    'examples/renderers/Gruntfile.js',
    'examples/sound/Gruntfile.js',
    'examples/timers/Gruntfile.js'
  ];

  grunt.initConfig({
    hub: {
      refreshAll: {
        src: files,
        tasks: ['refresh'],

        options: {
          concurrent: files.length
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-hub');

  grunt.registerTask('default', ['hub:refreshAll']);
};