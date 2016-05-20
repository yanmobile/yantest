/**
 * Created by hzou on 12/8/15.
 */

( function() {
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

  function config( $translateProvider, $httpProvider, $compileProvider,
    devlogProvider, iscCustomConfigServiceProvider,
    coreConfig, componentsConfig, appConfig ) {
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

  function run( devlog, iscNavContainerModel, $rootScope, $state, iscConfirmationService, iscSessionModel, AUTH_EVENTS,
    loginApi, iscRouterDefaultEventService, appConfig, iscExternalRouteApi, iscStateInit, iscVersionApi, $window, $timeout,
    iscCustomConfigService, FoundationApi ) {
    var log = devlog.channel( 'app.module' );

    //register default state event handlers
    iscRouterDefaultEventService.registerDefaultEvents();

    // Configure session persistence
    iscSessionModel.configure( {
      'ping'            : loginApi.ping,
      'sessionIdPath'   : 'sessionInfo.id',
      'expirationPath'  : 'sessionInfo.expiresOn',
      'noResponseMaxAge': 150
    } );

    iscStateInit.config( {
      'initFunctions': {
        'versionInfo': iscVersionApi.load //grab version info for the footer
      }
    } );

    var isAutoLogOut   = $window.sessionStorage.getItem( 'isAutoLogOut' );
    var isManualLogOut = $window.sessionStorage.getItem( 'isManualLogOut' );
    if ( !Boolean( isManualLogOut ) && Boolean( isAutoLogOut ) ) {
      $timeout( function() {
        FoundationApi.publish( 'main-notifications', { title: 'Session Expired', content: 'You were automatically logged out.' } );
      } );
    }
    $window.sessionStorage.removeItem( 'isAutoLogOut' );
    $window.sessionStorage.removeItem( 'isManualLogOut' );

    // ------------------------
    // $viewContentLoaded
    $rootScope.$on( '$viewContentLoaded',
      function( event, toState, toParams, fromState, fromParams ) {
        log.debug( 'AUTH_EVENTS.$viewContentLoaded...' );
        angular.element( '[ui-view]' ).parent().scrollTop( 0 );
      } );

    // ------------------------
    // destroy session when the route resolve is rejected because of user's notAuthenticated
    $rootScope.$on( '$stateChangeRejected', function( event, toState, toParams, fromState, fromParams, error ) {//jshint ignore:line
      log.debug( '$stateChangeRejected...' );

      if ( error.code === AUTH_EVENTS.notAuthenticated ) {
        destroySession();
      }
    } );

    // ------------------------
    // loginSuccess event - after logging in with a new session
    $rootScope.$on( AUTH_EVENTS.loginSuccess, function() {
      log.debug( 'AUTH_EVENTS.loginSuccess...' );
      // Handle initial state routing
      var initialState = iscExternalRouteApi.getNextState();
      if ( initialState ) {
        $state.go( initialState.nextState, initialState.stateParams );
      }
    } );

    // ------------------------
    // sessionTimeoutConfirm event - when you click 'Log out' on the dialog
    $rootScope.$on( AUTH_EVENTS.sessionTimeoutConfirm, function() {
      log.debug( 'AUTH_EVENTS.sessionTimeoutConfirm...' );
      iscSessionModel.destroy();
    } );

    $rootScope.$on( AUTH_EVENTS.notAuthenticated, function() {
      log.debug( 'AUTH_EVENTS.notAuthenticated...' );
      loginApi
        .logout()
        .finally( destroySession );
    } );

    // ----------------------
    // session logout
    $rootScope.$on( AUTH_EVENTS.logout, function() {
      log.debug( 'AUTH_EVENTS.logout...' );
      $window.sessionStorage.setItem( 'isManualLogOut', true );
      loginApi.logout().then( destroySession );
    } );

    // ------------------------
    // sessionTimeoutWarning event - issued when session timeout hits warnThreshold
    $rootScope.$on( AUTH_EVENTS.sessionTimeoutWarning, function() {
      log.debug( 'AUTH_EVENTS.sessionTimeoutWarning...' );
      iscConfirmationService
        .show( 'Session is about to expire. Continue working?' )
        .then( _onYes, _onNo );

      function _onYes() {
        log.debug( '_onYes...' );
        iscSessionModel.resetSessionTimeout();
      }

      function _onNo() {
        log.debug( '_onNo...' );
        $window.sessionStorage.setItem( 'isManualLogOut', true );
        destroySession();
      }
    } );

    // ------------------------
    // sessionTimeout event
    $rootScope.$on( AUTH_EVENTS.sessionTimeout, function() {
      log.debug( 'AUTH_EVENTS.sessionTimeout...' );
      var state  = $state.current,
          params = $state.params;
      iscExternalRouteApi.persistCurrentState( state, params, appConfig.session.routeMemoryExpirationInMinutes );
      iscConfirmationService.hide();
      destroySession();
    } );

    // ------------------------
    // login failed
    $rootScope.$on( AUTH_EVENTS.loginFailed, function loginFailedHandler() {
      FoundationApi.publish( 'main-notifications', { title: 'Login Failed', content: 'Please check your username and password and try again' } );
    } );

    $rootScope.$on( AUTH_EVENTS.sessionTimeoutReset, function resetTimeout() {
      log.debug( 'AUTH_EVENTS.sessionTimeoutReset...' );
      iscSessionModel.resetSessionTimeout();
    } );

    // ------------------------
    // user session changed
    $rootScope.$on( AUTH_EVENTS.sessionChange, function() {
      log.debug( 'AUTH_EVENTS.sessionChange..' );
      _.defer( iscNavContainerModel.navigateToUserLandingPage, 0 );
    } );

    /**
     * @description     destroys the session and takes the user to the landing page
     */
    function destroySession() {
      log.debug( 'destroySession..' );
      iscSessionModel.destroy();
      _.defer( iscNavContainerModel.navigateToUserLandingPage, 0 );

    }
  }

} )();
