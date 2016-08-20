(function () {
  'use strict';

  module.exports = function (config) {

    config.set({
      basePath: '..', // Ignored through gulp-karma

      files: [// Ignored through gulp-karma
        'src/**/*.html'
      ],
      reporters       : ['progress'],
      autoWatch       : false,
      coverageReporter: {
        reporters: [
          { type: "text" },
          { type: "html", dir : 'coverage/component' }
        ]
      },
      browserNoActivityTimeout : 30000,
      frameworks: ['jasmine', 'fixture'],

      browsers: ['PhantomJS'],

      preprocessors: {
        'src/components/**/modules/**/*.js'  : ['coverage'],
        'src/common/modules/**/*.html'               : ['ng-html2js'],
        'src/components/**/modules/**/*.html'        : ['ng-html2js'],
        'test/unit/components/forms/static/**/*.html': ['html2js'],
        'test/unit/components/forms/static/**/*.css' : ['html2js'],
        'test/unit/components/forms/static/**/*.js'  : ['html2js'],
        'test/unit/components/forms/static/**/*.json': ['json_fixtures']
      },

      ngHtml2JsPreprocessor: {
        stripPrefix: 'src\/(common|components)\/.*\/?modules\/',
        moduleName : 'isc.templates'
      },

      jsonFixturesPreprocessor: {
        variableName: '__json__'
      },

      plugins: [
        'karma-phantomjs-launcher',
        'karma-jasmine',
        'karma-fixture',
        'karma-coverage',
        'karma-html2js-preprocessor',
        'karma-ng-html2js-preprocessor',
        'karma-json-fixtures-preprocessor'
      ]
    });
  };
})();
