/**
 * Created by douglasgoodman on 11/24/14.
 */

(function () {
  'use strict';

  angular
    .module('isc.states')
    .factory('iscRouterDefaultEventService', iscRouterDefaultEventService);

  function iscRouterDefaultEventService(
    devlog,
    $rootScope,
    iscAuthorizationModel,
    iscSessionModel,
    AUTH_EVENTS,
    NAV_EVENTS
  ) {
    var service = {
      registerDefaultEvents      : registerDefaultEvents,
      registerStateChangeStart   : registerStateChangeStart,
      registerStateChangeSuccess : registerStateChangeSuccess,
      registerStateChangeError   : registerStateChangeError,
      registerStateChangeRejected: registerStateChangeRejected
    };
    return service;

    // ------------------------
    // functions
    // ------------------------
    function registerDefaultEvents() {
      registerStateChangeStart();
      registerStateChangeError();
      registerStateChangeRejected();
      registerStateChangeSuccess();
    }

    function registerStateChangeStart() {
      // ------------------------
      // stateChange start
      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
          devlog.channel('IscRouterDefaultEventService').debug('ischNavContainer.$stateChangeStart');
          devlog.channel('IscRouterDefaultEventService').debug('...from: ' + fromState.name);
          devlog.channel('IscRouterDefaultEventService').debug('.....to: ', toState.name);

          devlog.channel('IscRouterDefaultEventService').debug('State change request received');
          devlog.channel('IscRouterDefaultEventService').debug('Beginning state change from \'%s\' to \'%s\'', _.wrapText(fromState.name), _.wrapText(toState.name));

          handleStateChangeStart(event, toState, toParams, fromState, fromParams);
        });
    }

    function registerStateChangeSuccess() {
      // ------------------------
      // stateChange success
      $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {//jshint ignore:line
          devlog.channel('IscRouterDefaultEventService').debug('ischNavContainer.$stateChangeSuccess', _.wrapText(toState.name));
        });
    }

    function registerStateChangeError() {
      devlog.channel('IscRouterDefaultEventService').debug('registering $stateChangeError');
      // ------------------------
      // stateChange error
      $rootScope.$on('$stateChangeError',
        function (event, toState, toParams, fromState, fromParams, error) {//jshint ignore:line
          devlog.channel('IscRouterDefaultEventService').error('ischNavContainer.$stateChangeError', error);
        });
    }

    function registerStateChangeRejected() {

      devlog.channel('IscRouterDefaultEventService').debug('registering $stateChangeRejected');
      // ------------------------
      // stateChange $stateChangeRejected
      $rootScope.$on('$stateChangeRejected',
        function (event, toState, toParams, fromState, fromParams, error) {//jshint ignore:line
          devlog.channel('IscRouterDefaultEventService').error('ischNavContainer.$stateChangeRejected');
          devlog.channel('IscRouterDefaultEventService').error('.... to state', _.wrapText(toState.state, '=='));
        });
    }

    function handleStateChangeStart(event, toState, toParams, fromState, fromParams) {//jshint ignore:line
      devlog.channel('IscRouterDefaultEventService').debug('iscNavContainer.handleStateChangeStart');

      // get the permissions for this state
      var isAuthorized = iscAuthorizationModel.isAuthorized(toState.name); // either your role is permitted or the state is whitelisted
      var isAuthenticated = iscSessionModel.isAuthenticated(); // you are logged in

      devlog.channel('IscRouterDefaultEventService').debug('...isAuthorized', isAuthorized);
      devlog.channel('IscRouterDefaultEventService').debug('...isAuthenticated', isAuthenticated);

      if (!isAuthorized) {
        devlog.channel('IscRouterDefaultEventService').debug(toState.name + ' is not authorized');
        preventDefault(event, toState.name, {
          source: "iscRouterDefaultEventService.handleStateChangeStart",
          error : "User is not authorized to access " + _.wrapText(toState.name)
        });

        if (!isAuthenticated) {
          devlog.channel('IscRouterDefaultEventService').debug('...not authenticated');
          $rootScope.$emit(NAV_EVENTS.goToBeforeLoginPage);
          $rootScope.$emit(AUTH_EVENTS.notAuthenticated);
        } else {
          devlog.channel('IscRouterDefaultEventService').debug('... logged in, but not authorized');
          $rootScope.$emit(AUTH_EVENTS.notAuthorized);
        }
      }
    }

    function preventDefault(event, toStateName, error) {
      devlog.channel('IscRouterDefaultEventService').debug('...preventDefault to', toStateName);
      devlog.channel('IscRouterDefaultEventService').error('... ' + _.wrapText(toStateName) + ' is unauthorized. ', error);
      event.preventDefault();
    }
  }
})();
