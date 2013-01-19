/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: [
        'grunt.js',
        'scripts/*.js',
        'scripts/collections/*.js'
      ]
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        /* The good parts. */
        curly: true,
        eqeqeq: true,
        eqnull: true,
        immed: true,
        latedef: true,
        noarg: true,
        undef: true,

        /* Personal styling. */
        laxcomma: true,
        newcap: true,
        sub: true,
        trailing: true,

        /* Predefined globals. */
        browser: true
      },
      globals: {
        chrome: true,
        jQuery: true,
        _: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint');

};
