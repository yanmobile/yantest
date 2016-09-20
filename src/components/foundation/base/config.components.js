// NOTE: n3-charts only works with D3 v.3

module.exports = {
  "modulePath": "src/components/foundation/base/modules",
  "vendor"    : {
    "js"   : [
      "src/components/foundation/base/node_modules/d3/d3.js",
      "src/components/foundation/base/node_modules/angular-utils-pagination/dirPagination.js",
      "src/components/foundation/base/node_modules/angucomplete-alt/angucomplete-alt.js",
      "src/components/foundation/base/node_modules/angularjs-datepicker/dist/angular-datepicker.min.js",
      "src/components/foundation/base/node_modules/foundation-apps/dist/js/foundation-apps.js",
      "src/components/foundation/base/node_modules/foundation-apps/dist/js/foundation-apps-templates.js",
      "src/components/foundation/base/node_modules/api-check/dist/api-check.min.js",
      "src/components/foundation/base/node_modules/angular-formly/dist/formly.min.js",
      "src/components/foundation/base/node_modules/tooltipster/dist/js/tooltipster.bundle.js",
      "src/components/foundation/base/node_modules/n3-charts/build/LineChart.js",
      "src/components/foundation/base/node_modules/leaflet/dist/leaflet.js",
      "src/components/foundation/base/node_modules/ng-tags-input/build/ng-tags-input.js"
    ],

    "mocks": [],
    "fonts": [
      "src/components/foundation/base/node_modules/font-awesome/fonts/fontawesome-webfont.*"
    ]
  },
  "module"    : {
    "modules": [
      "src/components/foundation/base/modules/**/*.module.js"
    ],
    "js"     : [
      "src/components/foundation/base/modules/**/*.js"
    ],
    "html"   : [
      "src/components/foundation/base/modules/**/*.html",
      "src/components/foundation/base/assets/**/*.html"
    ],
    "assets" : {
      "FDN": "src/components/foundation/base/assets/FDN/",
      "i18nDir": "src/components/foundation/base/assets/i18n/",
      "images" : [
        "src/components/foundation/base/assets/images/**/*",
        "src/components/foundation/base/assets/vendors/leaflet/images/**/*"
      ],
      "vendor" : {
        "js": [
        ]
      }
    },
    "mocks"  : [
      "test/unit/components/componentsUnitTestMocks.js",
      "test/unit/components/**/*.mocks.js",
      "test/unit/components/forms/static/**/*.*"
    ],
    "tests"  : [
      "test/unit/components/**/*.test.js"
    ]
  },
  "comments"  : "JavaScript files can't be overridden like css selector cascading or Angular's templateCache templates.",
  "comments"  : "If we want to override lower level JS files, we must exclude them from the list.",
  "comments"  : "The overrides below are used to exclude base files by specifying glob patterns.",
  "overrides" : {
    "js"  : {
      "common"    : [],
      "components": []
    },
    "html": {
      "common"    : [],
      "components": []
    },
    "css" : {
      "common"    : [],
      "components": []
    }
  }
};
