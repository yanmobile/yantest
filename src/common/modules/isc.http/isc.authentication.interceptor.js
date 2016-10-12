/**
 * Created by Henry Zou on 11/23/14.
 */
( function() {
  'use strict';

  angular.module( 'isc.http' )
    .factory( 'iscAuthenticationInterceptor', iscAuthenticationInterceptor );

  /* @ngInject */
  function iscAuthenticationInterceptor( $rootScope, $q, $injector, $timeout, AUTH_EVENTS, statusCode ) {

    var $http; //dynamically injecting it to prevent circular Dependency Injections.
    var factory = {
      responseError: responseError
    };

    return factory;

    /**
     * Usage: prevents 404 default
     *    $http(getUrl, { preventDefault: [404] })
     *
     * Usage:  prevents defaults for all status codes
     *    $http(getUrl, { preventDefault: true })
     *
     * @param {any} response
     *  Can contain preventDefault with value of true or [ codes ]
     * @returns {Promise}
     *  Promises is the callback for dialog dismissal
     */
    function responseError( response ) {
      switch ( response.status ) {
        case statusCode.Unauthorized:
          // this will happen if you just leave your computer on for a long time
          $rootScope.$emit( AUTH_EVENTS.notAuthenticated, response );
          break;

        case statusCode.Forbidden:
          //display not-authorized modal
          $rootScope.$emit( AUTH_EVENTS.notAuthorized, response );
          break;

        case statusCode.NotFound:
          return handle404( response );
      }
      return $q.reject( response );

      function handle404( response ) {
        var deferred = $q.defer();

        if ( isUrlAllowed( response.config.url ) ) {

          var url = 'api/v1/auth/status';  //TODO: make configurable?
          $http   = $http || $injector.get( '$http' );  //dynamically injecting it to prevent circular Dependency Injections.

          // check if user session is still valid
          $http.get( url ).then( deferred.reject.bind( undefined, response ), statusError );

        } else {
          deferred.reject( response );
        }
        return deferred.promise;

        function statusError( res ) {
          console.log( 'statusError' );
          $rootScope.$emit( AUTH_EVENTS.notAuthenticated, res ); //sends back the original response
          deferred.reject( response );
        }

      }

      function isUrlAllowed( url ) {
        var ignoredUrls = ['api/v1/auth/status', 'api/v1/auth/logout'];
        return !_.includes( ignoredUrls, url );
      }
    }

  }// END CLASS

}() );
