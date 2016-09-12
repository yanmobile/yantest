/**
 * Created by douglasgoodman on 11/18/14.
 */

( function() {
  'use strict';

  angular.module( 'isc.authentication' )
    .factory( 'iscSessionModel', iscSessionModel );

  /**
   * @memberof core-ui-authentication
   * @ngdoc factory
   * @param $q
   * @param $http
   * @param devlog
   * @param $rootScope
   * @param $window
   * @param iscCookieManager
   * @param iscSessionStorageHelper
   * @param AUTH_EVENTS
   * @param SESSION_STATUS
   * @returns {{create: create, destroy: destroy, initSessionTimeout: initSessionTimeout, stopSessionTimeout: stopSessionTimeout, resetSessionTimeout: resetSessionTimeout, getCredentials: getCredentials, getCurrentUser: getCurrentUser, getCurrentUserRole: getCurrentUserRole, isAuthenticated: isAuthenticated, getFullName: getFullName, configure: configure}}
   */
  function iscSessionModel( $q, $http, $rootScope, $window,
    devlog, iscCookieManager, iscSessionStorageHelper,
    AUTH_EVENTS, SESSION_STATUS ) {
    var channel = devlog.channel( 'iscSessionModel' );
    channel.logFn( 'iscSessionModel' );

    // ----------------------------
    // vars
    // ----------------------------

    var anonymousUser = { userRole: '*', FullName: 'anonymous' };
    var credentials   = null;
    var currentUser   = anonymousUser;

    var sessionTimeout = {
      warnAt  : 0,
      expireAt: 0,
      maxAge  : 0,
      status  : SESSION_STATUS.active
    };

    var noResponseMaxAge = 60 * 5; // 5 minutes

    var timeoutInterval;

    // ----------------------------
    // class factory
    // ----------------------------

    var model = {
      create                          : create,
      destroy                         : destroy,

      initSessionTimeout              : initSessionTimeout,
      stopSessionTimeout              : stopSessionTimeout,
      resetSessionTimeout             : resetSessionTimeout,

      storeSessionTimeout             : storeSessionTimeout,
      freshenSessionTimeoutFromStorage: freshenSessionTimeoutFromStorage,

      getCredentials                  : getCredentials,

      getCurrentUser                  : getCurrentUser,
      getCurrentUserRole              : getCurrentUserRole,

      isAuthenticated                 : isAuthenticated,
      getFullName                     : getFullName
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    /**
     *
     * @param sessionData
     * @param isSessionNew
     */
    function create( sessionData, isSessionNew ) {
      channel.logFn( 'create' );
      // $log.debug( '...sessionData: ' + JSON.stringify( sessionData  ));

      // store the login response for page refreshes
      iscSessionStorageHelper.setLoginResponse( sessionData );

      var jwt = _.get( sessionData, 'jwt' );
      if ( jwt ) {
        iscCookieManager.set( 'jwt', jwt );
        $http.defaults.headers.common.jwt = jwt;
      }

      credentials = {}; // for now we arent using credentials
      setCurrentUser( sessionData.UserData );

      // set the timeout
      sessionTimeout.maxAge = sessionData.SessionTimeout;
      var initialExpiresOn  = moment().add( sessionTimeout.maxAge, 'seconds' );
      setSessionExpiresOn( initialExpiresOn );
      initSessionTimeout();

      $rootScope.$emit( AUTH_EVENTS.sessionChange );
      if ( isSessionNew ) {
        channel.debug( '...new ' );
        $rootScope.$emit( AUTH_EVENTS.loginSuccess );
      }
      else {
        // $log.debug( '...resumed ' );
        $rootScope.$emit( AUTH_EVENTS.sessionResumedSuccess );
      }
    }

    //
    /**
     *
     * @param eventData :: Object {}
     * can be used, for example, to pass in a next state Object {stateName : '', stateParams: {}}
     * @returns {*}
     * @description
     * Destroys client data in session storage, clears sessionTimeout and emits AUTH_EVENTS.logoutSuccess
     *
     */

    function destroy( eventData ) {
      channel.logFn( 'destroy' );

      // create a session with null data
      currentUser = anonymousUser;
      credentials = null;

      iscCookieManager.remove( 'jwt' );
      $http.defaults.headers.common.jwt = null;

      sessionTimeout.status = SESSION_STATUS.killed;

      // remove the user data so that the user
      // WONT stay logged in on page refresh
      iscSessionStorageHelper.destroy();
      stopSessionTimeout();

      $rootScope.$emit( AUTH_EVENTS.sessionChange, eventData );
      $rootScope.$emit( AUTH_EVENTS.logoutSuccess, eventData );
    }

    // --------------
    function storeSessionTimeout() {
      var expiresAt = sessionTimeout.expireAt;
      if ( expiresAt ) {
        setSessionExpiresOn( sessionTimeout.expireAt );
      }
    }

    function freshenSessionTimeoutFromStorage() {
      var expiration = getSessionExpiresOn();

      updateExpireAndWarnAt( expiration );

      if ( isTimeWarned() ) {
        return SESSION_STATUS.warn;
      }
      else if ( isTimeExpired() ) {
        return SESSION_STATUS.expired;
      }
      else {
        return SESSION_STATUS.active;
      }
    }

    function initSessionTimeout() {
      channel.logFn( "initSessionTimeout" );

      freshenSessionTimeoutFromStorage();
      _logTimer();
      doSessionTimeout();
    }

    function updateExpireAndWarnAt( expiration ) {
      if ( expiration !== undefined ) {
        var maxAge        = sessionTimeout.maxAge,
            warnThreshold = ( maxAge > 180 ) ? 0.25 : 0.50,
            warnTimespan  = maxAge * ( 1 - warnThreshold );

        sessionTimeout.expireAt = moment( expiration );
        sessionTimeout.warnAt   = moment( expiration ).add( -maxAge, 's' ).add( warnTimespan, 's' );
      }
    }

    /**
     * private
     */
    // Session expiration is in iscCookieManager so it can be accessed by multiple tabs
    function getSessionExpiresOn() {
      var max = iscCookieManager.get( 'sessionExpiresOn' );
      if ( max ) {
        channel.debug( '...number: ' + max );
        return new Date( max );
      }
      channel.debug( '...nope: ' );
      return new Date();
    }

    function setSessionExpiresOn( val ) {
      channel.debug( 'setSessionExpiresOn', val );
      iscCookieManager.set( 'sessionExpiresOn', val );
    }

    function doSessionTimeout() {
      channel.logFn( "doSessionTimeout" );
      if ( timeoutInterval ) {
        channel.debug( '...already there' );
        return;
      }

      // Checks to perform each tick
      timeoutInterval = $window.setInterval( function() {
        _logTimer();

        _checkForWarnOrExpire();

      }, 3000 );

      function _checkForWarnOrExpire() {
        channel.logFn( "_checkForWarnOrExpire" );

        // warn
        if ( isTimeWarned() ) {
          $rootScope.$emit( AUTH_EVENTS.sessionTimeoutWarning );
        }

        // expire/logout
        else if ( isTimeExpired() ) {
          channel.debug( '...sessionTimeout.expireAt ' + sessionTimeout.expireAt );
          _expireSession();
        }
      }

      function _expireSession() {
        channel.logFn( "_expireSession" );
        iscSessionStorageHelper.setShowTimedOutAlert( true );
        stopSessionTimeout();
        $rootScope.$emit( AUTH_EVENTS.sessionTimeout );
      }
    }

    function isTimeWarned() {
      var warnAtTime   = _.getRemainingTime( sessionTimeout.warnAt ),
          expireAtTime = _.getRemainingTime( sessionTimeout.expireAt );
      return warnAtTime <= 0 && expireAtTime > 0;
    }

    function isTimeExpired() {
      return moment().isAfter( sessionTimeout.expireAt );
    }

    /**
     *
     */
    function stopSessionTimeout() {
      channel.logFn( "stopSessionTimeout" );
      if ( angular.isDefined( timeoutInterval ) ) {
        channel.debug( '...cancelling' );
        $window.clearInterval( timeoutInterval );
        timeoutInterval = null;
      }

      channel.debug( '...timeoutInterval', timeoutInterval );
    }

    function resetSessionTimeout() {
      channel.logFn( "resetSessionTimeout" );
      var expiration = moment().add( sessionTimeout.maxAge, 's' );
      stopSessionTimeout();
      setSessionExpiresOn( expiration );
      initSessionTimeout();
    }

    // --------------
    /**
     *
     * @returns {*}
     */
    function getCredentials() {
      channel.logFn( 'getCredentials' );
      return credentials;
    }

    // --------------
    /**
     *
     * @returns {XMLList|XML}
     */
    function getCurrentUser() {
      channel.logFn( 'getCurrentUser' );
      return angular.copy( currentUser ); // To prevent external modification
    }

    /**
     *
     * @param user
     */
    function setCurrentUser( user ) {
      channel.logFn( 'setCurrentUser' );
      channel.debug( '...user: ' + angular.toJson( user ) );
      currentUser = angular.copy( user ); // To prevent external modificiation
    }

    // --------------
    /**
     *
     * @returns {*}
     */
    function getCurrentUserRole() {
      channel.logFn( 'getCurrentUserRole' );
      return _.get( currentUser, "userRole" );
    }

    // --------------
    /**
     *
     * @returns {boolean}
     */
    function isAuthenticated() {
      //channel.debug('iscSessionModel.isAuthenticated', currentUser);
      // '*' denotes anonymous user (AKA not authenticated)
      return _.get( currentUser, 'userRole', '*' ) !== '*';
    }

    // --------------
    /**
     *
     * @returns {string}
     */
    function getFullName() {
      channel.logFn( 'getFullName' );
      return !!currentUser ? currentUser.FullName : '';
    }

    function _logTimer() {
      channel.logFn( '_logTimer' );
      channel.debug( '...sessionTimeout.expireAt', sessionTimeout.expireAt, "(" + _.getRemainingTime( sessionTimeout.expireAt ) + "s remaining)" );
      channel.debug( '...sessionTimeout.warnAt', sessionTimeout.warnAt, "(" + _.getRemainingTime( sessionTimeout.warnAt ) + "s remaining)" );
    }
  }// END CLASS

} )();

