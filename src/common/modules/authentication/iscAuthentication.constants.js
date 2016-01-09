/**
 * Created by hzou on 12/8/15.
 */

(function () {
  'use strict';

  angular
    .module('isc.authentication')
    .constant('AUTH_EVENTS', {
      loginError           : 'iscLoginError',
      loginSuccess         : 'iscLoginSuccess',
      loginFailed          : 'iscLoginFailed',
      logout               : 'iscLogout',
      logoutSuccess        : 'iscLogoutSuccess',
      notAuthenticated     : 'iscNotAuthenticated',
      notAuthorized        : 'iscNotAuthorized',
      openSortOptions      : 'iscOpenSortOptions',
      responseError        : 'iscResponseError',
      sessionChange        : 'iscSessionChange', //gets fired when "iscSessionResumedSuccess", "iscSessionTimeout", "iscLogout"
      sessionResumedSuccess: 'iscSessionResumedSuccess',
      sessionTimeout       : 'iscSessionTimeout',
      sessionTimeoutConfirm: 'iscSessionTimeoutConfirm',
      sessionTimeoutWarning: 'iscSessionTimeoutWarning',
      sessionTimeoutReset  : 'iscSessionTimeoutReset'
    });

})();
