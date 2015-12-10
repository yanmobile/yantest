/**
 * Created by douglasgoodman on 1/16/15.
 */

(function () {
  'use strict';

  var gulp         = require('gulp');
  var $            = require('gulp-load-plugins')();
  var seq          = require('run-sequence');
  var commonConfig = require('./common.json');
  var customConfig = require('./custom.json');

  var commonVendorJs    = commonConfig.vendor.js || [];
  var commonVendorMocks = commonConfig.vendor.mocks || [];
  var commonModuleJs    = commonConfig.module.js || [];
  var commonModuleMocks = commonConfig.module.mocks || [];
  var commonModuleTests = commonConfig.module.tests || [];
  var customVendorJs    = customConfig.vendor.js || [];
  var customVendorMocks = customConfig.vendor.mocks || [];
  var customModuleJs    = customConfig.module.js || [];
  var customModuleMocks = customConfig.module.mocks || [];
  var customModuleTests = customConfig.module.tests || [];

  /*================================================
   =              Run unit tests                   =
   ================================================*/

  // --------------------------------
  // run the custom tests
  // --------------------------------
  gulp.task('test:custom', function () {
    var customTestFiles = []
      .concat(commonVendorJs)
      .concat(customVendorJs)
      .concat(commonModuleJs)
      .concat(customModuleJs)
      .concat(commonVendorMocks)
      .concat(customVendorMocks)
      .concat(commonModuleMocks)
      .concat(customModuleMocks)
      .concat(customModuleTests);

    console.log(customTestFiles);
    return gulp.src(customTestFiles)
      .pipe($.karma({
        configFile: 'test/karma.conf.custom.js',
        action    : 'run'
      }))
      .on('error', function (err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
  });

  // --------------------------------
  // run the common tests
  // --------------------------------
  gulp.task('test:common', function () {

    var commonTestFiles = []
      .concat(commonVendorJs)
      .concat(commonModuleJs)
      .concat(commonVendorMocks)
      .concat(commonModuleMocks)
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

  // --------------------------------
  // run all the tests
  // --------------------------------
  gulp.task('test', function (done) {
    seq('test:custom', 'test:common', done);
  });

})();

