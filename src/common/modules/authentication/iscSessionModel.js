/**
 * Created by douglasgoodman on 11/18/14.
 */

(function () {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------
  angular.module('isc.authentication')
    .factory('iscSessionModel', iscSessionModel);

  ////////////////////////////////
  /* @ngInject */
  function iscSessionModel(devlog, $rootScope, $interval, iscCustomConfigService, iscCustomConfigHelper, iscSessionStorageHelper, AUTH_EVENTS) {
    devlog.channel('iscSessionModel').debug('iscSessionModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var credentials = null;
    var currentUser = null;

    // contains a list of states with restricted permission
    // and what those permissions are
    // anything not forbidden is presumed to be allowed
    //var statePermissions = null;
    var permittedStates;

    var sessionTimeoutInSeconds = 0;
    var sessionTimeoutCounter   = 0;
    var sessionTimeoutWarning   = 0;
    var intervalPromise;

    // dont require login for these views
    var noLoginRequiredList         = ['index', 'index.login'];
    var noLoginRequiredWildcardList = [];

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

      getPermittedStates: getPermittedStates,
      setPermittedStates: setPermittedStates,

      isAuthorized   : isAuthorized,
      isAuthenticated: isAuthenticated,
      isWhiteListed  : isWhiteListed,

      setNoLoginRequiredList: setNoLoginRequiredList,

      getFullName: getFullName
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    function initSession(config) {
      model.setNoLoginRequiredList(config.noLoginRequired);
      model.setPermittedStates([]);
      iscCustomConfigService.addStates();
      iscSessionStorageHelper.setConfig(config);

      // update the states based on the user's role, if any
      var currentUser = iscSessionModel.getCurrentUser();
      var userRole    = !!currentUser ? currentUser.userRole : '';
      model.updateStateByRole(userRole, config);
    }


    // ----------------------------
    /**
     * adds or removes tabs based on the user's permissions in the configFile.json
     * eg:
     'userPermittedTabs': {
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

      var noLoginRequired     = angular.copy(config.noLoginRequired);
      var userPermittedStates = angular.copy(config.userPermittedTabs[role]);
      var allPermittedStates  = noLoginRequired;
      if (!!userPermittedStates) {
        allPermittedStates = noLoginRequired.concat(userPermittedStates);
      }
      model.setPermittedStates(allPermittedStates);
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
    function getPermittedStates() {
      return permittedStates;
    }

    function setPermittedStates(val) {
      permittedStates = val;
    }

    // --------------
    function isAuthenticated() {
      devlog.channel('iscSessionModel').debug('iscSessionModel.isAuthenticated', currentUser);
      return !_.isEmpty(currentUser);
    }

    function isAuthorized(stateName) {
      devlog.channel('iscSessionModel').debug('iscSessionModel.isAuthorized');
      devlog.channel('iscSessionModel').debug('...stateName: ' + stateName);

      // everything permitted
      if (_.contains(permittedStates, '*')) {
        devlog.channel('iscSessionModel').debug('...allowing everything');
        //turn everything on
        return true;
      }

      // otherwise check for wild cards or existence
      var wildCardSuperState = getWildCardStateForState(stateName);
      devlog.channel('iscSessionModel').debug('...wildCardSuperState: ' + wildCardSuperState);

      if (wildCardSuperState) {
        devlog.channel('iscSessionModel').debug('...stateName.indexOf( wildCardSuperState ): ' + stateName.indexOf(wildCardSuperState));
        // weird bug in lodash where if the stateName === wildCardSuperState, _.indexOf returns -1
        // so using this other form for checking
        return stateName.indexOf(wildCardSuperState) > -1;
      }
      else {
        return _.indexOf(permittedStates, stateName) > -1;
      }
    }

    /**
     * private
     * @param {String} stateName
     * @returns {String} wildCardSuperState || undefined
     */
    function getWildCardStateForState(stateName) {
      devlog.channel('iscSessionModel').debug('...getWildCardStateForState, stateName', stateName);

      var wildCardSuperState;
      var stateToCheck;

      _.forEach(permittedStates, function (permittedState) {
        var starIdx = permittedState.indexOf('.*');
        if (starIdx > -1) {
          // got a wildcard
          stateToCheck = permittedState.substr(0, starIdx);
          devlog.channel('iscSessionModel').debug('...stateToCheck: ' + stateToCheck);
          if (stateName.indexOf(stateToCheck) > -1 || stateName === stateToCheck) {
            devlog.channel('iscSessionModel').debug('...gotcha');
            wildCardSuperState = stateToCheck;
          }
        }
      });

      return wildCardSuperState;
    }

    /**
     * Returns whether a state is whitelisted
     * Also accepts wildcards in the form of 'index.stateName.*'
     * NOTE: for wildcards, the wildcard is assumed to be the last state and 'index' the first state
     * ie 'index.*.stateName' will fail
     *
     * @param {string} stateName
     * @returns {boolean}
     */
    function isWhiteListed(stateName) {
      devlog.channel('iscSessionModel').debug('iscSessionModel.isWhiteListed');
      devlog.channel('iscSessionModel').debug('...noLoginRequiredList: ' + JSON.stringify(noLoginRequiredList));
      devlog.channel('iscSessionModel').debug('...stateName: ' + stateName);

      var whitelisted = false;

      if (_.indexOf(noLoginRequiredList, stateName) !== -1) {
        whitelisted = true;
      }
      else {
        // create a map of values that shows
        // whether the stateName matches anything in the wildcard list
        var map = _.map(noLoginRequiredWildcardList, function (state) {
          return _.contains(stateName, state);
        });

        // is anything in the map true?
        whitelisted = _.some(map);
      }

      devlog.channel('iscSessionModel').debug('...whitelisted: ' + whitelisted);
      return whitelisted;
    }

    // --------------
    function setNoLoginRequiredList(val) {
      devlog.channel('iscSessionModel').debug('iscSessionModel.setNoLoginRequiredList: ' + JSON.stringify(val));

      // reset the lists
      noLoginRequiredList         = [];
      noLoginRequiredWildcardList = [];

      // then populate wildcard states and non-wildcard states
      _.forEach(val, function (state) {
        if (state.indexOf('.*') !== -1) {
          noLoginRequiredWildcardList.push(state.slice(0, -2));
        }
        else {
          noLoginRequiredList.push(state);
        }
      });

      devlog.channel('iscSessionModel').debug('...noLoginRequiredList: ' + JSON.stringify(noLoginRequiredList));
      devlog.channel('iscSessionModel').debug('...noLoginRequiredWildcardList: ' + JSON.stringify(noLoginRequiredWildcardList));
    }

    // --------------
    function getFullName() {
      devlog.channel('iscSessionModel').debug('iscSessionModel.getFullName');
      return !!currentUser ? currentUser.FullName : '';
    }


  }// END CLASS


})();

