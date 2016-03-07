'use strict';

var gulp = require('gulp');
var _    = require('lodash');

var plugins = {
  chmod        : require('gulp-chmod'),
  concat       : require('gulp-concat'),
  cssmin       : require('gulp-cssmin'),
  dateFormat   : require('dateformat'),
  del          : require('del'),
  es           : require('event-stream'),
  exec         : require('child_process').exec,
  execSync     : require('child_process').execSync,
  fs           : require('fs'),
  imagemin     : require('gulp-imagemin'),
  jshint       : require('gulp-jshint'),
  karma        : require('karma').server,
  mobilizer    : require('gulp-mobilizer'),
  path         : require('path'),
  pngcrush     : require('imagemin-pngcrush'),
  ngAnnotate   : require('gulp-ng-annotate'),
  ngFilesort   : require('gulp-angular-filesort'),
  rename       : require('gulp-rename'),
  replace      : require('gulp-replace'),
  sass         : require('gulp-sass'),
  seq          : require('run-sequence'),
  size         : require('gulp-size'),
  sourcemaps   : require('gulp-sourcemaps'),
  streamqueue  : require('streamqueue'),
  templateCache: require('gulp-angular-templatecache'),
  uglify       : require('gulp-uglify'),
  wiredep      : require('wiredep'),
  jscs         : require('gulp-jscs'),
  filelog      : require('gulp-filelog')
};

var configs = {
  common   : require('./gulp/common.json'),
  component: require('./src/components/foundation/base/components.json'),
  app      : require('./gulp/app.json')
};

var tasks = require('require-dir')('./gulp/');

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

_.forEach(tasks, function (task, name) {
  if (typeof task.init === "function") {
    task.init(gulp, plugins, configs, _);
  }
});
