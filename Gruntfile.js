module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
        test: {
            options: {
                globals: ['expect'],
                reporter: 'spec',
                require: 'babel/register'
            },
            src: ['test/*.spec.js']
        }
    }
  });

  // Load grunt mocha task
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['mochaTest']);
};
