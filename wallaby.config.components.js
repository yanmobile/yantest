var angularTemplatePreprocessor = require( 'wallaby-ng-html2js-preprocessor' );
var _                           = require( 'lodash' );

module.exports = wallaby;

wallaby.getSrc = getSrc;
function wallaby() {
  'use strict';
  var src = getSrc();
  return {
    basePath       : '..', // Ignored through gulp-karma
    'files'        : []
      .concat( src.commonVendorJs )
      .concat( src.componentsVendorJs )
      .concat( src.commonModuleVendorJs )
      .concat( src.componentsModuleVendorJs )
      .concat( src.commonVendorMocks )
      .concat( src.componentsVendorMocks )
      .concat( src.commonModuleMocks )
      .concat( src.componentsModuleMocks )
      .concat( src.commonModuleModules )
      .concat( src.componentsModuleModules )
      .concat( src.commonModuleJs )
      .concat( src.componentsModuleJs )
      .concat( src.commonModuleHtml )
      .concat( src.componentsModuleHtml ),
    'tests'        : src.componentsModuleTests,
    'preprocessors': {
      'src/common/modules/**/*.html'       : function( file ) {
        return angularTemplatePreprocessor.transform( file, {
          stripPrefix : 'src\/(app|common|components)\/.*\/?modules\/',
          'moduleName': 'isc.templates'
        } );
      },
      'src/components/**/modules/**/*.html': function( file ) {
        return angularTemplatePreprocessor.transform( file, {
          stripPrefix : 'src\/(app|common|components)\/.*\/?modules\/',
          'moduleName': 'isc.templates'
        } );
      }
    },
    'testFramework': 'jasmine'
  };
}

function getSrc() {
  var commonWallaby    = require( './wallaby.config.common' );
  var commonSrc        = commonWallaby.getSrc();
  var componentsConfig = require( './src/components/foundation/base/config.components.js' );

  wallaby.noInstrument = commonWallaby.noInstrument;
  return _.extend( commonSrc, {
    componentsVendorJs      : (componentsConfig.vendor.js || []).map( commonWallaby.noInstrument ),
    componentsModuleVendorJs: (componentsConfig.module.assets.vendor.js || [] ).map( commonWallaby.noInstrument ),
    componentsVendorMocks   : (componentsConfig.vendor.mocks || []).map( commonWallaby.noInstrument ),
    componentsModuleJs      : componentsConfig.module.js || [],
    componentsModuleModules : componentsConfig.module.modules || [],
    componentsModuleMocks   : (componentsConfig.module.mocks || []).map( commonWallaby.noInstrument ),
    componentsModuleTests   : componentsConfig.module.tests || [],
    componentsModuleHtml    : componentsConfig.module.html || []
  } );
}
