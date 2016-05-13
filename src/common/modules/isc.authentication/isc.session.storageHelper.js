/**
 * Created by douglasgoodman on 11/18/14.
 */

(function() {
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.authentication' )
    .factory( 'iscSessionStorageHelper', iscSessionStorageHelper );

  /* @ngInject */
  function iscSessionStorageHelper( devlog, $window ) {
    var log = devlog
      .channel( 'iscSessionStorageHelper' );
    log.debug( 'iscSessionStorageHelper LOADED' );

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var helper = {
      destroy                 : destroy,

      getLoginResponse        : getLoginResponse,
      setLoginResponse        : setLoginResponse,

      getConfig               : getConfig,
      setConfig               : setConfig,

      getSessionExpiresOn     : getSessionExpiresOn,
      setSessionExpiresOn     : setSessionExpiresOn,

      getShowTimedOutAlert    : getShowTimedOutAlert,
      setShowTimedOutAlert    : setShowTimedOutAlert,

      canParse                : canParse,
      getValFromSessionStorage: getValFromSessionStorage,
      setSessionStorageValue  : setSessionStorageValue
    };

    return helper;

    // ----------------------------
    // functions
    // ----------------------------

    // remove the user data so that the user
    // WONT stay logged in on page refresh
    function destroy() {
      log.debug( 'iscSessionStorageHelper.destroy' );
      $window.sessionStorage.removeItem( 'loginResponse' );
      $window.sessionStorage.removeItem( 'sessionTimeoutCounter' );
      $window.sessionStorage.removeItem( 'showTimedOutAlert' );
      $window.sessionStorage.removeItem( 'config' );
    }

    // ----------------------------
    function getLoginResponse() {
      return getValFromSessionStorage( 'loginResponse', {} );
    }

    function setLoginResponse( val ) {
      setSessionStorageValue( 'loginResponse', val );
    }

    // ----------------------------
    function getConfig() {
      return getValFromSessionStorage( 'config', {} );
    }

    function setConfig( val ) {
      setSessionStorageValue( 'config', val );
    }

    // ----------------------------
    function getSessionExpiresOn() {
      var max = getValFromSessionStorage( 'sessionExpiresOn', null );
      if ( max ) {
        log.debug( '...number: ' + max );
        return new Date( max );
      }
      log.debug( '...nope: ' );
      return new Date();
    }

    function setSessionExpiresOn( val ) {
      log.debug( 'iscSessionStorageHelper.setSessionExpiresOn:', val );
      setSessionStorageValue( 'sessionExpiresOn', val );
    }

    // ----------------------------
    function getShowTimedOutAlert() {
      return getValFromSessionStorage( 'showTimedOutAlert', false );
    }

    function setShowTimedOutAlert( val ) {
      if ( typeof val !== 'boolean' ) {
        val = false;
      }
      setSessionStorageValue( 'showTimedOutAlert', val );
    }

    // ----------------------------
    function canParse( val ) {
      var canParse = ( !_.isEmpty( val ) && val !== 'null' && val !== 'undefined' );//jshint ignore:line
      log.debug( '...canParse: ' + canParse );
      return canParse;
    }

    function getValFromSessionStorage( key, defaultVal ) {
      var valStr = $window.sessionStorage.getItem( key );
      log.debug( '...valStr: ' + valStr );

      if ( helper.canParse( valStr ) ) {
        log.debug( '...TRYING TO PARSE: ' + valStr );
        return angular.fromJson( valStr );
      }
      return defaultVal;
    }

    function setSessionStorageValue( key, val ) {
      var jsonStr = angular.toJson( val );
      $window.sessionStorage.setItem( key, jsonStr );
    }

  }// END CLASS

})();
