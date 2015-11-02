/**
 * Created by douglasgoodman on 12/9/14.
 */
(function () {
  'use strict';

  iscAuthenticationInterceptor.$inject = [
    '$log', '$rootScope', '$q', 'iscSessionModel', 'AUTH_EVENTS', '$templateCache'
  ];

  function iscAuthenticationInterceptor ($log, $rootScope, $q, iscSessionModel, AUTH_EVENTS, $templateCache) {//jshint ignore:line

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // factory class
    // ----------------------------

    var factory = {
      response: response,
      responseError: responseError
    };

    return factory;

    // ----------------------------
    // functions
    // ----------------------------

    function response (response) {//jshint ignore:line
      //$log.debug( 'iscAuthenticationInterceptor.response ', response );
      if (response.config.url.indexOf ('http') !== -1) {
        //$log.debug('...http call');
        iscSessionModel.resetSessionTimeout ();
      }

      var deferred = $q.defer ();
      deferred.resolve (response);
      return deferred.promise;
    }

    function responseError (response) {

      switch (response.status) {
        case 401:
          //$log.debug('...401');
          // this will happen if you just leave your computer on for a long time
          $rootScope.$broadcast (AUTH_EVENTS.sessionTimeout, response);
          break;

        case 500: // these must be handled individually per app
          //$log.debug('...500');
          break;

        default:
          //$log.debug('...default');
          $rootScope.$broadcast (AUTH_EVENTS.notAuthorized, response);
          break;
      }


      return $q.reject (response);
    }

  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module ('isc.common')
      .factory ('iscAuthenticationInterceptor', iscAuthenticationInterceptor);
}) ();
