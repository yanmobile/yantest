/**
 * Created by douglasgoodman on 12/9/14.
 */
(function(){
  'use strict';

  iscCSRFInterceptor.$inject = [ '$log', '$cookies'];

  function iscCSRFInterceptor( $log, $cookies ){

    // ----------------------------
    // vars
    // ----------------------------

    var headerName = 'X-CSRFToken';
    var allowedMethods = []; //['GET'];

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

    function request( config ){
      $log.debug( 'iscCsrfInterceptor.request');
      $log.debug( '... config ' + JSON.stringify( config ));
      $log.debug( '... $cookies ' + JSON.stringify( $cookies ));

      if( allowedMethods.indexOf( config.method ) === -1 ){
        config.headers[ headerName ] = $cookies.csrftoken;
        $log.debug( '... config.headers ' + JSON.stringify( config.headers ));
      }

      return config;
    }

  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
    .factory( 'iscCSRFInterceptor', iscCSRFInterceptor );
})();
