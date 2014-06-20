'use strict';

var concat = require('gulp-concat')
  , eslint = require('gulp-eslint')
  , gulp = require('gulp')
  , ngmin = require('gulp-ngmin')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify');

gulp.task('lint', function() {
  return gulp.src([
    'gulpfile.js',
    'js/**/*.js',
  ])
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('js', ['lint'], function() {
  return gulp.src('./js/**/*.js')
  .pipe(concat('app.js'))
  .pipe(gulp.dest('../static/js'))
  .pipe(rename('app.min.js'))
  .pipe(ngmin())
  .pipe(uglify())
  .pipe(gulp.dest('../static/js'));

  /* TODO Concatenate all third party stuff (angular, maybe even JQuery etc.) into one file */
});

gulp.task('watch', function() {
  gulp.watch([
    './js/**/*.js',
  ], ['default']);
});

gulp.task('default', ['js']);
