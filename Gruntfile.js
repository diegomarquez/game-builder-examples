module.exports = function(grunt) {
  var folders = [
    'colliders', 
    'empty',
    'extensions',
    'fixed_state_machine',
    'game_object_creation',
    'game_object_nesting',
    'keyboard',
    'layering',
    'logic_components',
    'loose_state_machine',
    'reclaimer',
    'renderers',
    'sound',
    'timers',
    'viewports'
  ];

  var files = folders.map(function(folder) {
    return 'examples/' + folder + '/Gruntfile.js';
  });

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
        tasks: ['setup']
      },

      options: {
        concurrent: 1
      }
    },

    shell: {
      pushExamples: {
        command: function() {
          checkValidCommitMessage();

          return [ 
            'git add . -A',
            'git diff --quiet --exit-code --cached || git commit -m "<%= commitMessage %>. Pushed by grunt."',
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
            'git diff --quiet --exit-code --cached || git commit -m "<%= commitMessage %>. Pushed by grunt."',
            'git push -f',
            'cd ..'
          ].join('&&');
        }
      },

      pullGameBuilder: {
      	command: function() {
          return [
            'cd game-builder',
            'git pull',
            'cd ..'
          ].join('&&');
        }
      },

      npmInstall: {
        command: function(path) {
          return [ 
            'cd ' + path,
            'npm install',
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

  grunt.registerTask('npmAll', function() {
    for(var i=0; i<folders.length; i++) {
      grunt.task.run('shell:npmInstall:'+folders[i])
    }
  });

  grunt.registerTask('default', ['npmAll', 'hub:buildAll']);

  grunt.registerTask('push', ['shell:pullGameBuilder', 'shell:pushExamples', 'shell:pushGameBuilder']);
};