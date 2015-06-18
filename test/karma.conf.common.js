
(function(){
  'use strict';

  module.exports = function(config) {

    config.set({
      basePath : '..', // Ignored through gulp-karma

      files : [ // Ignored through gulp-karma
        '**/*.html'
      ],

      autoWatch : false,

      frameworks: ['jasmine'],

      browsers : ['PhantomJS'],

      preprocessors: {
        'src/common/modules/**/*.html': ['ng-html2js']
      },

      ngHtml2JsPreprocessor: {
        stripPrefix: 'src/common/modules/',
        moduleName: 'isc.templates' // include beforeEach( module( 'isc.templates' )) in unit tests
      },

      plugins : [
        'karma-phantomjs-launcher',
        'karma-jasmine',
        'karma-ng-html2js-preprocessor'
      ]
    });
  };
})();
