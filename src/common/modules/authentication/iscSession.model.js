/**
 * Created by douglasgoodman on 11/18/14.
 */

(function () {
  'use strict';

  angular.module('isc.authentication')
    .factory('iscSessionModel', iscSessionModel);

  function iscSessionModel(
    $q, devlog, $rootScope, $interval, iscSessionStorageHelper, AUTH_EVENTS
  ) {
    devlog.channel('iscSessionModel').debug('iscSessionModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var anonymousUser = { userRole: '*', FullName: 'anonymous' };
    var credentials   = null;
    var currentUser   = anonymousUser;

    var sessionTimeout   = {
      warnAt     : 0,
      expireAt   : 0,
      remaining  : 0,
      pingPromise: null,
      syncedOn   : null,
      status     : 'active'
    };
    var noResponseMaxAge = 60 * 5; // 5 minutes
    var warnThreshold = 0.25;

    var isConfigured = false;
    // Initialize to empty promise in case it is not configured
    var ping = function () {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    };
    var sessionIdPath, remainingTimePath;

    var intervalPromise;

    // ----------------------------
    // class factory
    // ----------------------------

    var model = {
      create : create,
      destroy: destroy,

      initSessionTimeout : initSessionTimeout,
      stopSessionTimeout : stopSessionTimeout,
      resetSessionTimeout: resetSessionTimeout,
      getRemainingTime   : getRemainingTime,

      getCredentials: getCredentials,

      getCurrentUser    : getCurrentUser,
      getCurrentUserRole: getCurrentUserRole,

      isAuthenticated: isAuthenticated,
      getFullName    : getFullName,

      configure         : configure
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    function create(sessionData, isSessionNew) {
      devlog.channel('iscSessionModel').debug('iscSessionModel.create');
      // $log.debug( '...sessionData: ' + JSON.stringify( sessionData  ));

      // store the login response for page refreshes
      iscSessionStorageHelper.setLoginResponse(sessionData);

      credentials = {}; // for now we arent using credentials
      setCurrentUser(sessionData.UserData);

      // set the timeout
      var maxAge = sessionData.SessionTimeout;
      iscSessionStorageHelper.setSessionTimeoutMax(maxAge);
      initSessionTimeout(maxAge);

      $rootScope.$emit(AUTH_EVENTS.sessionChange);
      if (isSessionNew) {
        devlog.channel('iscSessionModel').debug('...new ');
        $rootScope.$emit(AUTH_EVENTS.loginSuccess);
      }
      else {
        // $log.debug( '...resumed ' );
        $rootScope.$emit(AUTH_EVENTS.sessionResumedSuccess);
      }
    }

    /**
     * Configures session management for server communication
     * Pass in a configuration object with these properties:
     *
     * ping              - a function that calls a REST api which queries the server for remaining session time,
     *                       without causing a session time renewal
     * sessionIdPath     - the path in the response data that represents the session id
     * remainingTimePath - the path in the response data that represents the remaining time in seconds
     */
    function configure(config) {
      isConfigured      = true;
      ping              = config.ping;
      sessionIdPath     = config.sessionIdPath;
      remainingTimePath = config.remainingTimePath;
      noResponseMaxAge  = config.noResponseMaxAge || noResponseMaxAge;
    }

    // Calls a non-invasive ping API which inspects the current server session, without renewing that session,
    // and returns information about the time remaining in this session.
    function callPing(syncedOn) {
      sessionTimeout.syncedOn = syncedOn || sessionTimeout.syncedOn;

      var request = ping().then(_pingSuccess, _pingError)
        .finally(function () {
          sessionTimeout.pingPromise = null;
        });

      sessionTimeout.pingPromise = request;
      return request;

      // On successful ping, re-sync the local counter with the ping response,
      // falling back to no change in the counter.
      function _pingSuccess(response) {
        var data                 = response.data;
        sessionTimeout.status    = 'active';
        sessionTimeout.syncedOn  = 'alive';
        sessionTimeout.sessionId = _.get(data, sessionIdPath, sessionTimeout.sessionId);
        sessionTimeout.remaining = _.get(data, remainingTimePath, sessionTimeout.remaining);
      }

      // Assumes any error returning from a ping means no server response
      function _pingError() {
        // Flag this as no response received
        if (sessionTimeout.status === 'active') {
          sessionTimeout.status    = 'no response';
          sessionTimeout.remaining = noResponseMaxAge;
        }
      }
    }

    function destroy() {
      devlog.channel('iscSessionModel').debug('iscSessionModel.destroy');

      // create a session with null data
      currentUser = anonymousUser;
      credentials = null;

      sessionTimeout.status = 'killed';

      // remove the user data so that the user
      // WONT stay logged in on page refresh
      iscSessionStorageHelper.destroy();
      stopSessionTimeout();

      $rootScope.$emit(AUTH_EVENTS.sessionChange);
      $rootScope.$emit(AUTH_EVENTS.logoutSuccess);
    }

    // --------------
    function initSessionTimeout(timeoutCounter) {
      devlog.channel('iscSessionModel').debug('iscSessionModel.initSessionTimeout');
      devlog.channel('iscSessionModel').debug('...timeoutCounter: ' + timeoutCounter);

      var maxAge = iscSessionStorageHelper.getSessionTimeoutMax();

      // on page refresh we get this from sessionStorage and pass it in
      // otherwise assume it to be the maxAge
      sessionTimeout.remaining = (timeoutCounter > 0) ? timeoutCounter : maxAge;
      devlog.channel('iscSessionModel').debug('...sessionTimeout.remaining: ' + sessionTimeout.remaining);

      sessionTimeout.warnAt = parseInt(maxAge * warnThreshold);
      devlog.channel('iscSessionModel').debug('...sessionTimeout.warnAt: ' + sessionTimeout.warnAt);

      sessionTimeout.expireAt = 0;
      devlog.channel('iscSessionModel').debug('...sessionTimeout.expireAt: ' + sessionTimeout.expireAt);

      doSessionTimeout();
    }

    /**
     * private
     */
    function doSessionTimeout() {
      devlog.channel('iscSessionModel').debug('iscSessionModel.doSessionTimeout');
      if (intervalPromise) {
        devlog.channel('iscSessionModel').debug('...already there');
        return;
      }

      // Checks to perform each tick
      intervalPromise = $interval(function () {
        sessionTimeout.remaining -= 5;
        _setSessionAndLog();

        if (sessionTimeout.status === 'no response') {
          if (!sessionTimeout.pingPromise) {
            callPing('no response');
          }
          _checkForNoResponseAtMax();
        }
        else {
          if (!sessionTimeout.pingPromise) {
            _checkForWarnOrExpire(isConfigured);
          }
        }
      }, 5000);


      function _setSessionAndLog() {
        iscSessionStorageHelper.setSessionTimeoutCounter(sessionTimeout.remaining);
        devlog.channel('iscSessionModel').debug('...TICK ');
        devlog.channel('iscSessionModel').debug('...sessionTimeout.expireAt ' + sessionTimeout.expireAt);
        devlog.channel('iscSessionModel').debug('...sessionTimeout.remaining ' + sessionTimeout.remaining);
        devlog.channel('iscSessionModel').debug('...sessionTimeout.warnAt ' + sessionTimeout.warnAt);
        devlog.channel('iscSessionModel').debug('...remainingTime ' + sessionTimeout.remaining);
      }

      function _checkForNoResponseAtMax() {
        // If the time with no response has reached its maximum, expire client session
        if (sessionTimeout.remaining <= 0) {
          _expireSession();
        }
      }

      function _checkForWarnOrExpire(doPingFirst) {
        // warn
        if (sessionTimeout.remaining <= sessionTimeout.warnAt && sessionTimeout.remaining > sessionTimeout.expireAt) {
          devlog.channel('iscSessionModel').debug('...WARN ' + sessionTimeout.remaining);
          if (doPingFirst && sessionTimeout.syncedOn != 'warn') {
            callPing('warn').then(function () {
              _checkForWarnOrExpire(false);
            });
          }
          else {
            $rootScope.$emit(AUTH_EVENTS.sessionTimeoutWarning);
          }
        }

        // expire/logout
        else if (sessionTimeout.remaining <= sessionTimeout.expireAt) {
          devlog.channel('iscSessionModel').debug('...TIMEOUT ' + sessionTimeout.remaining);

          if (doPingFirst && sessionTimeout.syncedOn != 'expire') {
            callPing('expire').then(function () {
              _checkForWarnOrExpire(false);
            });
          }
          else {
            _expireSession();
          }
        }
      }

      function _expireSession() {
        $rootScope.$emit(AUTH_EVENTS.sessionTimeout);
        iscSessionStorageHelper.setShowTimedOutAlert(true);
        stopSessionTimeout();
      }
    }

    function stopSessionTimeout() {
      devlog.channel('iscSessionModel').debug('iscSessionModel.stopSessionTimeout');
      if (angular.isDefined(intervalPromise)) {
        devlog.channel('iscSessionModel').debug('...cancelling');
        $interval.cancel(intervalPromise);
        intervalPromise = null;
      }

      devlog.channel('iscSessionModel').debug('...intervalPromise', intervalPromise);
    }

    function resetSessionTimeout() {
      devlog.channel('iscSessionModel').debug('iscSessionModel.resetSessionTimeout');
      // Do not reset timer if we are still waiting on a server response to a ping call
      if (sessionTimeout.syncedOn !== 'no response') {
        var maxAge               = iscSessionStorageHelper.getSessionTimeoutMax();
        sessionTimeout.remaining = maxAge;
        sessionTimeout.syncedOn  = 'alive';
        iscSessionStorageHelper.setSessionTimeoutCounter(maxAge);
      }
    }

    function getRemainingTime() {
      return sessionTimeout.remaining;
    }

    // --------------
    function getCredentials() {
      return credentials;
    }

    // --------------
    function getCurrentUser() {
      return angular.copy(currentUser); // To prevent external modificiation
    }

    function setCurrentUser(user) {
      devlog.channel('iscSessionModel').debug('iscSessionModel.setCurrentUser');
      devlog.channel('iscSessionModel').debug('...user: ' + angular.toJson(user));
      currentUser = angular.copy(user); // To prevent external modificiation
    }

    // --------------
    function getCurrentUserRole() {
      return _.get(currentUser, "userRole");
    }

    // --------------
    function isAuthenticated() {
      //devlog.channel('iscSessionModel').debug('iscSessionModel.isAuthenticated', currentUser);
      // '*' denotes anonymous user (AKA not authenticated)
      return _.get(currentUser, 'userRole', '*') !== '*';
    }

    // --------------
    function getFullName() {
      devlog.channel('iscSessionModel').debug('iscSessionModel.getFullName');
      return !!currentUser ? currentUser.FullName : '';
    }

  }// END CLASS


})();

