module.exports = function(grunt) {
  var files = [
    'colliders/Gruntfile.js', 
    'empty/Gruntfile.js',
    'extensions/Gruntfile.js',
    'fixed_state_machine/Gruntfile.js',
    'game_object_creation/Gruntfile.js',
    'game_object_nesting/Gruntfile.js',
    'keyboard/Gruntfile.js',
    'layering/Gruntfile.js',
    'logic_components/Gruntfile.js',
    'loose_state_machine/Gruntfile.js',
    'reclaimer/Gruntfile.js',
    'renderers/Gruntfile.js',
    'sound/Gruntfile.js',
    'timers/Gruntfile.js'
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