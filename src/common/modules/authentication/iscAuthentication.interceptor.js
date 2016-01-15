/**
 * Created by douglasgoodman on 12/9/14.
 */
(function () {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------
  angular.module('isc.authentication')
    .factory('iscAuthenticationInterceptor', iscAuthenticationInterceptor);

  /* @ngInject */
  function iscAuthenticationInterceptor(devlog, $rootScope, $q, iscSessionModel, AUTH_EVENTS) {//jshint ignore:line

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // factory class
    // ----------------------------

    var factory = {
      response     : response,
      responseError: responseError
    };

    return factory;

    // ----------------------------
    // functions
    // ----------------------------

    function response(response) {//jshint ignore:line
      devlog.channel('iscAuthenticationInterceptor').debug('Intercepting response for %s', response.config.url, response);
      if (!response.config.cache) {
        devlog.channel('iscAuthenticationInterceptor').debug('Resetting timeout');
        iscSessionModel.resetSessionTimeout();
      } else {
        devlog.channel('iscAuthenticationInterceptor').debug('No session timeout reset');
      }

      var deferred = $q.defer();
      deferred.resolve(response);
      return deferred.promise;
    }

    function responseError(response) {

      switch ( response.status ) {
        case 401:
          devlog.channel('iscAuthenticationInterceptor').debug('...401');
          // this will happen if you just leave your computer on for a long time
          $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout, response);
          break;

        case 500: // these must be handled individually per app
          devlog.channel('iscAuthenticationInterceptor').debug('...500');
          break;

        default:
          devlog.channel('iscAuthenticationInterceptor').debug('...default');
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, response);
          break;
      }


      return $q.reject(response);
    }

  }// END CLASS
})();
