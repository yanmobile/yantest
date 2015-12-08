/**
 * Created by douglasgoodman on 1/16/15.
 */

(function(){
  'use strict';

  var gulp      = require('gulp');
  var $         = require('gulp-load-plugins')();
  var seq       = require('run-sequence');

  var deps = [];

  var testFiles = deps.concat([
    'src/common/bower_components/jquery/dist/jquery.js',
    'src/common/bower_components/angular/angular.js',
    'src/common/bower_components/angular-animate/angular-animate.js',
    'src/common/bower_components/angular-filter/dist/angular-filter.js',
    'src/common/bower_components/angular-mocks/angular-mocks.js',
    'src/common/bower_components/angular-sanitize/angular-sanitize.js',
    'src/common/bower_components/angular-translate/angular-translate.js',
    'src/common/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
    'src/common/bower_components/angular-ui-router/release/angular-ui-router.js',
    'src/common/bower_components/angular-utils-pagination/dirPagination.js',
    'src/common/bower_components/angularjs-datepicker/src/js/angular-datepicker.js',
    'src/common/bower_components/greensock/src/uncompressed/TweenMax.js',
    'src/common/bower_components/lodash/lodash.js',
    'src/common/bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.min.js',
    'src/common/bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.gestures.js',
    'src/common/bower_components/moment/moment.js',
    "src/common/bower_components/foundation-apps/dist/js/foundation-apps.js",
    "src/common/bower_components/foundation-apps/dist/js/foundation-apps-templates.js",
    "src/common/bower_components/angucomplete-alt/angucomplete-alt.js"
  ]);

  /*================================================
   =              Run unit tests                   =
   ================================================*/

  // --------------------------------
  // run the custom tests
  // --------------------------------
  gulp.task('test:custom', function() {

    var customFiles = [
      'src/common/modules/**/.module.js',
      'src/common/modules/**/*',
      "src/custom/bower_components/foundation-apps/dist/css/foundation-apps.css",
      "src/custom/bower_components/foundation-apps/dist/js/foundation-apps.js",
      "src/custom/bower_components/foundation-apps/dist/js/foundation-apps-templates.js",
      "src/custom/bower_components/angucomplete-alt/angucomplete-alt.js",
      'src/custom/modules/**/*.module.js',
      'src/custom/modules/**/*',
      'test/unit/custom/**/*.js'
    ];

    var customTestFiles =  testFiles.concat( customFiles );

    return gulp.src( customTestFiles )
        .pipe( $.karma({
          configFile: 'test/karma.conf.custom.js',
          action: 'run'
        }))
        .on('error', function( err ){
          // Make sure failed tests cause gulp to exit non-zero
          throw err;
        });
  });

  // --------------------------------
  // run the common tests
  // --------------------------------
  gulp.task('test:common', function() {

    var commonTestFiles =  testFiles.concat([
      'src/common/modules/**/*.module.js',
      'src/common/modules/**/*',
      'test/unit/common/**/*.js'
    ]);

    return gulp.src( commonTestFiles )
        .pipe( $.karma({
          configFile: 'test/karma.conf.common.js',
          action: 'run'
        }))
        .on('error', function( err ){
          // Make sure failed tests cause gulp to exit non-zero
          throw err;
        });
  });

  // --------------------------------
  // run all the tests
  // --------------------------------
  gulp.task('test', function(done) {
    seq('test:custom', 'test:common', done);
  });

})();

