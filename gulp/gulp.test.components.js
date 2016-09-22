/**
 * Created by douglasgoodman on 1/16/15.
 */
var Karma            = require( 'karma' ).Server;
var commonTestConfig = require( './gulp.test.common' );
var _                = require( 'lodash' );
var reportCoverage   = true;

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
  /*================================================
   =              Run unit tests                   =
   ================================================*/
  gulp.task( 'test:components', function( done ) {
    var reporters  = reportCoverage ? ['progress', 'coverage'] : ['progress'];
    reportCoverage = false; //only report coverage on the first pass

    var configPath = plugins.path.join( __dirname, "../test/karma.conf.components.js" );
    return new Karma( {
      reporters : reporters,
      configFile: configPath,
      files     : srcFiles,
      singleRun : true
    }, done ).start();

  } );

  /*================================================
   =              Run unit tests  coverage                 =
   ================================================*/
  gulp.task( 'coverage:components', function( done ) {
    var configPath = plugins.path.join( __dirname, "../test/karma.conf.components.js" );
    return new Karma( {
      reporters : ["coverage"],
      configFile: configPath,
      files     : srcFiles,
      singleRun : true
    }, done ).start();

  } );
}