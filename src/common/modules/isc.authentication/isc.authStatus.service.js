/**
 * Created by paul robbins on 7/8/16.
 */

(function() {
  'use strict';

  angular.module( 'isc.authentication' )
    .factory( 'iscAuthStatusService', iscAuthStatusService );

  /* @ngInject */
  function iscAuthStatusService( $rootScope, $window,
                                 storage, iscAuthStatus, iscSessionStorageHelper,
                                 NAV_EVENTS, AUTH_EVENTS ) {
    var thisTabHash;

    angular.element( $window ).on( 'focus', authStatusFocus );
    angular.element( $window ).on( 'blur', authStatusBlur );

    return {
      checkAuthStatus: checkAuthStatus
    };

    function checkAuthStatus() {
      var config              = iscAuthStatus.getConfig(),
          storedLoginResponse = iscSessionStorageHelper.getLoginResponse(),
          isBrowserLoggedOut  = storage.get( 'browserIsLoggedOut' );

      if ( config.authStatusUrl !== undefined
        && _.isEmpty( storedLoginResponse ) // this is checked in isc.authentication.run()
        && !config.authStatusHasBeenChecked && !isBrowserLoggedOut ) {

        config.authStatusHasBeenChecked = true;

        config.authResults = callAuthStatus( config.authStatusUrl );

        if ( config.authResults ) {
          $rootScope.$emit( NAV_EVENTS.tabLoaded, config.authResults );

          config.authResults = null;
        }
      }
    }

    function authStatusFocus() {
      var config       = iscAuthStatus.getConfig(),
          shouldLogOut = storage.get( 'browserIsLoggedOut' ),
          callback     = config.authStatusFocusCallback || _.noop;

      if ( config.useAuthStatus ) {
        if ( shouldLogOut ) {
          $rootScope.$emit( AUTH_EVENTS.logout );
          return;
        }

        var storageHash = storage.get( 'hashcode' );

        if ( storageHash && storageHash !== thisTabHash ) {
          thisTabHash          = storageHash;
          var authStatusResult = callAuthStatus( config.authStatusUrl );
          return callback( authStatusResult );
        }
      }
    }

    function authStatusBlur() {
      thisTabHash = storage.get( 'hashcode' );
    }

    function callAuthStatus( url ) {
      var myRet = undefined;

      $.ajax( {
        method: "GET",
        url   : url,
        async : false
      } ).done( function( results ) {
        if ( results.LoggedIn ) {
          myRet = results;
        }
      } );

      return myRet;
    }

  }
})();

