/**
 * Created by douglasgoodman on 11/24/14.
 */

(function(){
  'use strict';

  angular.module('iscNavContainer', ['ui.router'])

    .constant('AUTH_EVENTS', {
      loginError: 'iscLoginError',
      loginSuccess: 'iscLoginSuccess',
      loginFailed: 'iscLoginFailed',
      logoutSuccess: 'iscLogoutSuccess',
      notAuthenticated: 'iscNotAuthenticated',
      notAuthorized: 'iscNotAuthorized',
      openSortOptions: 'iscOpenSortOptions',
      responseError: 'iscResponseError',
      sessionTimeout: 'iscSessionTimeout',
      sessionTimeoutConfirm: 'iscSessionTimeoutConfirm',
      sessionTimeoutWarning: 'iscSessionTimeoutWarning',
      sessionTimeoutReset: 'iscSessionTimeoutReset'
    })

    .constant('NAV_EVENTS', {
      showSecondaryNav: 'iscShowSecondaryNav',
      hideSecondaryNav: 'iscHideSecondaryNav'
    })

    .config( ['$stateProvider', '$urlRouterProvider',
      function( $stateProvider, $urlRouterProvider ){

        //  NOTE that each page configures its own states
        // this just ensures that the first url loaded is "home"
        $urlRouterProvider.otherwise('/home');
        $urlRouterProvider.when( '', '/home');
        $urlRouterProvider.when('/', '/home');

        // ----------------------------
        // state management
        // ----------------------------
        $stateProvider
          .state('index', {
            abstract: true,
            url: '/',

            views: {
              '@': {
                //templateUrl: 'navContainer/iscNavContainer.html',
                templateUrl: 'common/navContainer/iscNavContainer.html',
                controller: 'iscNavigationController as navCtrl'
              }
            },

            resolve: {
              loadConfig: function(  $log, iscCustomConfigService ){
                //$log.debug( 'iscNavContainer.loadConfig');
                return iscCustomConfigService.loadConfig();
              }
            }
          });

//        TODO use this for deploy, but re-write the urls on the server
//        $locationProvider.html5Mode(true);

      }])

    .run( ['$log', '$rootScope', '$state', '$window', 'iscProgressLoader','iscSessionModel', 'iscCustomConfigService', 'iscCustomConfigHelper', 'iscUserRoleHelper' ,'iscSessionStorageHelper', 'AUTH_EVENTS',
      function( $log, $rootScope, $state, $window, iscProgressLoader, iscSessionModel, iscCustomConfigService, iscCustomConfigHelper, iscUserRoleHelper, iscSessionStorageHelper, AUTH_EVENTS ){
        //$log.debug( 'iscNavContainer.run' );

        loadDataFromStoredSession();

        // ------------------------
        // stateChange start
        $rootScope.$on('$stateChangeStart',
          function( event, toState, toParams, fromState, fromParams ){
            //$log.debug( 'ischNavContainer.$stateChangeStart');
            //$log.debug( '...from: ' + fromState.name );
            //$log.debug( '.....to: ' + toState.name );

            iscCustomConfigService.loadConfig().then( function( config ){
              startLoadingAnimation();
              handleStateChangeStart( event, toState, toParams, fromState, fromParams  );
            });
          });

        // ------------------------
        // stateChange success
        $rootScope.$on('$stateChangeSuccess',
          function( event, toState, toParams, fromState, fromParams ){
              //$log.debug( 'ischNavContainer.$stateChangeSuccess');

            // end loading animation
            iscProgressLoader.end();
          });

        // ------------------------
        // login success event
        $rootScope.$on( AUTH_EVENTS.loginSuccess, function(){
          //$log.debug( 'ischNavContainer.AUTH_EVENTS.loginSuccess');
          $state.go( 'index.home' );
        });

        // ------------------------
        // logout success event
        $rootScope.$on( AUTH_EVENTS.logoutSuccess, function(){
          //$log.debug( 'ischNavContainer.AUTH_EVENTS.logoutSuccess');
          $state.go( 'index.login' );
        });

        // ------------------------
        // sessionTimeout event
        $rootScope.$on( AUTH_EVENTS.sessionTimeout, function(){
          //$log.debug( 'ischNavContainer.AUTH_EVENTS.sessionTimeout');
          $state.go( 'index.login' );
        });

        // ------------------------
        // functions
        // ------------------------
        function startLoadingAnimation(){
          iscProgressLoader.start();
          iscProgressLoader.set(50);
        }

        function handleStateChangeStart( event, toState, toParams, fromState, fromParams ){
          //$log.debug( 'ischNavContainer.handleStateChangeStart');

          // get the permissions for this state
          var isAuthorized = iscSessionModel.isAuthorized( toState.name );
          var isAuthenticated = iscSessionModel.isAuthenticated();
          var isWhiteListed = iscSessionModel.isWhiteListed( toState.name );
          var stateIsExcluded = iscCustomConfigHelper.stateIsExcluded( toState.name );

          if( !isAuthorized ){
            //$log.debug( '...not authorized');
            if( !isWhiteListed ){
              //$log.debug( '...not whitelisted');
              preventDefault( event );

              if( isAuthenticated ){
                //$log.debug( '... going either to home or your previous state');
                // see iscNavigationController for the popup listeners for these events
                $rootScope.$broadcast( AUTH_EVENTS.notAuthorized );
                if( !fromState || !fromState.name ){
                  //$log.debug( '... going home');
                  // edge case where your permissions changed underneath you
                  // and you refreshed the page - assumes the Home state is always permitted
                  $state.go( 'index.home' );
                }
                else{
                  //$log.debug( '... going to ',fromState.name );
                  $state.go( fromState.name );
                }
              }
              else{
                //$log.debug( '...going to login');
                // if you arent logged in yet, bring the user to the log in page
                $state.go( 'index.login' );
                // op cit
                $rootScope.$broadcast( AUTH_EVENTS.notAuthenticated );
              }
            }
          }

          if( stateIsExcluded ){
            //$log.debug( '...excluded state');
            // even if you are authorized and logged in, don't navigate to excluded states
            // this prevents navigation to excluded pages via entering the uri directly in the browser
            preventDefault( event );
          }
          else if( toState.name === fromState.name ){
            //$log.debug( '...double tap');
            // no double taps
            preventDefault( event );
          }
        }

        function preventDefault( event ){
          iscProgressLoader.end();
          event.preventDefault();
        }

        function loadDataFromStoredSession(){
          //$log.debug( 'ischNavContainer.loadDataFromStoredSession');

          var storedLoginResponse = iscSessionStorageHelper.getLoginResponse();
          if( !_.isEmpty( storedLoginResponse )){
            //$log.debug( '...got storedLoginResponse: ' + JSON.stringify( storedLoginResponse ));
            iscSessionModel.create( storedLoginResponse );

            var currentUser = iscSessionModel.getCurrentUser();
            iscUserRoleHelper.setRoleForUser( currentUser );
          }

          var storedStatePermissions = iscSessionStorageHelper.getStoredStatePermissions();
          if( !_.isEmpty( storedStatePermissions )){
            //$log.debug( '...got permissions: ' + JSON.stringify( storedStatePermissions ));
            iscSessionModel.setStatePermissions( storedStatePermissions );
          }

          var timeoutCounter = iscSessionStorageHelper.getSessionTimeoutCounter();
          if( timeoutCounter > 0 ){
            //$log.debug( '...got a counter: ' + timeoutCounter );
            iscSessionModel.initSessionTimeout( timeoutCounter );
          }
        }

      }]);
})();
