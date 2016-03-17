var angularTemplatePreprocessor = require('wallaby-ng-html2js-preprocessor');
module.exports                  = function () {
  'use strict';

  var commonConfig = require('./gulp/common.json');

  var commonVendorJs      = (commonConfig.vendor.js || []).map(noInstrument);
  var commonVendorMocks   = (commonConfig.vendor.mocks || []).map(noInstrument);
  var commonModuleMocks   = (commonConfig.module.mocks || []).map(noInstrument);
  var commonModuleModules = commonConfig.module.modules || [];
  var commonModuleJs      = commonConfig.module.js || [];
  var commonModuleTests   = commonConfig.module.tests || [];
  var commonModuleHtml    = commonConfig.module.html || [];
  return {
    'files'        : []
      .concat(commonVendorJs)
      .concat(commonVendorMocks)
      .concat(commonModuleMocks)
      .concat(commonModuleModules)
      .concat(commonModuleJs)
      .concat(commonModuleHtml),
    'tests'        : commonModuleTests,
    'preprocessors': {
      'src/common/modules/**/*.html': function (file) {
        return angularTemplatePreprocessor.transform(file, {
          stripPrefix: 'src\/(app|common|components)\/.*\/?modules\/',
          'moduleName' : 'isc.templates'
        });
      }
    },
    'testFramework': 'jasmine'
  };

  function noInstrument(file) {
    return { pattern: file, instrument: false };
  }
};
