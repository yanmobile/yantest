/**
 * Created by hzou on 12/8/15.
 */

(function () {
  'use strict';

  angular
    .module('isc.authentication', ['isc.core', 'isc.configuration'])
    .run(run);


  function run(devlog, $rootScope, AUTH_EVENTS, iscSessionModel, iscSessionStorageHelper) {
    devlog.channel('IscRouterDefaultEventService').debug('iscNavContainer.loadDataFromStoredSession');

    // NOTE - set the login response and create the session BEFORE calling initSessionTimeout
    // since the warning for sessionTimeout time is predicate on setting the sessionTimeout time first
    var storedLoginResponse = iscSessionStorageHelper.getLoginResponse();
    if (!_.isEmpty(storedLoginResponse)) {
      devlog.channel('IscRouterDefaultEventService').debug('...got storedLoginResponse: ', storedLoginResponse);
      iscSessionModel.create(storedLoginResponse, false);
      $rootScope.$emit(AUTH_EVENTS.iscSessionResumedSuccess);
    }

    var timeoutCounter = iscSessionStorageHelper.getSessionTimeoutCounter();
    devlog.channel('IscRouterDefaultEventService').debug('...got a counter: ', timeoutCounter);
    if (timeoutCounter > 0) {
      devlog.channel('IscRouterDefaultEventService').debug('...got a counter: ' + timeoutCounter);
      iscSessionModel.initSessionTimeout(timeoutCounter);
    }
  }

})();
