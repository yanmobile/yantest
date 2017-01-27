( function() {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.http' )
      .factory( 'iscCacheBusterInterceptor', iscCacheBusterInterceptor );

  /* @ngInject */
  function iscCacheBusterInterceptor ( $q, devlog ) {//jshint ignore:line
    var channel = devlog.channel( 'iscCacheBusterInterceptor' );

    // ----------------------------
    // factory class
    // ----------------------------

    var factory = {
      request: request
    };

    return factory;

    // ----------------------------
    // functions
    // ----------------------------
    function request ( config ) {//jshint ignore:line

      if ( !_.endsWith( config.url, '.html' ) ) {
        if ( !_.isPlainObject( config.params ) ) {
          config.params = {};
        }
        config.params.ts = Date.now();
      }

      return config;
    }

  }// END CLASS

} )();
