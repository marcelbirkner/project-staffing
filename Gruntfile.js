'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jsSrcDir: 'client/js',
    jsSrcFiles: '<%= jsSrcDir %>/**/*.js',
    jsLibDir: '<%= jsSrcDir %>/lib',
    jsTargetDir: 'static/js',

    /* clean build artifacts */
    clean: {
      js: [ '<%= jsTargetDir %>' ]
    },

    /* static source code analysis */
    eslint: {
      target: [
        'Gruntfile.js',
        '<%= jsSrcFiles %>',
        '!client/js/lib/**/*.js',
      ]
    },

    /* concatenate JS */
    concat: {
      options: {
        separator: '\n;'
      },
      vendor: {
        src: [
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/bootstrap/dist/js/bootstrap.min.js',
          'node_modules/angular/angular.min.js',
          'node_modules/angular-route/angular-route.min.js',
          'node_modules/angular-animate/angular-animate.min.js',
          '<%= jsLibDir %>/ngAutocomplete.js',
        ],
        dest: '<%= jsTargetDir %>/vendor.js'
      },
      app: {
        src: [
          'client/js/**/*.js',
        ],
        dest: '<%= jsTargetDir %>/app.js'
      }
    },

    copy: {
      sourceMaps: {
        expand: true,
        cwd: '',
        src: 'node_modules/angular*/angular*.min.js.map',
        dest: '<%= jsTargetDir %>/',
        flatten: true,
        filter: 'isFile',
      }
    },

    /* AngularJS-specific pre-processing to prepare sources for minifying */
    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      app: {
        files: [{
          expand: true,
          src: [ '<%= concat.app.dest %>' ],
          ext: '.annotated.js',
          extDot: 'last',
        }],
      },
    },

    /* minify JS */
    uglify: {
      options: {
        banner:
          '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: true,
      },
      app: {
        files: {
          '<%= jsTargetDir %>/app.min.js': [ 'static/js/app.annotated.js'],
        }
      }
    },

    /*
     * watch
     * TODO update README
     * rename/replace references (SHA1/timestamp)
     * TODO Move version assets to separate Grunt plugin
     * TODO SASS / COMPASS / CSS / PNGs
     */

    /*
    sass: {
      dist: {
        options: {
          compass: true,

          / * compact/compressed * /
          style: 'expanded',
          unixNewlines: true,
        },
        files: createCssMapping()
      }
    },


    cssmin: {
      combine: {
        files: createCssMinMapping()
      }
    },
    */

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  //grunt.loadNpmTasks('grunt-contrib-sass');
  //grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.registerTask('default', [
    'clean',
    'eslint',
    'concat',
    'copy',
    'ngAnnotate',
    'uglify',
  ]);

};
