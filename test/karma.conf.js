
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
        'src/templates/**/*.html': ['ng-html2js'] // use for desktop tests
        //'src/templates/phonegap/**/*.html': ['ng-html2js'] // use for phonegap tests
      },

      ngHtml2JsPreprocessor: {
        stripPrefix: 'src/templates/', // use for desktop tests
        //stripPrefix: 'src/templates/desktop/', // use for desktop tests
        //stripPrefix: 'src/templates/phonegap/', // use for phonegap tests
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
