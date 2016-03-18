/**
 * Created by douglasgoodman on 1/16/15.
 */

module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  'use strict';

  var karma = require('karma').Server;

  var commonConfig     = config.common;
  var componentsConfig = config.component;

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
  gulp.task('test:components', function (done) {


    var srcFiles = []
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

    var configPath = plugins.path.join(__dirname, "../test/karma.conf.components.js");
    return new karma({
      configFile: configPath,
      files     : srcFiles,
      singleRun : true
    }, done).start();

  });
}

