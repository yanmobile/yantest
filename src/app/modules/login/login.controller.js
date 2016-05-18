/**
 * Created by  on 1/5/2016, 3:56:02 PM.
 */

( function() {
  'use strict';

  angular.module( 'login' )
    .controller( 'loginController', loginController );

  function loginController( devlog, $rootScope, $window, loginApi, iscSessionModel, AUTH_EVENTS ) {
    var log = devlog.channel( 'loginController' );
    log.logFn( 'loginController' );

    // ----------------------------
    // vars
    // ----------------------------
    var self   = this;
    self.login = login;

    init();

    // ----------------------------
    // functions
    // ----------------------------

    function init() {
      loginApi.status().then( function( data ) {
        _loginSuccess( data );
      } );
    }

    function login() {
      log.logFn( 'login' );
      log.debug( 'credentials', self.credentials );

      loginApi.login( self.credentials )
        .then( _loginSuccess, _loginError );
    }

    function _loginSuccess( responseData ) {
      log.logFn( '_loginSuccess' );
      var name    = responseData.UserData.Name;
      var session = _.extend( responseData, { SessionTimeout: responseData.sessionInfo.remainingTime } );

      _.extend( responseData.UserData, {
        userRole: responseData.ApplicationRole,
        username: responseData.Username,
        FullName: [name.GivenName, name.FamilyName].join( " " ),
        jwt     : responseData.jwt
      } );

      // Create a session for timeout testing purposes
      iscSessionModel.create( session, true );

      // Saving session.id here to test/demonstrate scope of sessionStorage
      $window.sessionStorage.setItem( 'sessionId', session.sessionId );
    }

    function _loginError( responseData ) {
      log.error( 'login Failed because: ' + responseData.data.error );
      $rootScope.$emit( AUTH_EVENTS.loginFailed, responseData );
    }

  }// END CLASS

} )();
