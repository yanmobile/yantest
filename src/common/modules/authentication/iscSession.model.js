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

    var sessionTimeoutInSeconds = 0;
    var sessionTimeoutCounter   = 0;
    var sessionTimeoutWarning   = 0;
    var intervalPromise;

    // ----------------------------
    // class factory
    // ----------------------------

    var model = {
      create : create,
      destroy: destroy,

      initSession: initSession,

      initSessionTimeout : initSessionTimeout,
      stopSessionTimeout : stopSessionTimeout,
      resetSessionTimeout: resetSessionTimeout,
      getRemainingTime   : getRemainingTime,

      getCredentials: getCredentials,

      getCurrentUser    : getCurrentUser,
      getCurrentUserRole: getCurrentUserRole,

      isAuthenticated: isAuthenticated,
      getFullName: getFullName
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    function initSession(config) {
      iscSessionStorageHelper.setConfig(config);
    }

    function create(sessionData, isSessionNew) {
      devlog.channel('iscSessionModel').debug('iscSessionModel.create');
      // $log.debug( '...sessionData: ' + JSON.stringify( sessionData  ));

      // store the login response for page refreshes
      iscSessionStorageHelper.setLoginResponse(sessionData);

      credentials = {}; // for now we arent using credentials
      setCurrentUser(sessionData.UserData);

      // set the timeout
      //sessionTimeoutInSeconds = 10; // DEV ONLY
      sessionTimeoutInSeconds = sessionData.SessionTimeout;

      $rootScope.$emit(AUTH_EVENTS.sessionChange);
      if (isSessionNew) {
        devlog.channel('iscSessionModel').debug('...new ');
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      }
      else {
        // $log.debug( '...resumed ' );
        $rootScope.$broadcast(AUTH_EVENTS.sessionResumedSuccess);
      }
    }

    function destroy() {
      devlog.channel('iscSessionModel').debug('iscSessionModel.destroy');

      // create a session with null data
      currentUser = anonymousUser;
      credentials = null;

      // remove the user data so that the user
      // WONT stay logged in on page refresh
      iscSessionStorageHelper.destroy();
      stopSessionTimeout();

      $rootScope.$emit(AUTH_EVENTS.sessionChange);
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    }

    // --------------
    function initSessionTimeout(timeoutCounter) {
      devlog.channel('iscSessionModel').debug('iscSessionModel.initSessionTimeout');
      devlog.channel('iscSessionModel').debug('...timeoutCounter: ' + timeoutCounter);

      // on page refresh we get this from sessionStorage and pass it in
      // otherwise assume it to be 0
      sessionTimeoutCounter = (timeoutCounter > 0) ? timeoutCounter : 0;
      devlog.channel('iscSessionModel').debug('...sessionTimeoutCounter: ' + sessionTimeoutCounter);
      devlog.channel('iscSessionModel').debug('...sessionTimeoutInSeconds: ' + sessionTimeoutInSeconds);

      sessionTimeoutWarning = parseInt(sessionTimeoutInSeconds * 0.75);
      devlog.channel('iscSessionModel').debug('...sessionTimeoutWarning: ' + sessionTimeoutWarning);

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

      intervalPromise = $interval(function () {
        sessionTimeoutCounter++;

        iscSessionStorageHelper.setSessionTimeoutCounter(sessionTimeoutCounter);
        devlog.channel('iscSessionModel').debug('...TICK ');
        devlog.channel('iscSessionModel').debug('...sessionTimeoutInSeconds ' + sessionTimeoutInSeconds);
        devlog.channel('iscSessionModel').debug('...sessionTimeoutCounter ' + sessionTimeoutCounter);
        devlog.channel('iscSessionModel').debug('...sessionTimeoutWarning ' + sessionTimeoutWarning);
        devlog.channel('iscSessionModel').debug('...remainingTime ' + getRemainingTime());

        if (sessionTimeoutCounter >= sessionTimeoutWarning && sessionTimeoutCounter < sessionTimeoutInSeconds) {
          // warn
          devlog.channel('iscSessionModel').debug('...WARN ' + sessionTimeoutCounter);
            callPing('warn').then(function () { _checkForWarnOrExpire(false); });
              _checkForWarnOrExpire(false);
            });
          $rootScope.$broadcast(AUTH_EVENTS.sessionTimeoutWarning);
        }
        else if (sessionTimeoutCounter >= sessionTimeoutInSeconds) {
          devlog.channel('iscSessionModel').debug('...TIMEOUT ' + sessionTimeoutCounter);
          // logout
            callPing('expire').then(function () { _checkForWarnOrExpire(false); });
              _checkForWarnOrExpire(false);
            });
          $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout);
          iscSessionStorageHelper.setShowTimedOutAlert(true);
          stopSessionTimeout();
        }
      }, 1000);
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
      if (sessionTimeout.syncedOn != 'no response') {
      sessionTimeoutCounter = 0;
      iscSessionStorageHelper.setSessionTimeoutCounter(sessionTimeoutCounter);
      //stopSessionTimeout();
      //doSessionTimeout();
    }

    function getRemainingTime() {
      var remaining = sessionTimeoutInSeconds - sessionTimeoutCounter;
      return remaining;
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

