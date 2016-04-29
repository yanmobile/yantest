var angularTemplatePreprocessor = require('wallaby-ng-html2js-preprocessor');
module.exports                  = function () {
  'use strict';


  var commonConfig     = require('./gulp/common.json');
  var componentsConfig = require('./gulp/components.json');
  var appConfig        = require('./gulp/app.json');

  var commonVendorJs      = (commonConfig.vendor.js || []).map(noInstrument);
  var commonModuleVendorJs = (commonConfig.module.assets.vendor.js || []).map(noInstrument);
  var commonVendorMocks   = (commonConfig.vendor.mocks || []).map(noInstrument);
  var commonModuleModules = commonConfig.module.modules || [];
  var commonModuleJs      = commonConfig.module.js || [];
  var commonModuleMocks   = (commonConfig.module.mocks || []).map(noInstrument);
  var commonModuleHtml    = commonConfig.module.html || [];

  var componentsVendorJs      = (componentsConfig.vendor.js || []).map(noInstrument);
  var componentsModuleVendorJs = (componentsConfig.module.assets.vendor.js || []).map(noInstrument);
  var componentsVendorMocks   = (componentsConfig.vendor.mocks || []).map(noInstrument);
  var componentsModuleJs      = componentsConfig.module.js || [];
  var componentsModuleModules = componentsConfig.module.modules || [];
  var componentsModuleMocks   = (componentsConfig.module.mocks || []).map(noInstrument);
  var componentsModuleTests   = componentsConfig.module.tests || [];
  var componentsModuleHtml    = componentsConfig.module.html || [];

  var appVendorJs      = (appConfig.vendor.js || []).map(noInstrument);
  var appModuleVendorJs = (appConfig.module.assets.vendor.js || []).map(noInstrument);
  var appVendorMocks   = (appConfig.vendor.mocks || []).map(noInstrument);
  var appModuleJs      = appConfig.module.js || [];
  var appModuleModules = appConfig.module.modules || [];
  var appModuleMocks   = (appConfig.module.mocks || []).map(noInstrument);
  var appModuleTests   = appConfig.module.tests || [];
  var appModuleHtml    = appConfig.module.html || [];

  return {
    basePath       : '..', // Ignored through gulp-karmaa
    'files'        : []
      .concat(commonVendorJs)
      .concat(componentsVendorJs)
      .concat(appVendorJs)
      .concat(commonModuleVendorJs)
      .concat(componentsModuleVendorJs)
      .concat(appModuleVendorJs)
      .concat(commonVendorMocks)
      .concat(componentsVendorMocks)
      .concat(appVendorMocks)
      .concat(commonModuleMocks)
      .concat(componentsModuleMocks)
      .concat(appModuleMocks)
      .concat(commonModuleModules)
      .concat(componentsModuleModules)
      .concat(appModuleModules)
      .concat(commonModuleJs)
      .concat(componentsModuleJs)
      .concat(appModuleJs)
      .concat(commonModuleHtml)
      .concat(componentsModuleHtml)
      .concat(appModuleHtml),
    'tests'        : appModuleTests,
    'preprocessors': {
      'src/common/modules/**/*.html'       : function (file) {
        return angularTemplatePreprocessor.transform(file, {
          stripPrefix : 'src\/(app|common|components)\/.*\/?modules\/',
          'moduleName': 'isc.templates'
        });
      },
      'src/components/**/modules/**/*.html': function (file) {
        return angularTemplatePreprocessor.transform(file, {
          stripPrefix : 'src\/(app|common|components)\/.*\/?modules\/',
          'moduleName': 'isc.templates'
        });
      },
      'src/app/modules/**/*.html'          : function (file) {
        return angularTemplatePreprocessor.transform(file, {
          stripPrefix : 'src\/(app|common|components)\/.*\/?modules\/',
          'moduleName': 'isc.templates'
        });
      }
    },
    'testFramework': 'jasmine'
  };

  /**
   * @description Used by WallabyJs to not run code analysis
   * @param pattern
   * @returns {{pattern: *, instrument: boolean}}
   */
  function noInstrument(pattern) {
    return { pattern: pattern, instrument: false };
  }
};