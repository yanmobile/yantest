/**
 * Created by douglasgoodman on 1/16/15.
 */

(function () {
  'use strict';

  var gulp         = require('gulp');
  var $            = require('gulp-load-plugins')();
  var seq          = require('run-sequence');
  var commonConfig = require('./common.json');

  var commonVendorJs    = commonConfig.vendor.js || [];
  var commonVendorMocks = commonConfig.vendor.mocks || [];
  var commonModuleJs    = commonConfig.module.js || [];
  var commonModuleMocks = commonConfig.module.mocks || [];
  var commonModuleHtml  = commonConfig.module.html || [];
  var commonModuleTests = commonConfig.module.tests || [];

  /*================================================
   =              Run unit tests                   =
   ================================================*/

  // --------------------------------
  // run the common tests
  // --------------------------------
  gulp.task('test:common', function () {

    var commonTestFiles = []
      .concat(commonVendorJs)
      .concat(commonModuleJs)
      .concat(commonVendorMocks)
      .concat(commonModuleMocks)
      .concat(commonModuleHtml)
      .concat(commonModuleTests);

    return gulp.src(commonTestFiles)
      .pipe($.karma({
        configFile: 'test/karma.conf.common.js',
        action    : 'run'
      }))
      .on('error', function (err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
  });

})();

