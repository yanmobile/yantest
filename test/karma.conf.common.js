(function() {
  'use strict';

  module.exports = function( config ) {

    config.set( {
      basePath: '..', // Ignored through gulp-karma

      files           : [ // Ignored through gulp-karma
        '**/*.html'
      ],
      // coverage reporter generates the coverage
      autoWatch       : false,
      coverageReporter: {
        reporters: [
          { type: "text-summary" },
          { type: "html", dir : 'coverage/common' }
        ]
      },
      logLevel  : "error",
      frameworks: ['jasmine'],

      browsers: ['PhantomJS'],

      preprocessors: {
        'src/common/modules/**/*.js'  : ['coverage'],
        'src/common/modules/**/*.html': ['ng-html2js']
      },

      ngHtml2JsPreprocessor: {
        stripPrefix: 'src\/(app|common|components)\/.*\/?modules\/',
        moduleName : 'isc.templates' // include beforeEach( module( 'isc.templates' )) in unit tests
      },

      plugins: [
        'karma-phantomjs-launcher',
        'karma-jasmine',
        'karma-coverage',
        'karma-ng-html2js-preprocessor'
      ]
    } );
  };
})();
