/**
 * Created by douglasgoodman on 12/9/14.
 */
(function(){
  'use strict';

  iscAuthenticationInterceptor.$inject = ['$log', '$rootScope', '$q', 'AUTH_EVENTS'];

  function iscAuthenticationInterceptor( $log, $rootScope, $q, AUTH_EVENTS ){

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // factory class
    // ----------------------------

    var factory = {
      responseError: responseError
    };

    return factory;

    // ----------------------------
    // functions
    // ----------------------------

    function responseError( response ){
      //$log.debug( 'iscAuthenticationInterceptor.responseError ' + JSON.stringify(response));
      $rootScope.$broadcast( AUTH_EVENTS.loginError, response );
      return $q.reject( response );
    }

  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
      .factory( 'iscAuthenticationInterceptor', iscAuthenticationInterceptor );
})();
