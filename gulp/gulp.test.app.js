/**
 * Created by douglasgoodman on 1/16/15.
 */

var Karma               = require( 'karma' ).Server;
var componentTestConfig = require( './gulp.test.components' );
var _                   = require( 'lodash' );

module.exports = {
  init  : init,
  getSrc: getSrc
};

function getSrc( config, _ ) {
  var componentSrc = componentTestConfig.getSrc( config );
  var appConfig    = config.app;
  return _.extend( componentSrc, {
    appVendorJs      : (appConfig.vendor.js || []),
    appModuleVendorJs: (appConfig.module.assets.vendor.js || []),
    appVendorMocks   : (appConfig.vendor.mocks || []),
    appModuleJs      : appConfig.module.js || [],
    appModuleModules : appConfig.module.modules || [],
    appModuleMocks   : (appConfig.module.mocks || []),
    appModuleTests   : appConfig.module.tests || [],
    appModuleHtml    : appConfig.module.html || [],
    masterOverrides  : _.concat( config.masterConfig.overrides.js.common, config.masterConfig.overrides.js.components )
  } );
}

function init( gulp, plugins, config, _ ) {
  'use strict';
  var src = getSrc( config, _ );

  /*================================================
   =              Run unit tests                   =
   ================================================*/

  // --------------------------------
  // run the app tests
  // --------------------------------
  gulp.task( 'test:app', function( done ) {
    var srcFiles = []
      .concat( src.commonVendorJs ) //vendorJs
      .concat( src.componentsVendorJs )
      .concat( src.appVendorJs )
      .concat( src.commonModuleVendorJs )//module vendorJs
      .concat( src.componentsModuleVendorJs )
      .concat( src.appModuleVendorJs )
      .concat( src.commonVendorMocks )//Vendor Mocks
      .concat( src.componentsVendorMocks )
      .concat( src.appVendorMocks )
      .concat( src.commonModuleMocks )//Module mocks
      .concat( src.componentsModuleMocks )
      .concat( src.appModuleMocks )
      .concat( src.commonModuleModules ) //module specific module declarations
      .concat( src.componentsModuleModules )
      .concat( src.appModuleModules )
      .concat( src.commonModuleJs ) //module specific js files
      .concat( src.componentsModuleJs )
      .concat( src.appModuleJs )
      .concat( src.commonModuleHtml ) //html files
      .concat( src.componentsModuleHtml )
      .concat( src.appModuleHtml )
      .concat( src.appModuleTests ) // test files
      .concat( src.masterOverrides ); //overrides

    var configPath = plugins.path.join( __dirname, "../test/karma.conf.app.js" );
    return new Karma( {
      configFile: configPath,
      files     : srcFiles,
      singleRun : true
    }, done ).start();
  } );

  // --------------------------------
  // run all the tests
  // --------------------------------
  gulp.task( 'test', function( done ) {
    return plugins.seq( ['test:app', 'test:components', 'test:common'], done );
  } );

}
