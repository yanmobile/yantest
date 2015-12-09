var angularTemplatePreprocessor = require("wallaby-ng-html2js-preprocessor");
module.exports                  = function () {

  var common   = require('./gulp/common.json');
  var vendorJs = common.vendor.js.map(function (js) {
    // converts "./src/..." to "src/..."
    return { pattern: js.substr(2), instrument: false };
  });
  console.log(vendorJs);
  return {
    basePath       : '..', // Ignored through gulp-karmaa
    "files"        : vendorJs.concat([
      "src/common/modules/**/*.module.js",
      "src/common/modules/**/*.js",
      "src/common/modules/**/*.html",
      { pattern: "src/common/bower_components/angular-mocks/angular-mocks.js", instrument: false },
      { pattern: "test/unit/common/commonUnitTestMocks.js", instrument: false }
    ]),
    "tests"        : [
      "test/unit/common/**/*Tests.js"
    ],
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
};
