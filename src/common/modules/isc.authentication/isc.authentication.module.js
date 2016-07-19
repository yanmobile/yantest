/**
 * Created by hzou on 12/8/15.
 */

(function() {
  'use strict';

  /**
   * @namespace core-ui-authentication
   */
  angular
    .module( 'isc.authentication', ['isc.core', 'isc.configuration'] )
    .run( run );

  function run( devlog, $rootScope, AUTH_EVENTS, $timeout, iscSessionModel, iscSessionStorageHelper ) {
    var channel = devlog.channel( 'isc.authentication' );
    channel.debug( 'iscNavContainer.loadDataFromStoredSession' );

    // NOTE - set the login response and create the session BEFORE calling initSessionTimeout
    // since the warning for sessionTimeout time is predicate on setting the sessionTimeout time first
    var storedLoginResponse = iscSessionStorageHelper.getLoginResponse();
    if ( !_.isEmpty( storedLoginResponse ) ) {
      channel.debug( '...got storedLoginResponse: ', storedLoginResponse );
      iscSessionModel.create( storedLoginResponse, false );
      $timeout( function() {
        $rootScope.$emit( AUTH_EVENTS.sessionResumedSuccess );
      } );
    }
  }

})();
