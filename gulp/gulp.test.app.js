/**
 * Created by douglasgoodman on 1/16/15.
 */

var Karma = require('karma').Server;

module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  'use strict';

  var commonConfig     = config.common;
  var componentsConfig = config.component;
  var appConfig        = config.app;

  var commonVendorJs      = (commonConfig.vendor.js || []);
  var commonModuleVendorJs = (commonConfig.module.assets.vendor.js || []);
  var commonVendorMocks   = (commonConfig.vendor.mocks || []);
  var commonModuleModules = commonConfig.module.modules || [];
  var commonModuleJs      = commonConfig.module.js || [];
  var commonModuleMocks   = (commonConfig.module.mocks || []);
  var commonModuleHtml    = commonConfig.module.html || [];

  var componentsVendorJs      = (componentsConfig.vendor.js || []);
  var componentsModuleVendorJs = (componentsConfig.module.assets.vendor.js || []);
  var componentsVendorMocks   = (componentsConfig.vendor.mocks || []);
  var componentsModuleJs      = componentsConfig.module.js || [];
  var componentsModuleModules = componentsConfig.module.modules || [];
  var componentsModuleMocks   = (componentsConfig.module.mocks || []);
  var componentsModuleTests   = componentsConfig.module.tests || [];
  var componentsModuleHtml    = componentsConfig.module.html || [];

  var appVendorJs      = (appConfig.vendor.js || []);
  var appModuleVendorJs = (appConfig.module.assets.vendor.js || []);
  var appVendorMocks   = (appConfig.vendor.mocks || []);
  var appModuleJs      = appConfig.module.js || [];
  var appModuleModules = appConfig.module.modules || [];
  var appModuleMocks   = (appConfig.module.mocks || []);
  var appModuleTests   = appConfig.module.tests || [];
  var appModuleHtml    = appConfig.module.html || [];

  var masterOverrides = _.concat(config.masterConfig.overrides.js.common, config.masterConfig.overrides.js.components);

  /*================================================
   =              Run unit tests                   =
   ================================================*/

  // --------------------------------
  // run the app tests
  // --------------------------------
  gulp.task('test:app', function (done) {
    var srcFiles = []
      .concat(commonVendorJs) //vendorJs
      .concat(componentsVendorJs)
      .concat(appVendorJs)
      .concat(commonModuleVendorJs)//module vendorJs
      .concat(componentsModuleVendorJs)
      .concat(appModuleVendorJs)
      .concat(commonVendorMocks)//Vendor Mocks
      .concat(componentsVendorMocks)
      .concat(appVendorMocks)
      .concat(commonModuleMocks)//Module mocks
      .concat(componentsModuleMocks)
      .concat(appModuleMocks)
      .concat(commonModuleModules) //module specific module declarations
      .concat(componentsModuleModules)
      .concat(appModuleModules)
      .concat(commonModuleJs) //module specific js files
      .concat(componentsModuleJs)
      .concat(appModuleJs)
      .concat(commonModuleHtml) //html files
      .concat(componentsModuleHtml)
      .concat(appModuleHtml)
      .concat(appModuleTests) // test files
      .concat(masterOverrides); //overrides

    var configPath = plugins.path.join(__dirname, "../test/karma.conf.app.js");
    return new Karma({
      configFile: configPath,
      files     : srcFiles,
      singleRun : true
    }, done).start();
  });

  // --------------------------------
  // run all the tests
  // --------------------------------
  gulp.task('test', function (done) {
    return plugins.seq(['test:app', 'test:components', 'test:common'], done);
  });

}
