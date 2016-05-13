/**
 * Created by hzou on 12/8/15.
 */

( function () {
  'use strict';
  angular
    .module( 'app', [
      'routes',
      'isc.components',
      'isc.socket',
      'isc.templates'
    ] )
    .config( config )
    .run( run );

  function config(
    $translateProvider, $httpProvider, $compileProvider,
    devlogProvider, iscCustomConfigServiceProvider,
    coreConfig, componentsConfig, appConfig
  ) {
    _.defaults( appConfig, componentsConfig, coreConfig );

    iscCustomConfigServiceProvider.loadConfig( appConfig );
    devlogProvider.loadConfig( appConfig );

    $httpProvider.interceptors.push( 'iscAuthenticationInterceptor' );
    $httpProvider.interceptors.push( 'iscLoggingInterceptor' );

    $translateProvider.useStaticFilesLoader( {
      prefix: 'assets/i18n/',
      suffix: '.json'
    } );

    $translateProvider.preferredLanguage( 'en_US' );
    $httpProvider.defaults.withCredentials = true;

    if ( appConfig.production ) {
      $compileProvider.debugInfoEnabled( false );
    }
  }

  function run(
    devlog, iscNavContainerModel, $rootScope, $state, iscConfirmationService, iscSessionModel, AUTH_EVENTS,
    loginApi, iscRouterDefaultEventService, appConfig, iscExternalRouteApi, iscStateInit, iscVersionApi, $window
  ) {
    var log = devlog.channel( 'app.module' );

    //register default state event handlers
    iscRouterDefaultEventService.registerDefaultEvents();

    // Configure session persistence
    iscSessionModel.configure( {
      'ping'             : loginApi.ping,
      'sessionIdPath'    : 'sessionInfo.id',
      'expirationPath'   : 'sessionInfo.expiresOn',
      'noResponseMaxAge' : 150
    } );

    iscStateInit.config( {
      'initFunctions': {
        'versionInfo'    : iscVersionApi.load //grab version info for the footer
      }
    } );

    // ------------------------
    // $viewContentLoaded
    $rootScope.$on( '$viewContentLoaded',
      function ( event, toState, toParams, fromState, fromParams ) {
        log.debug( 'AUTH_EVENTS.$viewContentLoaded...' );
        angular.element( '[ui-view]' ).parent().scrollTop( 0 );
      }
    );

    // ------------------------
    // loginSuccess event - after logging in with a new session
    $rootScope.$on( AUTH_EVENTS.loginSuccess, function () {
      // Handle initial state routing
      var initialState = iscExternalRouteApi.getNextState();
      if ( initialState ) {
        $state.go( initialState.nextState, initialState.stateParams );
      }
    } );

    // ------------------------
    // sessionTimeoutConfirm event - when you click 'Log out' on the dialog
    $rootScope.$on( AUTH_EVENTS.sessionTimeoutConfirm, function () {
      log.debug( 'AUTH_EVENTS.sessionTimeoutConfirm...' );
      iscSessionModel.destroy();
    } );

    $rootScope.$on( AUTH_EVENTS.notAuthenticated, function () {
      log.debug( 'AUTH_EVENTS.notAuthenticated...' );
      $state.go( 'unauthenticated.login' );
    } );

    // ----------------------
    // session logout
    $rootScope.$on( AUTH_EVENTS.logout, function () {
      log.debug( 'AUTH_EVENTS.logout...' );
      loginApi.logout().then( iscSessionModel.destroy );
    } );

    // ------------------------
    // sessionTimeoutWarning event - issued when session timeout hits warnThreshold
    $rootScope.$on( AUTH_EVENTS.sessionTimeoutWarning, function () {
      log.debug( 'AUTH_EVENTS.sessionTimeoutWarning...' );
      iscConfirmationService
        .show( 'Session is about to expire. Continue working?' )
        .then( _onYes, _onNo );

      function _onYes() {
        iscSessionModel.resetSessionTimeout();
      }

      function _onNo() {
        iscSessionModel.destroy();
      }
    } );

    // ------------------------
    // sessionTimeout event
    $rootScope.$on( AUTH_EVENTS.sessionTimeout, function () {
      log.debug( 'AUTH_EVENTS.sessionTimeout...' );
      var state  = $state.current,
          params = $state.params;
      iscExternalRouteApi.persistCurrentState( state, params, appConfig.session.routeMemoryExpirationInMinutes );
      iscConfirmationService.hide();
      iscSessionModel.destroy();
    } );

    // ------------------------
    // login failed
    $rootScope.$on( AUTH_EVENTS.loginFailed, function loginFailedHandler() {
      $window.alert( 'Temporarily: login failed. please use {bchilds:test} OR {cperkins:test}' );
    } );

    $rootScope.$on( AUTH_EVENTS.sessionTimeoutReset, function resetTimeout() {
      log.debug( 'AUTH_EVENTS.sessionTimeoutReset...' );
      iscSessionModel.resetSessionTimeout();
    } );

    // ------------------------
    // user session changed
    $rootScope.$on( 'iscSessionChange', function () {
      log.debug( 'iscNavbarController.iscSessionChange..' );
      _.defer( iscNavContainerModel.navigateToUserLandingPage, 0 );
    } );
  }

} )();
