module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    node_mocha: {
        with_coverage: {
            src: ['test/*.spec.js'],
            options: {
                mochaOptions: {
                    globals: ['expect'],
                    reporter: 'spec'
                },
                runCoverage: true
            }
        }
    }
  });

  // Load grunt mocha task
  grunt.loadNpmTasks('grunt-node-mocha');

  grunt.registerTask('default', ['node_mocha']);
};
