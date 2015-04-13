/**
 * Created by douglasgoodman on 1/16/15.
 */

(function(){
  'use strict';

  var gulp    = require('gulp');
  var $       = require('gulp-load-plugins')();
  var wiredep = require('wiredep');


  /*================================================
   =              Run unit tests                   =
   ================================================*/



  gulp.task('test', function() {
    var bowerDeps = wiredep({
      directory: 'bower_components',
      exclude: ['bootstrap-sass-official'],
      dependencies: true,
      devDependencies: true
    });

    var testFiles = bowerDeps.js.concat([
      'src/js/**/*.js',
      'src/templates/**/*.html',
      'src/assets/plugins/**/*.js',
      './bower_components/mobile-angular-ui/dist/js/**/*',
      'test/unit/**/*.js'
    ]);

    return gulp.src( testFiles )
        .pipe( $.karma({
          configFile: 'test/karma.conf.js',
          action: 'run'
        }))
        .on('error', function( err ){
          // Make sure failed tests cause gulp to exit non-zero
          throw err;
        });
  });
})();

