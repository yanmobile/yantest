var angularTemplatePreprocessor = require("wallaby-ng-html2js-preprocessor");
module.exports                  = function () {
  'use strict';

  var commonConfig = require('./gulp/common.json');
  var customConfig = require('./gulp/custom.json');

  var commonVendorJs    = (commonConfig.vendor.js || []).map(noInstrument);
  var commonVendorMocks = (commonConfig.vendor.mocks || []).map(noInstrument);
  var commonModuleJs    = commonConfig.module.js || [];
  var commonModuleMocks = (commonConfig.module.mocks || []).map(noInstrument);
  var customVendorJs    = (customConfig.vendor.js || []).map(noInstrument);
  var customVendorMocks = (customConfig.vendor.mocks || []).map(noInstrument);
  var customModuleJs    = customConfig.module.js || [];
  var customModuleMocks = (customConfig.module.mocks || []).map(noInstrument);
  var customModuleTests = customConfig.module.tests || [];

  return {
    basePath       : '..', // Ignored through gulp-karmaa
    "files"        : []
      .concat(commonVendorJs)
      .concat(customVendorJs)
      .concat(commonVendorMocks)
      .concat(customVendorMocks)
      .concat(commonModuleMocks)
      .concat(customModuleMocks)
      .concat(commonModuleJs)
      .concat(customModuleJs),
    "tests"        : customModuleTests,
    "preprocessors": {
      "src/common/modules/**/*.html": function (file) {
        return angularTemplatePreprocessor.transform(file, {
          "stripPrefix": "src/common/modules/",
          "moduleName" : "isc.templates"
        });
      },
      "src/custom/modules/**/*.html": function (file) {
        return angularTemplatePreprocessor.transform(file, {
          "stripPrefix": "src/custom/modules/",
          "moduleName" : "custom.templates"
        });
      }
    },
    "testFramework": "jasmine"
  };

  function noInstrument(file) {
    return { pattern: file, instrument: false };
  }
};
