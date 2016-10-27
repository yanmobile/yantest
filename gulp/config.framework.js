module.exports.masterConfig = {};
module.exports.common       = require( "./config.common" );
module.exports.component    = require( "../src/components/foundation/base/config.components" );
module.exports.app          = {
  // "modulePath"   : "src/app/modules/",
  "vendor"   : {
    "js"   : [],
    "mocks": [],
    "fonts": []
  },
  "module"   : {
    "modules": [
      // "src/app/modules/**/app.module.js",
      // "src/app/modules/**/*.module.js"
    ],
    "js"     : [
      // "src/app/modules/**/*.js"
    ],
    "scss"   : [
      // "src/app/assets/sass/main.scss",
      // "src/app/modules/**/*.scss"
    ],
    "html"   : [
      // "src/app/modules/**/*.html"
    ],
    "assets" : {
      // "i18n": "src/app/assets/i18n/",
      "mocks" : [
        // "src/app/assets/mockData/**"
      ],
      "images": [
        // "src/app/assets/images/**/*"
      ],
      "vendor": {
        "js": []
      }
    },
    "mocks"  : [],
    "tests"  : [
      // "test/unit/app/**/*.test.js",
      // "test/unit/app/**/*Tests.js"
    ]
  },
  "dest"     : {
    // "folder": "www",
    // "html"  : "src/index.html",
    // "css"   : "src/app/assets/sass/main.scss",
    // "js"    : "src/app/assets/sass/main.js"
  },
  // "cordova"  : false,
  // "excludeConfig": "!src/app/modules/app.config.js",
  "edition"  : [
    {
      "name": "base",
      "path": "src/components/foundation/base/config.components"
    }
  ],
  //"JavaScript files can't be overridden like css selector cascading or Angular's templateCache templates.",
  //"If we want to override lower level JS files, we must exclude them from the list.",
  //"The overrides below are used to exclude base files by specifying glob patterns.",
  //"e.g. ```common: ['!src/modules/isc.filters/myFilter.js']```"
  "overrides": {
    "js"      : {
      "common"    : [],
      "components": []
    },
    "comments": "Used to exclude files in common/component. e.g. ```common: ['!src/modules/isc.filters/myFilter.html']```",
    "html"    : {
      "common"    : [],
      "components": []
    }
  }
};
