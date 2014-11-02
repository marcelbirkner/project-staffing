'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jsSrcDir: 'client/js',
    jsSrcFiles: '<%= jsSrcDir %>/**/*.js',
    jsLibDir: '<%= jsSrcDir %>/lib',
    jsTargetDir: 'static/js',

    cssSrcDir: 'client/css',
    cssSrcFiles: '<%= cssSrcDir %>/*.scss',
    cssLibDir: '<%= cssSrcDir %>/lib',
    cssTargetDir: 'static/css',

    /* clean build artifacts */
    clean: {
      js: [ '<%= jsTargetDir %>' ],
      css: [ '<%= cssTargetDir %>' ],
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
      jsSourceMaps: {
        expand: true,
        src: 'node_modules/angular*/angular*.min.js.map',
        dest: '<%= jsTargetDir %>/',
        flatten: true,
        filter: 'isFile',
      },
      cssThirdParty: {
        expand: true,
        src: '<%= cssLibDir %>/*',
        dest: '<%= cssTargetDir %>/',
        flatten: true,
      },
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

    // For a working SASS/COMPASS installation:
    // Install ruby 2.x
    // [sudo] gem install sass
    // [sudo] gem install compass
    sass: {
      app: {
        options: {
          compass: true,

          /* compact/compressed */
          style: 'expanded',
          unixNewlines: true,
        },
        files: {
          '<%= cssTargetDir %>/master.css': '<%= cssSrcDir %>/master.scss',
          '<%= cssTargetDir %>/dashboard.css': '<%= cssSrcDir %>/dashboard.scss',
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          '<%= cssTargetDir %>/app.min.css': [
            '<%= cssTargetDir %>/master.css',
            '<%= cssTargetDir %>/dashboard.css',
          ]
        }
      }
    },

    /* rename static assets for indefinite cacheability */
    versioning: {
      options: {
        grepFiles: [
          'static/**/*.html',
        ]
      },
      js: {
        src: [
          '<%= jsTargetDir %>/app.min.js',
          '<%= jsTargetDir %>/vendor.js',
        ]
      },
      css: {
        src: [
          '<%= cssTargetDir %>/app.min.css',
        ]
      },
    },

    watch: {
      files: [
        'Gruntfile.js',
        '.eslintrc',
        '<%= jsSrcFiles %>',
        '<%= cssSrcFiles %>',
        '!node_modules/**/*',
      ],
      tasks: [
        'default',
      ]
    }
  });

  /*
   * TODO
   * Include images as data-uris in css classes
   * Change JS to add/remove classes instead of images
   *
   * Unit Tests /w Karma
   * E2E Tests /w Protractor
   */

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-version-assets');

  grunt.registerTask('default', [
    'clean',
    'eslint',
    'concat',
    'copy',
    'ngAnnotate',
    'uglify',
    'sass',
    'cssmin',
    'versioning',
  ]);

};
