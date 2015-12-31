/**
 * Created by douglasgoodman on 11/18/14.
 */

(function () {
  'use strict';

  angular.module('isc.authentication')
    .factory('iscSessionModel', iscSessionModel);

  function iscSessionModel(
    devlog, $rootScope, $interval, iscAuthorization, iscCustomConfigService, iscCustomConfigHelper, iscSessionStorageHelper, AUTH_EVENTS
  ) {
    devlog.channel('iscSessionModel').debug('iscSessionModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var credentials = null;
    var currentUser = null;

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

      initSession      : initSession,
      updateStateByRole: updateStateByRole,

      initSessionTimeout : initSessionTimeout,
      stopSessionTimeout : stopSessionTimeout,
      resetSessionTimeout: resetSessionTimeout,
      getRemainingTime   : getRemainingTime,

      getCredentials: getCredentials,

      getCurrentUser: getCurrentUser,
      setCurrentUser: setCurrentUser,

      getAuthorizedRoutes: iscAuthorization.getAuthorizedRoutes,
      setAuthorizedRoutes: iscAuthorization.setAuthorizedRoutes,

      isAuthorized   : iscAuthorization.isAuthorized,
      isAuthenticated: isAuthenticated,

      getFullName: getFullName
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    function initSession(config) {
      model.setAuthorizedRoutes([]);
      iscCustomConfigService.addStates();
      iscSessionStorageHelper.setConfig(config);

      // update the states based on the user's role, if any
      var currentUser = iscSessionModel.getCurrentUser();
      var userRole    = !!currentUser ? currentUser.userRole : '*';
      model.updateStateByRole(userRole, config);
      model.setAuthorizedRoutes();

    }

    // ----------------------------
    /**
     * adds or removes tabs based on the user's permissions in the configFile.json
     * eg:
     'rolePermissions': {
            '*': ['index'],
            'user':['*'],
            'guest':['index.home','index.library']
       }
     * supports wildcards (eg 'index.home.*')
     * where '*' will allow all tabs
     * NOTE - if you want to include some but not all subtabs,
     *        be sure to also include the parent tab (eg ['index.messages', 'index.messages.subtab1' ])
     *
     * @param role String
     */
    function updateStateByRole(role, config) {
      devlog.channel('iscSessionModel').debug('iscSessionModel.updateStateByRole', role);

      var allStates = iscCustomConfigHelper.getAllStates();
      devlog.channel('iscSessionModel').debug('...allStates', allStates);

      // start by excluding everything
      _.forEach(allStates, function (tab) {
        if (tab) {
          tab.exclude = true;
        }
      });

      if (!config) {
        return;
      }

      var anonymousStates     = angular.copy(config.rolePermissions['*'], []);
      var userPermittedStates = angular.copy(config.rolePermissions[role]);
      var allPermittedStates  = anonymousStates;
      if (!!userPermittedStates) {
        allPermittedStates = anonymousStates.concat(userPermittedStates);
      }
      model.setAuthorizedRoutes(allPermittedStates);
      devlog.channel('iscSessionModel').debug('...allPermittedStates', allPermittedStates);

      if (_.contains(allPermittedStates, '*')) {
        //console.debug( '...adding all' );
        //turn everything on
        _.forEach(allStates, function (state) {
          state.exclude = false;
        });
      }
      else {

        _.forEach(allPermittedStates, function (permittedTab) {
          devlog.channel('iscSessionModel').debug('...permittedTab', permittedTab);

          // handle wildcards
          var starIdx = permittedTab.indexOf('.*');
          if (starIdx > -1) {
            var superState = permittedTab.substr(0, starIdx);
            devlog.channel('iscSessionModel').debug('...superState', superState);

            _.forEach(allStates, function (state) {
              if (state.state.indexOf(superState) > -1) {
                state.exclude = false;
              }
            });
          }
          else {
            devlog.channel('iscSessionModel').debug('...allStates[permittedTab]', allStates[permittedTab]);
            if (allStates[permittedTab]) {
              allStates[permittedTab].exclude = false;
            }
          }
        });
      }

      devlog.channel('iscSessionModel').debug('Finished updating navbar');
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
      currentUser = null;
      credentials = null;

      // remove the user data so that the user
      // WONT stay logged in on page refresh
      iscSessionStorageHelper.destroy();
      stopSessionTimeout();

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
          $rootScope.$broadcast(AUTH_EVENTS.sessionTimeoutWarning);
        }
        else if (sessionTimeoutCounter >= sessionTimeoutInSeconds) {
          devlog.channel('iscSessionModel').debug('...TIMEOUT ' + sessionTimeoutCounter);
          // logout
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
      return currentUser;
    }

    function setCurrentUser(user) {
      devlog.channel('iscSessionModel').debug('iscSessionModel.setCurrentUser');
      devlog.channel('iscSessionModel').debug('...user: ' + angular.toJson(user));
      currentUser = user;
    }

    // --------------
    function isAuthenticated() {
      devlog.channel('iscSessionModel').debug('iscSessionModel.isAuthenticated', currentUser);
      return !_.isEmpty(currentUser);
    }

    // --------------
    function getFullName() {
      devlog.channel('iscSessionModel').debug('iscSessionModel.getFullName');
      return !!currentUser ? currentUser.FullName : '';
    }

  }// END CLASS


})();

