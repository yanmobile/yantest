/**
 * Created by douglasgoodman on 1/16/15.
 */
var Karma          = require( 'karma' ).Server;
var argv           = require( 'yargs' ).argv;
var reportCoverage = true;

module.exports = {
  init  : init,
  getSrc: getSrc
};

function getSrc( config, _ ) {
  var src = {
    commonVendorJs      : config.common.vendor.js || [],
    commonVendorMocks   : config.common.vendor.mocks || [],
    commonModuleModules : config.common.module.modules || [],
    commonModuleJs      : config.common.module.js || [],
    commonModuleVendorJs: config.common.module.assets.vendor.js || [],
    commonModuleMocks   : config.common.module.mocks || [],
    commonModuleHtml    : config.common.module.html || [],
    commonModuleTests   : config.common.module.tests || []
  };
  return src;
}

function init( gulp, plugins, config, _, util ) {
  'use strict';
  var src = getSrc( config, _ );

  var srcFiles = _.concat(
    src.commonVendorJs,
    src.commonModuleModules,
    src.commonModuleJs,
    src.commonVendorMocks,
    src.commonModuleMocks,
    src.commonModuleHtml,
    src.commonModuleTests );

  /*================================================
   =              Run unit tests                   =
   ================================================*/

  // --------------------------------
  // run the common tests
  // --------------------------------
  gulp.task( 'test:common', function( done ) {
    var reporters  = !argv.skipCoverage && reportCoverage ? ['dots', 'coverage'] : ['dots'];
    reportCoverage = false; //only report coverage on the first pass

    var configPath = plugins.path.join( __dirname, "../test/karma.conf.common.js" );
    return new Karma( {
      reporters : reporters,
      configFile: configPath,
      files     : srcFiles,
      singleRun : true
    }, done ).start();

  } ); //end of gulp.task

  // --------------------------------
  // run the test coverage tests
  // --------------------------------
  gulp.task( 'coverage:common', function( done ) {

    var configPath = plugins.path.join( __dirname, "../test/karma.conf.common.js" );
    return new Karma( {
      reporters : ["coverage"],
      configFile: configPath,
      files     : srcFiles,
      singleRun : true
    }, done ).start();

  } ); //end of gulp.task

}
