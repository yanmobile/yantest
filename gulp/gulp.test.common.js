/**
 * Created by douglasgoodman on 1/16/15.
 */
var Karma               = require('karma').Server;

module.exports = {
  init: init
};

function init(gulp, plugins, config, _) {
  'use strict';

  var commonVendorJs      = config.common.vendor.js || [];
  var commonVendorMocks   = config.common.vendor.mocks || [];
  var commonModuleModules = config.common.module.modules || [];
  var commonModuleJs      = config.common.module.js || [];
  var commonModuleMocks   = config.common.module.mocks || [];
  var commonModuleHtml    = config.common.module.html || [];
  var commonModuleTests   = config.common.module.tests || [];

  /*================================================
   =              Run unit tests                   =
   ================================================*/

  // --------------------------------
  // run the common tests
  // --------------------------------
  gulp.task('test:common', function (done) {

    var srcFiles = []
      .concat(commonVendorJs)
      .concat(commonModuleModules)
      .concat(commonModuleJs)
      .concat(commonVendorMocks)
      .concat(commonModuleMocks)
      .concat(commonModuleHtml)
      .concat(commonModuleTests);

    var configPath = plugins.path.join(__dirname, "../test/karma.conf.common.js");
    return new Karma({
      configFile: configPath,
      files     : srcFiles,
      singleRun: true
    }, done).start();

  }); //end of gulp.task

}
