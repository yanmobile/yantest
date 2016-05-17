/**
 * Created by hzou on 12/8/15.
 */

( function() {
  'use strict';

  /**
   * @memberof core-ui-authentication
   * @ngdoc constant
   * @name AUTH_EVENTS
   * @description
   * Please click the "source" link on the header to see the constants
   */
  angular
    .module( 'isc.authentication' )
    .constant( 'AUTH_EVENTS', {
      loginError           : 'iscLoginError',
      loginSuccess         : 'iscLoginSuccess',
      loginFailed          : 'iscLoginFailed',
      logout               : 'iscLogout',
      logoutSuccess        : 'iscLogoutSuccess',
      notAuthenticated     : 'iscNotAuthenticated',
      notAuthorized        : 'iscNotAuthorized',
      notFound             : 'iscNotFound',
      responseError        : 'iscResponseError',
      sessionChange        : 'iscSessionChange', //gets fired when "iscSessionResumedSuccess", "iscSessionTimeout", "iscLogout"
      sessionResumedSuccess: 'iscSessionResumedSuccess',
      sessionTimeout       : 'iscSessionTimeout',
      sessionTimeoutConfirm: 'iscSessionTimeoutConfirm',
      sessionTimeoutWarning: 'iscSessionTimeoutWarning',
      sessionTimeoutReset  : 'iscSessionTimeoutReset'
    } );

} )();
