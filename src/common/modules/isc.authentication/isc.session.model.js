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
      warnAt     : 0,
      expireAt   : 0,
      maxAge     : 0,
      pingPromise: null,
      syncedOn   : null,
      status     : SESSION_STATUS.active
    };

    var noResponseMaxAge = 60 * 5; // 5 minutes

    var isConfigured = false;
    // Initialize to empty promise in case it is not configured
    /**
     *
     * @returns {promise} The promise object calls "resolve" with an empty object as a parameter
     */
    var ping         = function() {
      var deferred = $q.defer();
      deferred.resolve( {} );
      return deferred.promise;
    };
    var sessionIdPath, expirationPath;

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
      getFullName                     : getFullName,

      configure                       : configure
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

    /**
     *
     * @param config
     * @description
     * Configures session management for server communication
     * Pass in a configuration object with these properties:
     *
     * ping              - a function that calls a REST api which queries the server for remaining session time,
     *                       without causing a session time renewal
     * sessionIdPath     - the path in the response data that represents the session id
     */
    function configure( config ) {
      isConfigured     = true;
      ping             = config.ping;
      sessionIdPath    = config.sessionIdPath;
      expirationPath   = config.expirationPath;
      noResponseMaxAge = config.noResponseMaxAge || noResponseMaxAge;
    }

    //
    /**
     *
     * @param syncedOn
     * @returns {*}
     * @description
     * Calls a non-invasive ping API which inspects the current server session, without renewing that session,
     * and returns information about the time remaining in this session.
     */
    function callPing( syncedOn ) {
      channel.logFn( 'callPing' );
      sessionTimeout.syncedOn = syncedOn || sessionTimeout.syncedOn;

      var request = ping().then( _pingSuccess, _pingError )
        .finally( function() {
          sessionTimeout.pingPromise = null;
        } );

      sessionTimeout.pingPromise = request;
      return request;

      // On successful ping, re-sync the local counter with the ping response,
      // falling back to no change in the counter.
      function _pingSuccess( response ) {
        channel.logFn( '_pingSuccess' );
        var data                 = response.data;
        sessionTimeout.status    = SESSION_STATUS.active;
        sessionTimeout.syncedOn  = SESSION_STATUS.alive;
        sessionTimeout.sessionId = _.get( data, sessionIdPath, sessionTimeout.sessionId );
        updateExpireAndWarnAt( _.get( data, expirationPath ) );
      }

      // Assumes any error returning from a ping means no server response
      function _pingError() {
        channel.logFn( '_pingError' );
        // Flag this as no response received
        if ( sessionTimeout.status === SESSION_STATUS.active ) {
          sessionTimeout.status = SESSION_STATUS.noResponse;
        }
      }
    }

    function destroy() {
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

      $rootScope.$emit( AUTH_EVENTS.sessionChange );
      $rootScope.$emit( AUTH_EVENTS.logoutSuccess );
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
        var expirationTime = moment( expiration ),
            maxAge         = sessionTimeout.maxAge,
            warnThreshold  = ( maxAge > 180 ) ? 0.25 : 0.50,
            warnTimespan   = maxAge * ( 1 - warnThreshold );

        // Because we may be updating this when the expiration has not been set to its max
        // (if session is regenerated from another tab), we need to consider the expiration window
        // as a sliding timespan, with warning occurring for a subset at the beginning of that timespan.
        sessionTimeout.warnAt   = expirationTime.add( -maxAge, 's' ).add( warnTimespan, 's' ).toDate();
        sessionTimeout.expireAt = expiration;
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

        if ( sessionTimeout.status === SESSION_STATUS.noResponse ) {
          if ( !sessionTimeout.pingPromise ) {
            callPing( SESSION_STATUS.noResponse );
          }
          _checkForNoResponseAtMax();
        }
        else {
          if ( !sessionTimeout.pingPromise ) {
            _checkForWarnOrExpire( isConfigured );
          }
        }
      }, 3000 );

      function _checkForNoResponseAtMax() {
        channel.logFn( "_checkForNoResponseAtMax" );
        // If the time with no response has reached its maximum, expire client session
        if ( moment().isAfter( sessionTimeout.expireAt ) ) {
          _expireSession();
        }
      }

      function _checkForWarnOrExpire( doPingFirst ) {
        channel.logFn( "_checkForWarnOrExpire" );

        // warn
        if ( isTimeWarned() ) {
          channel.debug( '...expireAt ', sessionTimeout.expireAt );
          if ( doPingFirst && sessionTimeout.syncedOn !== SESSION_STATUS.warn ) {
            callPing( SESSION_STATUS.warn ).then( function() {
              _checkForWarnOrExpire( false );
            } );
          }
          else {
            $rootScope.$emit( AUTH_EVENTS.sessionTimeoutWarning );
          }
        }

        // expire/logout
        else if ( isTimeExpired() ) {
          channel.debug( '...sessionTimeout.expireAt ' + sessionTimeout.expireAt );

          if ( doPingFirst && sessionTimeout.syncedOn !== SESSION_STATUS.expired ) {
            callPing( SESSION_STATUS.expired ).then( function() {
              _checkForWarnOrExpire( false );
            } );
          }
          else {
            _expireSession();
          }
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
      return sessionTimeout.expireAt - Date.now() < 0;
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
      // Do not reset timer if we are still waiting on a server response to a ping call
      if ( sessionTimeout.syncedOn !== SESSION_STATUS.noResponse ) {
        var expiration = moment().add( sessionTimeout.maxAge, 's' ).toDate();

        updateExpireAndWarnAt( expiration );
        sessionTimeout.syncedOn = SESSION_STATUS.alive;
      }
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

