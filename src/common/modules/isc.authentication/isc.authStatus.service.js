/**
 * Created by paul robbins on 7/8/16.
 */

( function() {
  'use strict';

  angular.module( 'isc.authentication' )
    .factory( 'iscAuthStatusService', iscAuthStatusService );

  /* @ngInject */
  function iscAuthStatusService( devlog, $rootScope, $window,
    iscCookieManager, iscAuthStatus, iscSessionModel, iscSessionStorageHelper,
    NAV_EVENTS, AUTH_EVENTS ) {
    var channel = devlog.channel( 'iscAuthStatus' );

    var thisTabHash,
        authStatusCallFailed = false;

    angular.element( $window ).on( 'focus', authStatusFocus );
    angular.element( $window ).on( 'blur', authStatusBlur );

    return {
      checkAuthStatus: checkAuthStatus
    };

    function checkAuthStatus() {
      channel.logFn( 'checkAuthStatus' );

      var config              = iscAuthStatus.getConfig(),
          storedLoginResponse = iscSessionStorageHelper.getLoginResponse(),
          isBrowserLoggedOut  = iscCookieManager.get( 'browserIsLoggedOut' );

      channel.log( 'storedLoginResponse: ', storedLoginResponse );
      if ( config.authStatusUrl !== undefined &&
        _.isEmpty( storedLoginResponse ) && // this is checked in isc.authentication.run()
        !config.authStatusHasBeenChecked && !isBrowserLoggedOut ) {

        config.authStatusHasBeenChecked = true;

        channel.log( 'calling authStatusUrl' );
        config.authResults = callAuthStatus( config.authStatusUrl );

        if ( config.authResults ) {
          $rootScope.$emit( NAV_EVENTS.tabLoaded, config.authResults );

          config.authResults = null;
        }
      }
    }

    function authStatusFocus() {
      channel.logFn( 'authStatusFocus' );

      var config       = iscAuthStatus.getConfig(),
          shouldLogOut = iscCookieManager.get( 'browserIsLoggedOut' ),
          callback     = config.authStatusFocusCallback || _.noop;

      if ( config.useAuthStatus ) {
        if ( shouldLogOut && iscSessionModel.isAuthenticated() ) {
          channel.log( 'Not authenticated -- logging out' );
          $rootScope.$emit( AUTH_EVENTS.logout );
          return;
        }

        var storageHash = iscCookieManager.get( 'hashcode' );
        channel.log( 'storageHash ', storageHash );

        if ( storageHash && storageHash !== thisTabHash ) {
          var authStatusResult = callAuthStatus( config.authStatusUrl );
          if ( authStatusResult ) {
            thisTabHash = storageHash;
            return callback( authStatusResult );
          }
        }
      }
    }

    function authStatusBlur() {
      channel.logFn( 'authStatusBlur' );

      // If the last call to auth/status failed, do not update the local hash.
      // This will force auth/status to be retried when this window is focused again.
      if ( !authStatusCallFailed ) {
        thisTabHash = iscCookieManager.get( 'hashcode' );
      }
    }

    function callAuthStatus( url ) {
      channel.logFn( 'callAuthStatus' );

      var myRet,
          config = iscAuthStatus.getConfig();

      //since this ajax call is synchronous, the return statement won't execute until this ajax call has returned and the callback executed
      $.ajax( {
        method : "GET",
        url    : url,
        async  : false,   //synchronous/blocking call
        success: onSuccess,
        error  : onError
      } );

      return myRet; //will be populated with onSuccess result if successful, else it'll remain as undefined

      function onSuccess( results ) {
        channel.log( '...onSuccess' );

        // Some applications may have already parsed the result to JSON in an interceptor
        results = _.isString( results ) ? JSON.parse( results ) : results;

        // If no authStatusSuccessTest has been configured, or the configured one returns truthy,
        // parse the results.
        if ( !_.isFunction( config.authStatusSuccessTest ) || config.authStatusSuccessTest.call( null, results ) ) {
          myRet = results;
        }

        authStatusCallFailed = false;
      }

      function onError() {
        channel.log( '...onError' );

        authStatusCallFailed = true;
      }
    }

  }
} )();

