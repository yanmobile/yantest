var angularTemplatePreprocessor = require( 'wallaby-ng-html2js-preprocessor' );


module.exports = wallaby;

wallaby.getSrc       = getSrc;
wallaby.noInstrument = noInstrument;
function wallaby() {
  'use strict';
  var src = getSrc();

  return {
    'files'        : []
      .concat( src.commonVendorJs )
      .concat( src.commonModuleVendorJs )
      .concat( src.commonVendorMocks )
      .concat( src.commonModuleMocks )
      .concat( src.commonModuleModules )
      .concat( src.commonModuleJs )
      .concat( src.commonModuleHtml ),
    'tests'        : src.commonModuleTests,
    'preprocessors': {
      'src/common/modules/**/*.html': function( file ) {
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
  var commonConfig = require( './gulp/config.common.js' );
  // var karmaTestConfig = require( './test/karma.conf.common' );
  // var src             = karmaTestConfig.getSrc( { common: commonConfig } );

  return {
    commonVendorJs      : (commonConfig.vendor.js || []).map( noInstrument ),
    commonModuleVendorJs: (commonConfig.module.assets.vendor.js || []).map( noInstrument ),
    commonVendorMocks   : (commonConfig.vendor.mocks || []).map( noInstrument ),
    commonModuleMocks   : (commonConfig.module.mocks || []).map( noInstrument ),
    commonModuleModules : commonConfig.module.modules || [],
    commonModuleJs      : commonConfig.module.js || [],
    commonModuleTests   : commonConfig.module.tests || [],
    commonModuleHtml    : commonConfig.module.html || []
  };
}

/**
 * @description Used by WallabyJs to not run code analysis
 * @param pattern
 * @returns {{pattern: *, instrument: boolean}}
 */
function noInstrument(pattern) {
  if (_.isObject(pattern)) {
    return _.merge(pattern, {
      instrument: false
    });
  }
  else {
    return {
      pattern   : pattern,
      instrument: false
    };
  }
}