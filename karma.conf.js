// Karma configuration
// Generated on Mon Oct 20 2014 09:35:40 GMT+0200 (Mitteleuropäische Sommerzeit)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      'test/requirejs-main.js',
      {pattern: 'test/*.spec.js', included: false},
      {pattern: 'node_modules/requirejs/require.js', included: false},
      {pattern: 'static/js/app.js', included: false},
      {pattern: 'static/js/lib/angular-animate.js', included: false},
      {pattern: 'static/js/lib/angular-route.js', included: false},
      {pattern: 'static/js/lib/angular.js', included: false},
      {pattern: 'static/js/lib/bootstrap.js', included: false},
      {pattern: 'static/js/lib/docs.min.js', included: false},
      {pattern: 'static/js/lib/jquery-2.1.1.js', included: false},
      {pattern: 'static/js/lib/ngAutocomplete.js', included: false}
    ],


    // list of files to exclude
    exclude: [
      // 'client/js/app.js'    // we don't want to actually start the application in our tests
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};