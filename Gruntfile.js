'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    appSrcDir: 'client',
    appTargetDir: 'static',

    htmlSrcDir: '<%= appSrcDir %>/html',
    htmlSrcFiles: '<%= htmlSrcDir %>/**/*.html',

    jsSrcDir: '<%= appSrcDir %>/js',
    jsSrcFiles: '<%= jsSrcDir %>/**/*.js',
    jsLibDir: '<%= jsSrcDir %>/lib',
    jsTargetDir: '<%= appTargetDir %>/js',
    jsNoCacheDir: '<%= appTargetDir %>/no-cache/js',

    cssSrcDir: '<%= appSrcDir %>/css',
    cssSrcFiles: '<%= cssSrcDir %>/*.scss',
    cssLibDir: '<%= cssSrcDir %>/lib',
    cssTargetDir: '<%= appTargetDir %>/css',
    cssNoCacheDir: '<%= appTargetDir %>/no-cache/css',

    /* clean build artifacts */
    clean: {
      all: [ '<%= appTargetDir %>' ],
      js: [ '<%= jsTargetDir %>' ],
      css: [ '<%= cssTargetDir %>' ],
    },

    /* static source code analysis */
    eslint: {
      target: [
        'Gruntfile.js',
        '<%= jsSrcFiles %>',
        '!<%= jsLibDir %>/**/*.js',
      ]
    },

    /* copy static assets to target dir */
    copy: {
      html: {
        expand: true,
        cwd: '<%= htmlSrcDir %>',
        src: '**/*.html',
        dest: '<%= appTargetDir %>/',
        flatten: false,
        filter: 'isFile',
      },
      fonts: {
        expand: true,
        cwd: '<%= appSrcDir %>',
        src: 'fonts/**/*',
        dest: '<%= appTargetDir %>/',
        flatten: false,
      },
      images: {
        expand: true,
        cwd: '<%= appSrcDir %>',
        src: 'img/**/*',
        dest: '<%= appTargetDir %>/',
        flatten: false,
      },
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
      noCacheJs: {
        expand: true,
        src: '<%= jsSrcDir %>/**/*.js',
        dest: '<%= jsNoCacheDir %>/',
        flatten: false,
      },
      noCacheLibJs: {
        expand: true,
        src: [
          'node_modules/jquery/dist/jquery.js',
          'node_modules/bootstrap/dist/js/bootstrap.js',
          'node_modules/angular/angular.js',
          'node_modules/angular-route/angular-route.js',
          'node_modules/angular-animate/angular-animate.js',
        ],
        dest: '<%= jsNoCacheDir %>/',
        flatten: true,
      },

      noCacheCss: {
        expand: true,
        src: '<%= cssTargetDir %>/*',
        dest: '<%= cssNoCacheDir %>/',
        flatten: true,
      },
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
        preserveComments: false,
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


    karma: {
      local: {
        configFile: 'karma.conf.js',
        reporters: ['progress'],
        browsers: ['Firefox'],
        autoWatch: false,
        singleRun: true,
      },
      ci: {
        configFile: 'karma.conf.js',
        reporters: ['junit'],
        browsers: ['PhantomJS'],
        autoWatch: false,
        singleRun: true,
      },
    },

    watch: {
      files: [
        'Gruntfile.js',
        '.eslintrc',
        '<%= jsSrcFiles %>',
        '<%= cssSrcFiles %>',
        '<%= htmlSrcFiles %>',
        '!node_modules/**/*',
      ],
      tasks: [
        'build',
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

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', [
    'clean:all',
    'eslint',
    'copy',
    'concat',
    'ngAnnotate',
    'uglify',
    'sass',
    'cssmin',
    'versioning',
  ]);

  grunt.registerTask('local', [
    'build',
    'karma:local',
  ]);

  grunt.registerTask('ci', [
    'init-ci',
    'build',
    'karma:ci',
  ]);

  grunt.registerTask('default', [ 'local' ]);

  grunt.registerTask('init-ci', function() {
    grunt.config('eslint.options.output-file', 'eslint-checkstyle-report.xml');
    grunt.config('eslint.options.format', 'checkstyle');
  });
};
