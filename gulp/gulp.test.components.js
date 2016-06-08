/**
 * Created by douglasgoodman on 1/16/15.
 */
var Karma            = require( 'karma' ).Server;
var commonTestConfig = require( './gulp.test.common' );
var _                = require( 'lodash' );

module.exports = {
  init  : init,
  getSrc: getSrc
};

function getSrc( config ) {
  var commonSrc        = commonTestConfig.getSrc( config );
  var componentsConfig = config.component;
  return _.extend( commonSrc, {
    componentsVendorJs      : componentsConfig.vendor.js || [],
    componentsVendorMocks   : componentsConfig.vendor.mocks || [],
    componentsModuleVendorJs: componentsConfig.module.assets.vendor.js || [],
    componentsModuleModules : componentsConfig.module.modules || [],
    componentsModuleJs      : componentsConfig.module.js || [],
    componentsModuleMocks   : componentsConfig.module.mocks || [],
    componentsModuleHtml    : componentsConfig.module.html || [],
    componentsModuleTests   : componentsConfig.module.tests || []
  } );
}

function init( gulp, plugins, config, _ ) {
  'use strict';
  var src = getSrc( config );

  // var commonOverridesJs = componentsConfig.overrides.js.common || [];
  // var componentsOverridesJs = componentsConfig.overrides.js.components || [];

  /*================================================
   =              Run unit tests                   =
   ================================================*/

  // --------------------------------
  // run the common tests
  // --------------------------------
  gulp.task( 'test:components', function( done ) {

    var srcFiles = []
      .concat( src.commonVendorJs )
      .concat( src.componentsVendorJs )
      .concat( src.commonModuleModules )
      .concat( src.componentsModuleModules )
      .concat( src.commonModuleJs )
      .concat( src.componentsModuleJs )
      .concat( src.commonVendorMocks )
      .concat( src.componentsVendorMocks )
      .concat( src.commonModuleMocks )
      .concat( src.componentsModuleMocks )
      .concat( src.commonModuleHtml )
      .concat( src.componentsModuleHtml )
      .concat( src.componentsModuleTests );
    // TODO: implement edition testing 
    // .concat(commonOverridesJs)
    // .concat(componentsOverridesJs);

    var configPath = plugins.path.join( __dirname, "../test/karma.conf.components.js" );
    return new Karma( {
      configFile: configPath,
      files     : srcFiles,
      singleRun : true
    }, done ).start();

  } );
}