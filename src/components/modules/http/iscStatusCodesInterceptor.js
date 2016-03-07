/**
 * Created by Henry Zou on 11/23/14.
 */
(function () {
  'use strict';

  angular.module('isc.http')
    .factory('iscStatusCodesInterceptor', iscStatusCodesInterceptor);

  /* @ngInject */
  function iscStatusCodesInterceptor($q, $rootScope, AUTH_EVENTS, statusCode, iscConfirmationService) {//jshint ignore:line
    // ----------------------------
    // factory class
    // ----------------------------

    var factory = {
      responseError         : responseError,
      iscConfirmationService: iscConfirmationService
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
    function responseError(response) {

      var preventDefault = response.config.preventDefault;
      preventDefault     = preventDefault || [];

      if (preventDefault !== true && !_.contains(preventDefault, response.status)) {
        switch ( response.status ) {
          case statusCode.Unauthorized:
            // this will happen if you just leave your computer on for a long time
            $rootScope.$emit(AUTH_EVENTS.sessionTimeout, response);
            break;
          case statusCode.Forbidden:
            //display not-authorized modal
            $rootScope.$emit(AUTH_EVENTS.notAuthenticated, response);
            break;
          case statusCode.NotFound:
            response.dialogPromise = getDialogPromise(response.status);
            break;
          default:
            response.dialogPromise = getDialogPromise('generic');
        }
      }

      function getDialogPromise(code) {
        return iscConfirmationService.show({
          title        : 'StatusCode_' + code + '_title',
          message      : 'StatusCode_' + code + '_message',
          btnCancelText: false, //hides the cancel (reject) button
          btnOkText    : 'StatusCode_ok_btn'
        });
      }

      // $q.reject is needed in order to invoke the next responseError interceptor in the array
      return $q.reject(response);
    }
  }// END CLASS


})();
