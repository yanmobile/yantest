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
  function iscAuthenticationInterceptor(devlog, $rootScope, $q, AUTH_EVENTS) {//jshint ignore:line

    // ----------------------------
    // vars
    // ----------------------------
    //TODO: make this configurable
    var blacklistExts = ['.html', '.json'];

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
      if (!response.config.cache && !endsWithExts(response.config.url, blacklistExts)) {
        devlog.channel('iscAuthenticationInterceptor').debug('Resetting timeout for %s', response.config.url, response);
        $rootScope.$emit(AUTH_EVENTS.sessionTimeoutReset, response);
      }

      return response;
    }

    function responseError(response) {

      switch ( response.status ) {
        case 401:
          devlog.channel('iscAuthenticationInterceptor').debug('...401');
          // this will happen if you just leave your computer on for a long time
          $rootScope.$emit(AUTH_EVENTS.sessionTimeout, response);
          break;

        case 500: // these must be handled individually per app
          devlog.channel('iscAuthenticationInterceptor').debug('...500');
          break;

        default:
          devlog.channel('iscAuthenticationInterceptor').debug('...default');
          $rootScope.$emit(AUTH_EVENTS.notAuthorized, response);
          break;
      }


      return $q.reject(response);
    }

    function endsWithExts(url, exts) {
      return _.any(exts, function (ext) {
        return _.endsWith(url, ext);
      });
    }
  }// END CLASS
})();
