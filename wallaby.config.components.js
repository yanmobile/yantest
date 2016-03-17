var angularTemplatePreprocessor = require('wallaby-ng-html2js-preprocessor');
module.exports                  = function () {
  'use strict';

  var commonConfig     = require('./gulp/common.json');
  var componentsConfig = require('./gulp/components.json');

  var commonVendorJs      = (commonConfig.vendor.js || []).map(noInstrument);
  var commonVendorMocks   = (commonConfig.vendor.mocks || []).map(noInstrument);
  var commonModuleModules = commonConfig.module.modules || [];
  var commonModuleJs      = commonConfig.module.js || [];
  var commonModuleMocks   = (commonConfig.module.mocks || []).map(noInstrument);
  var commonModuleHtml    = commonConfig.module.html || [];

  var componentsVendorJs      = (componentsConfig.vendor.js || []).map(noInstrument);
  var componentsVendorMocks   = (componentsConfig.vendor.mocks || []).map(noInstrument);
  var componentsModuleJs      = componentsConfig.module.js || [];
  var componentsModuleModules = componentsConfig.module.modules || [];
  var componentsModuleMocks   = (componentsConfig.module.mocks || []).map(noInstrument);
  var componentsModuleTests   = componentsConfig.module.tests || [];
  var componentsModuleHtml    = componentsConfig.module.html || [];

  return {
    basePath       : '..', // Ignored through gulp-karmaa
    'files'        : []
      .concat(commonVendorJs)
      .concat(componentsVendorJs)
      .concat(commonVendorMocks)
      .concat(componentsVendorMocks)
      .concat(commonModuleMocks)
      .concat(componentsModuleMocks)
      .concat(commonModuleModules)
      .concat(componentsModuleModules)
      .concat(commonModuleJs)
      .concat(componentsModuleJs)
      .concat(commonModuleHtml)
      .concat(componentsModuleHtml),
    'tests'        : componentsModuleTests,
    'preprocessors': {
      'src/common/modules/**/*.html'       : function (file) {
        return angularTemplatePreprocessor.transform(file, {
          stripPrefix: 'src\/(app|common|components)\/.*\/?modules\/',
          'moduleName': 'isc.templates'
        });
      },
      'src/components/**/modules/**/*.html': function (file) {
        return angularTemplatePreprocessor.transform(file, {
          stripPrefix: 'src\/(app|common|components)\/.*\/?modules\/',
          'moduleName': 'isc.templates'
        });
      }
    },
    'testFramework': 'jasmine'
  };

  function noInstrument(file) {
    return { pattern: file, instrument: false };
  }
};