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

  var checkValidCommitMessage = function() {
    if(!grunt.option('message')) {
      grunt.fail.fatal('Missing commit message');  
    }

    if(grunt.util.kindOf(grunt.option('message')) != 'string') {
      grunt.fail.fatal('Missing commit message'); 
    }

    if(grunt.option('message').length < 10) {
      grunt.fail.fatal('Commit message is too short. Must be greater than 10 characters');  
    }
  };

  grunt.initConfig({
    commitMessage: grunt.option('message'),

    hub: {
      buildAll: {
        src: files,
        tasks: ['build'],

        options: {
          concurrent: files.length
        }
      }
    },

    shell: {
      pushExamples: {
        command: function() {
          checkValidCommitMessage();

          return [ 
            'git add . -A',
            'git diff --quiet --exit-code --cached || git commit -m "<%= commitMessage %>. Pushed by grunt on <%= grunt.template.today("yyyy-mm-dd") %>"',
            'git push -f'
          ].join('&&');   
        }
      },

      pushGameBuilder: {
        command: function() {
          checkValidCommitMessage();

          return [
            'cd game-builder',
            'git add . -A',
            'git diff --quiet --exit-code --cached || git commit -m "<%= commitMessage %>. Pushed by grunt on <%= grunt.template.today("yyyy-mm-dd") %>"',
            'git push -f',
            'cd ..'
          ].join('&&');
        }
      },

      options: {
        stdout: true
      }    
    } 
  });

  grunt.loadNpmTasks('grunt-hub');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['hub:refreshAll']);

  grunt.registerTask('push', ['shell:pushExamples', 'shell:pushGameBuilder']);
};