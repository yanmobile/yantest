(function () {
  'use strict';

  module.exports = function (config) {

    config.set({
      basePath: '..', // Ignored through gulp-karma

      files: [ // Ignored through gulp-karma
        'src/**/*.html'
      ],

      autoWatch: false,

      frameworks: ['jasmine'],

      browsers: ['PhantomJS'],

      preprocessors: {
        'src/common/modules/**/*.html'       : ['ng-html2js'],
        'src/components/**/modules/**/*.html': ['ng-html2js']
      },

      ngHtml2JsPreprocessor: {
        stripPrefix: 'src\/(common|components)\/.*\/?modules\/',
        moduleName : 'isc.templates'
      },

      plugins: [
        'karma-phantomjs-launcher',
        'karma-jasmine',
        'karma-ng-html2js-preprocessor'
      ]
    });
  };
})();
