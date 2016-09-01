module.exports = {
  "modulePath": "src/common/modules/",
  "vendor"    : {
    "js"   : [
      "src/common/node_modules/jquery/dist/jquery.js",
      "src/common/node_modules/lodash/lodash.js",
      "src/common/node_modules/moment/moment.js",
      "src/common/node_modules/socket.io-client/socket.io.js",
      "src/common/node_modules/angular/angular.js",
      "src/common/node_modules/angular-animate/angular-animate.js",
      "src/common/node_modules/angular-filter/dist/angular-filter.js",
      "src/common/node_modules/angular-messages/angular-messages.js",
      "src/common/node_modules/angular-translate/dist/angular-translate.js",
      "src/common/node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
      "src/common/node_modules/angular-ui-router/release/angular-ui-router.js",
      "src/common/node_modules/angular-animate/angular-animate.js",
      "src/common/node_modules/angular-sanitize/angular-sanitize.js",
      "src/common/node_modules/mobile-angular-ui/dist/js/mobile-angular-ui.gestures.js",
      "src/common/node_modules/mobile-angular-ui/dist/js/mobile-angular-ui.migrate.js",
      "src/common/node_modules/mobile-angular-ui/dist/js/mobile-angular-ui.js"
    ],
    "mocks": [
      "src/common/node_modules/angular-mocks/angular-mocks.js",
      "test/unit/test.setup.js"
    ],
    "fonts": []
  },
  "module"    : {
    "modules": [
      "src/common/modules/**/*.module.js"
    ],
    "js"     : [
      "src/common/modules/**/*.js"
    ],
    "html"   : [
      "src/common/modules/**/*.html",
      "src/common/assets/**/*.html"
    ],
    "assets" : {
      "images": [
        "src/common/assets/images/**/*"
      ],
      "vendor": {
        "js": [
          "src/common/assets/plugins/**/*.js"
        ]
      }
    },
    "mocks"  : [
      "test/unit/common/commonUnitTestMocks.js"
    ],
    "tests"  : [
      "test/unit/common/**/*.test.js"
    ]
  }
};
