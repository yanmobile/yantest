/**
 * Created by hzou on 12/30/15.
 */

(function () {

  'use strict';

  angular
    .module('isc.authentication')
    .factory('iscAuthorization', iscAuthorization);

  function iscAuthorization() {

    var authorizedStates = {};

    var service = {
      getAuthorizedRoutes: getAuthorizedRoutes,
      setAuthorizedRoutes: setAuthorizedRoutes,
      isAuthorized       : isAuthorized
    };
    return service;


    function isAuthorized(stateToCheck) {
      authorizedStates = authorizedStates || [];
      stateToCheck     = stateToCheck || '';

      var isPermitted;
      if (isBlackListed(stateToCheck, authorizedStates)) {
        isPermitted = false;
      } else {
        isPermitted = isWhiteListed(stateToCheck, authorizedStates);
      }

      return !!isPermitted;
    }

    /**
     * This function takes an array of permitted states.
     * and maps it to a nested object representation for fast checking
     *
     * For Example:
     * Input: ["index", "index.home", "index.patient.*", "!index.patient.admin"]
     * Output:  { "!index": { patient: { admin: {} } }, index: { home: {}, patient: { "*": {} } } }
     *
     * NOTE: states beginning with "!" denotes they are black listed.
     * @param permittedStates
     * @returns {{}}
     */
    function setAuthorizedRoutes(permittedStates) {
      permittedStates = permittedStates || [];

      permittedStates.forEach(function (state) {
        if (!_.get(authorizedStates, state)) {
          _.set(authorizedStates, state, {});
        }
      });

      return authorizedStates;
    }

    function getAuthorizedRoutes() {
      return authorizedStates;
    }

    //** private functions **//
    function isBlackListed(stateToCheck) {
      var blacklisted = authorizedStates['!*'] || _.get(authorizedStates, '!' + stateToCheck, false);
      return blacklisted || hasWildCardMatch(stateToCheck, true);
    }

    function isWhiteListed(stateToCheck) {
      var blacklisted = authorizedStates['*'] || _.get(authorizedStates, stateToCheck, false);
      return blacklisted || hasWildCardMatch(stateToCheck, false);
    }

    /**
     *
     * This function will take a ui.router state (in the format 'index.xxx.yyy.zzz') and
     * checks against a list of white/black listed items (including wild cards).
     * For each of the state parts ["index", "xxx", "yyy", "zzz"], it will build a wild card string
     * to check against the authorizedStates. Example:
     *
     * FOR WHITE LIST
     * 1] "index.*"
     * 2] "index.xxx.*",
     * 3] "index.xxx.yyy.*",
     * 4] "index.xxx.yyy.zzz.*"
     *
     * FOR BLACK LIST
     * 1] "!index.*"
     * 2] "!index.xxx.*",
     * 3] "!index.xxx.yyy.*",
     * 4] "!index.xxx.yyy.zzz.*"
     *
     * @param stateToCheck -- the state to navigate to
     * @param authorizedStates -- the master list of all permitted states
     * @param checkBlacklisted -- indicate whether this is to check against black list or white list
     * @returns {boolean} -- indicates if there's matching found
     */
    function hasWildCardMatch(stateToCheck, checkBlacklisted) {

      var tokens = stateToCheck.split('.');
      var path   = checkBlacklisted ? '!' : '';

      return _.any(tokens, function (token) {
        path += token + '.';
        return _.get(authorizedStates, path + '*', false);
      });
    }

  }// END CLASS

})();
