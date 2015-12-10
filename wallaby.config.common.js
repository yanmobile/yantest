var angularTemplatePreprocessor = require("wallaby-ng-html2js-preprocessor");
module.exports                  = function () {
  var common = require('./gulp/common.json');

  var vendorJs   = common.vendor.js.map(noInstrument);
  var vendorMock = common.vendor.mocks.map(noInstrument);
  var customMock = common.module.mocks.map(noInstrument);

  return {
    basePath       : '..', // Ignored through gulp-karmaa
    "files"        : []
      .concat(vendorJs)
      .concat(vendorMock)
      .concat(customMock)
      .concat(common.module.js),
    "tests"        : common.module.tests,
    "preprocessors": {
      "src/common/modules/**/*.html": function (file) {
        return angularTemplatePreprocessor.transform(file, {
          "stripPrefix": "src/common/modules/",
          "moduleName" : "isc.templates"
        });
      }
    },
    "testFramework": "jasmine"
  };

  function noInstrument(file) {
    return { pattern: file, instrument: false };
  }
};
