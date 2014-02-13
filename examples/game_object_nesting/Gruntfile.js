var path = require('path');

module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    shell: {
      bower: { command: 'bower install' }
    },

    bower: {
      requireJS: { rjsConfig: 'config.js' }
    },

    open: {
      index : { path : 'index.html' }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-bower-requirejs');

  grunt.registerTask('buildConfig', function() {
    var paths = [];

    paths.push(pkg.additionalSrcPaths);
    paths.push(pkg.additionalLibPaths);
    paths.push(pkg.framework);
    paths.push(pkg.lib);

    var files = [];

    for(var i=0; i<paths.length; i++) {
      if(paths[i] != "") {
        files = files.concat(grunt.file.expand(paths[i] + '/**/*.js'));  
      }
    }

    paths = [];

    for(var i=0; i<files.length; i++) {
      var base = path.basename(files[i], '.js');
      var dir = path.dirname(files[i]);
      var p = dir + path.sep + base;
    
      paths.push({alias:base, path:p});
    }

    var r = grunt.template.process('require.config({ \n\t paths: { \n\t\t <% paths.forEach(function(pathObject) { %>"<%= pathObject.alias %>": "<%= pathObject.path %>", \n\t\t <% }); %> \n\t } \n });', 
    {data: { paths: paths }});

    var name = 'config.js'

    if (grunt.file.isFile(name)) {
      grunt.file.delete(name, {force: true});  
    }
    grunt.file.write(name, r);
  });

  grunt.registerTask('config', ['buildConfig', 'bower:requireJS']);
  grunt.registerTask('run', ['open:index']);

  grunt.registerTask('build', ['shell:bower', 'config']);
  grunt.registerTask('default', ['build', 'run']);
};