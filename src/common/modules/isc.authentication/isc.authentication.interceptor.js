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
  /**
   * @memberof core-ui-authentication
   * @ngdoc factory
   * @param devlog
   * @param $rootScope
   * @param $q
   * @param AUTH_EVENTS
   * @returns {{response: response, responseError: responseError}}
     */
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

    /**
     *
     * @param response
     * @returns {Object} Returns the "Response" object
       */
    function response(response) {//jshint ignore:line
      if (!response.config.cache && !endsWithExts(response.config.url, blacklistExts)) {
        devlog.channel('iscAuthenticationInterceptor').debug('Resetting timeout for %s', response.config.url, response);

        // On any server response, assume session has been renewed
        if (!response.config.bypassSessionReset) {
          $rootScope.$emit(AUTH_EVENTS.sessionTimeoutReset, response);
        }
      }

      return response;
    }

    /**
     *
     * @param response
     * @returns {Object} Returns the error handler with the response object pointer
       */
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

    /**
     *
     * @param url
     * @param exts
     * @returns {*}
       */
    function endsWithExts(url, exts) {
      return _.some(exts, function (ext) {
        return _.endsWith(url, ext);
      });
    }
  }// END CLASS
})();
