/**
 * Created by douglasgoodman on 1/16/15.
 */

(function () {
  'use strict';

  var gulp             = require('gulp');
  var $                = require('gulp-load-plugins')();
  var seq              = require('run-sequence');
  var commonConfig     = require('./common.json');
  var componentsConfig = require('./components.json');

  var commonVendorJs      = commonConfig.vendor.js || [];
  var commonVendorMocks   = commonConfig.vendor.mocks || [];
  var commonModuleModules = commonConfig.module.modules || [];
  var commonModuleJs      = commonConfig.module.js || [];
  var commonModuleMocks   = commonConfig.module.mocks || [];
  var commonModuleHtml    = commonConfig.module.html || [];

  var componentsVendorJs      = componentsConfig.vendor.js || [];
  var componentsVendorMocks   = componentsConfig.vendor.mocks || [];
  var componentsModuleModules = componentsConfig.module.modules || [];
  var componentsModuleJs      = componentsConfig.module.js || [];
  var componentsModuleMocks   = componentsConfig.module.mocks || [];
  var componentsModuleHtml    = componentsConfig.module.html || [];
  var componentsModuleTests   = componentsConfig.module.tests || [];

  /*================================================
   =              Run unit tests                   =
   ================================================*/

  // --------------------------------
  // run the common tests
  // --------------------------------
  gulp.task('test:components', function () {

    var commonTestFiles = []
      .concat(commonVendorJs)
      .concat(componentsVendorJs)
      .concat(commonModuleModules)
      .concat(componentsModuleModules)
      .concat(commonModuleJs)
      .concat(componentsModuleJs)
      .concat(commonVendorMocks)
      .concat(componentsVendorMocks)
      .concat(commonModuleMocks)
      .concat(componentsModuleMocks)
      .concat(commonModuleHtml)
      .concat(componentsModuleHtml)
      .concat(componentsModuleTests);

    return gulp.src(commonTestFiles)
      .pipe($.karma({
        configFile: 'test/karma.conf.components.js',
        action    : 'run'
      }))
      .on('error', function (err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
  });

})();

