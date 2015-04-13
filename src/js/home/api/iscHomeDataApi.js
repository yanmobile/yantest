/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscHomeDataApi.$inject = [ '$log', '$q','$http'  ];

  function iscHomeDataApi( $log, $q, $http ){
    //$log.debug( 'iscHomeDataApi LOADED');

  /*  var mockData = [
      {
        'key': 'angular',
        'title': 'AngularJS',
        'url': 'https://angularjs.org/',
        'description': 'HTML enhanced for web apps!',
        'logo': 'angular.png'
      },
      {
        'key': 'browsersync',
        'title': 'BrowserSync',
        'url': 'http://browsersync.io/',
        'description': 'Time-saving synchronised browser testing.',
        'logo': 'browsersync.png'
      },
      {
        'key': 'gulp',
        'title': 'GulpJS',
        'url': 'http://gulpjs.com/',
        'description': 'The streaming build system.',
        'logo': 'gulp.png'
      },
      {
        'key': 'jasmine',
        'title': 'Jasmine',
        'url': 'http://jasmine.github.io/',
        'description': 'Behavior-Driven JavaScript.',
        'logo': 'jasmine.png'
      },
      {
        'key': 'karma',
        'title': 'Karma',
        'url': 'http://karma-runner.github.io/',
        'description': 'Spectacular Test Runner for JavaScript.',
        'logo': 'karma.png'
      },
      {
        'key': 'protractor',
        'title': 'Protractor',
        'url': 'https://github.com/angular/protractor',
        'description': 'End to end test framework for AngularJS applications built on top of WebDriverJS.',
        'logo': 'protractor.png'
      },
      {
        'key': 'jquery',
        'title': 'jQuery',
        'url': 'http://jquery.com/',
        'description': 'jQuery is a fast, small, and feature-rich JavaScript library.',
        'logo': 'jquery.jpg'
      },
      {
        'key': 'bootstrap',
        'title': 'Bootstrap',
        'url': 'http://getbootstrap.com/',
        'description': 'Bootstrap is the most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web.',
        'logo': 'bootstrap.png'
      },
      {
        'key': 'node-sass',
        'title': 'Sass (Node)',
        'url': 'https://github.com/sass/node-sass',
        'description': 'Node.js binding to libsass, the C version of the popular stylesheet preprocessor, Sass.',
        'logo': 'node-sass.png'
      }
    ];
*/
    var api = {

      getPanelData: function(){
        // HTTP calls go here

        var deferred = $q.defer();

        //var url = 'http://hscommdev.iscinternal.com/public/api/v1/ehr';
        var url = 'assets/mockData/home/mockPanelData.json';

        $http.get( url )
          .success( function( result ){
            deferred.resolve( result );
          })
          .error( function( error ){
            deferred.reject( error );
          });


        return deferred.promise;
      }
    };

    return api;
  };


  angular.module( 'iscHome' )
      .factory( 'iscHomeDataApi', iscHomeDataApi );

})();
