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
    APP_EVENTS,
    NAV_EVENTS
  ) {
    var service = {
      registerDefaultEvents     : registerDefaultEvents,
      registerAppLoadEvent      : registerAppLoadEvent,
      registerStateChangeStart  : registerStateChangeStart,
      registerStateChangeSuccess: registerStateChangeSuccess

    };
    return service;

    function registerDefaultEvents() {
      registerAppLoadEvent();
      registerStateChangeStart();
      registerStateChangeError();
      registerStateChangeRejected();
      registerStateChangeSuccess();
    }

    function registerAppLoadEvent() {

      // ------------------------
      // all the .run() functions have been called
      // this is dispached from app.run() - so be sure to add it there
      $rootScope.$on(APP_EVENTS.appLoaded, function () {
        loadDataFromStoredSession();
      });
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
      //var stateIsExcluded = iscCustomConfigHelper.stateIsExcluded(toState.name);
      //
      //if (stateIsExcluded) {
      //  devlog.channel('IscRouterDefaultEventService').warn('...excluded state');
      //  // even if you are authorized and logged in, don't navigate to excluded states
      //  // this prevents navigation to excluded pages via entering the uri directly in the browser
      //  preventDefault(event);
      //}
      //else if (toState.name === fromState.name) {
      //  devlog.channel('IscRouterDefaultEventService').debug('...double tap');
      //  // no double taps
      //  preventDefault(event);
      //}

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
          $rootScope.$broadcast(NAV_EVENTS.goToBeforeLoginPage);
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
        else {
          devlog.channel('IscRouterDefaultEventService').debug('... logged in, but not authorized');
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);

          if (!fromState || !fromState.name) {
            devlog.channel('IscRouterDefaultEventService').debug('... going home');
            // edge case where your permissions changed underneath you
            // and you refreshed the page
            $rootScope.$broadcast(NAV_EVENTS.goToBeforeLoginPage);
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
