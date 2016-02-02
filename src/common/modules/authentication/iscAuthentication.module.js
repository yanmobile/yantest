/**
 * Created by hzou on 12/8/15.
 */

(function () {
  'use strict';

  angular
    .module('isc.authentication', ['isc.core', 'isc.configuration'])
    .run(run);


  function run(devlog, $rootScope, AUTH_EVENTS, $timeout, storage, iscSessionModel, $http) {
    devlog.channel('IscRouterDefaultEventService').debug('iscNavContainer.loadDataFromStoredSession');

    // NOTE - set the login response and create the session BEFORE calling initSessionTimeout
    // since the warning for sessionTimeout time is predicate on setting the sessionTimeout time first
    var storedLoginResponse = storage.get('loginResponse');
    if (!_.isEmpty(storedLoginResponse)) {
      devlog.channel('IscRouterDefaultEventService').debug('...got storedLoginResponse: ', storedLoginResponse);
      iscSessionModel.create(storedLoginResponse, false);
      $timeout(function () {
        $rootScope.$emit(AUTH_EVENTS.iscSessionResumedSuccess);
      });
    }

    var timeoutCounter = iscSessionStorageHelper.getSessionTimeoutCounter();
    devlog.channel('IscRouterDefaultEventService').debug('...got a counter: ', timeoutCounter);
    if (timeoutCounter > 0) {
      devlog.channel('IscRouterDefaultEventService').debug('...got a counter: ' + timeoutCounter);
      iscSessionModel.initSessionTimeout(timeoutCounter);
    }
  }

})();
