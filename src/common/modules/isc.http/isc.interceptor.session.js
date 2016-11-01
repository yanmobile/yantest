/**
 * Created by Henry Zou on 11/21/15.
 */

( function() {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.http' )
    .factory( 'iscInterceptorSession', iscInterceptorSession );

  /* @ngInject */
  function iscInterceptorSession( $q, devlog ) {//jshint ignore:line
    var log = devlog.channel( 'iscInterceptorSession' );

    // ----------------------------
    // factory class
    // ----------------------------

    var factory = {
      response     : response
    };

    return factory;

    // ----------------------------
    // functions
    // ----------------------------

    function response( response ) {
      log.debug( 'hspcAppIntercptor.response' );
      log.debug( '...response ', response );

      var iscSessionModel = $injector.get( 'iscSessionModel' );

      // no need to reset storage on calls to the templateCache
      if ( !_.get( response, 'config.cache' ) && iscSessionModel.isAuthenticated() ) {
        log.debug( '...http call' );
        iscSessionModel.resetSessionTimeout();
      }

      var deferred = $q.defer();
      deferred.resolve( response );

      return deferred.promise;
    }

  }// END CLASS

} )();
