/**
 * Created by Henry Zou on 11/23/14.
 */
( function() {
  'use strict';

  angular.module( 'isc.http' )
    .factory( 'iscAuthenticationInterceptor', iscAuthenticationInterceptor );

  /* @ngInject */
  function iscAuthenticationInterceptor( $rootScope, $q, $injector, AUTH_EVENTS, statusCode, iscAuthenticationInterceptorConfig ) {

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
          var url = iscAuthenticationInterceptorConfig.getConfig( 'statusApiUrl' );
          $http   = $http || $injector.get( '$http' );  //dynamically injecting it to prevent circular Dependency Injections.

          // check if user session is still valid
          $http.get( url ).then( deferred.reject.bind( undefined, response ), statusError );

        } else {
          deferred.reject( response );
        }
        return deferred.promise;

        function statusError( res ) {
          $rootScope.$emit( AUTH_EVENTS.notAuthenticated, res ); //sends back the original response
          deferred.reject( response );
        }

      }

      function isUrlAllowed( url ) {
        var ignoredUrls = iscAuthenticationInterceptorConfig.getConfig( "ignoredUrls" );

        var isIgnored = _.some( ignoredUrls, function( ignoredUrl ) {
          return ignoredUrl.test( url );
        } );
        return !isIgnored;
      }
    }

  }// END CLASS

}() );
