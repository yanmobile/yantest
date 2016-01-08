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
    $state,
    iscSessionModel,
    iscCustomConfigService,
    iscSessionStorageHelper,
    AUTH_EVENTS,
    NAV_EVENTS
  ) {
    var service = {
      loadDataFromStoredSession : loadDataFromStoredSession,
      registerDefaultEvents     : registerDefaultEvents,
      registerStateChangeStart  : registerStateChangeStart,
      registerStateChangeSuccess: registerStateChangeSuccess

    };
    return service;

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
          devlog.channel('IscRouterDefaultEventService').debug('Beginning state change from \'%s\' to \'%s\'', fromState.name, toState.name);

          handleStateChangeStart(event, toState, toParams, fromState, fromParams);
        });
    }

    function registerStateChangeSuccess() {


      // ------------------------
      // stateChange success
      $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {//jshint ignore:line
          devlog.channel('IscRouterDefaultEventService').debug('ischNavContainer.$stateChangeSuccess');
        });
    }

    function registerStateChangeError() {

      devlog.channel('IscRouterDefaultEventService').debug('registering $stateChangeError');
      // ------------------------
      // stateChange error
      $rootScope.$on('$stateChangeError',
        function (event, toState, toParams, fromState, fromParams, error) {//jshint ignore:line
          devlog.channel('IscRouterDefaultEventService').error('ischNavContainer.$stateChangeError');
        });
    }

    function registerStateChangeRejected() {

      devlog.channel('IscRouterDefaultEventService').debug('registering $stateChangeRejected');
      // ------------------------
      // stateChange $stateChangeRejected
      $rootScope.$on('$stateChangeRejected',
        function (event, toState, toParams, fromState, fromParams, error) {//jshint ignore:line
          devlog.channel('IscRouterDefaultEventService').error('ischNavContainer.$stateChangeRejected');
          devlog.channel('IscRouterDefaultEventService').error('.... to state', toState);
        });
    }

    // ------------------------
    // functions
    // ------------------------

    function handleStateChangeStart(event, toState, toParams, fromState, fromParams) {//jshint ignore:line
      devlog.channel('IscRouterDefaultEventService').debug('iscNavContainer.handleStateChangeStart');

      // get the permissions for this state
      var isAuthorized = iscSessionModel.isAuthorized(toState.name); // either your role is permitted or the state is whitelisted
      var isAuthenticated = iscSessionModel.isAuthenticated(); // you are logged in

      devlog.channel('IscRouterDefaultEventService').debug('...isAuthorized', isAuthorized);
      devlog.channel('IscRouterDefaultEventService').debug('...isAuthenticated', isAuthenticated);

      if (!isAuthorized) {
        devlog.channel('IscRouterDefaultEventService').debug(toState.name + ' is not authorized');

        if (!isAuthenticated) {
          devlog.channel('IscRouterDefaultEventService').debug('...not authenticated');

          preventDefault(event, toState.name);
          //$state.go( DEFAULT_PAGES.beforeLogin );
          $rootScope.$emit(NAV_EVENTS.goToBeforeLoginPage);
          $rootScope.$emit(AUTH_EVENTS.notAuthenticated);
        }
        else {
          devlog.channel('IscRouterDefaultEventService').debug('... logged in, but not authorized');
          $rootScope.$emit(AUTH_EVENTS.notAuthorized);

          if (!fromState || !fromState.name) {
            devlog.channel('IscRouterDefaultEventService').debug('... going home');
            // edge case where your permissions changed underneath you
            // and you refreshed the page
            $rootScope.$emit(NAV_EVENTS.goToBeforeLoginPage);
          }
          else {
            devlog.channel('IscRouterDefaultEventService').debug('... going to ', fromState.name);
            $state.go(fromState.name);
          }
        }
      }
    }

    function preventDefault(event, toStateName) {
      devlog.channel('IscRouterDefaultEventService').debug('...preventDefault to', toStateName);
      event.preventDefault();
    }

    function loadDataFromStoredSession() {
      devlog.channel('IscRouterDefaultEventService').debug('iscNavContainer.loadDataFromStoredSession');

      var storedConfig = iscSessionStorageHelper.getConfig();
      if (storedConfig && !_.isEmpty(storedConfig)) {
        devlog.channel('IscRouterDefaultEventService').debug('...got storedConfig: ', storedConfig);
        iscCustomConfigService.initSession(storedConfig);
      }

      // NOTE - set the login response and create the session BEFORE calling initSessionTimeout
      // since the warning for sessionTimeout time is predicate on setting the sessionTimeout time first
      var storedLoginResponse = iscSessionStorageHelper.getLoginResponse();
      if (!_.isEmpty(storedLoginResponse)) {
        devlog.channel('IscRouterDefaultEventService').debug('...got storedLoginResponse: ', storedLoginResponse);
        iscSessionModel.create(storedLoginResponse, false);
      }

      var timeoutCounter = iscSessionStorageHelper.getSessionTimeoutCounter();
      devlog.channel('IscRouterDefaultEventService').debug('...got a counter: ', timeoutCounter);
      if (timeoutCounter > 0) {
        devlog.channel('IscRouterDefaultEventService').debug('...got a counter: ' + timeoutCounter);
        iscSessionModel.initSessionTimeout(timeoutCounter);
      }
    }
  }
})();
