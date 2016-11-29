/**
 * Created by Henry Zou on 11/21/15.
 */

( function() {
  'use strict';

  angular.module( 'isc.http' )
    .factory( 'iscSessionInterceptor', iscSessionInterceptor );

  /* @ngInject */
  function iscSessionInterceptor( $q, $injector, devlog ) {//jshint ignore:line
    var log = devlog.channel( 'iscSessionInterceptor' );

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
      log.debug( 'iscSessionInterceptor.response' );
      log.debug( '...response ', response );

      var iscSessionModel = $injector.get( 'iscSessionModel' );

      // no need to reset storage on calls to the templateCache
      if ( iscSessionModel.isAuthenticated() && !_.get( response, 'config.cache' ) ) {
        log.debug( '...http call' );
        iscSessionModel.resetSessionTimeout();
      }

      var deferred = $q.defer();
      deferred.resolve( response );

      return deferred.promise;
    }

  }// END CLASS

} )();
