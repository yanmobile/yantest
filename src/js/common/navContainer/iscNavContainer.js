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

    .constant('DROPDOWN_EVENTS', {
      dropdownShow: 'DROPDOWN_SHOW',
      showDropdownList: 'SHOW_DROPDOWN_LIST',
      dropdownItemSelected: 'DROPDOWN_ITEM_SELECTED'
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

    .run( ['$log', '$rootScope', '$state', '$window', 'iscProgressLoader','iscSessionModel', 'iscCustomConfigService', 'iscCustomConfigHelper','iscSessionStorageHelper', 'iscAuthenticationApi', 'AUTH_EVENTS',
      function( $log, $rootScope, $state, $window, iscProgressLoader, iscSessionModel, iscCustomConfigService, iscCustomConfigHelper, iscSessionStorageHelper, iscAuthenticationApi, AUTH_EVENTS ){
        //$log.debug( 'iscNavContainer.run' );

        loadDataFromStoredSession();

        var requestedState;

        // ------------------------
        // stateChange start
        $rootScope.$on('$stateChangeStart',
          function( event, toState, toParams, fromState, fromParams ){
            //$log.debug( 'ischNavContainer.$stateChangeStart');
            //$log.debug( '...from: ' + fromState.name );
            //$log.debug( '.....to: ' + toState.name );

            iscCustomConfigService.loadConfig().then( function( config ){//jshint ignore:line
              startLoadingAnimation();
              handleStateChangeStart( event, toState, toParams, fromState, fromParams  );
            });
          });

        // ------------------------
        // stateChange success
        $rootScope.$on('$stateChangeSuccess',
          function( event, toState, toParams, fromState, fromParams ){//jshint ignore:line
              //$log.debug( 'ischNavContainer.$stateChangeSuccess');

            // end loading animation
            iscProgressLoader.end();
          });

        // ------------------------
        // login success event
        $rootScope.$on( AUTH_EVENTS.loginSuccess, function(){
          //$log.debug( 'ischNavContainer.AUTH_EVENTS.loginSuccess');

          var userRole = iscSessionModel.getCurrentUser().userRole;
          updateStateByRole( userRole );

          var nextState = requestedState ? requestedState.name : 'index.home';
          $state.go( nextState );
          requestedState = null;
        });

        // ------------------------
        // logout success event
        $rootScope.$on( AUTH_EVENTS.logoutSuccess, function(){
          //$log.debug( 'ischNavContainer.AUTH_EVENTS.logoutSuccess');

          updateStateByRole();
          $state.go( 'index.home' );
        });

        // ------------------------
        // sessionTimeout event
        // This triggers the logout, destroys the session, and reloads the page
        // The session model, on sessionTimeout, sets a localStorage var
        // that on page reload, tells the navigationController to show an alert
        $rootScope.$on( AUTH_EVENTS.sessionTimeout, function(){
          //$log.debug( 'ischNavContainer.sessionTimeout');
          iscAuthenticationApi.logout();
          $window.location.reload();
        });

        // ------------------------
        // functions
        // ------------------------
        function startLoadingAnimation(){
          iscProgressLoader.start();
          iscProgressLoader.set(50);
        }

        function handleStateChangeStart( event, toState, toParams, fromState, fromParams ){//jshint ignore:line
          //$log.debug( 'ischNavContainer.handleStateChangeStart');

          var stateIsExcluded = iscCustomConfigHelper.stateIsExcluded( toState.name );

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

          // get the permissions for this state
          var isAuthorized = iscSessionModel.isAuthorized( toState.name ); // either your role is permitted or the state is whitelisted
          var isAuthenticated = iscSessionModel.isAuthenticated(); // you are logged i

          //$log.debug( '...isAuthorized',isAuthorized);
          //$log.debug( '...isAuthenticated',isAuthenticated);

          if( !isAuthorized ){
            //$log.debug( '...not authorized');

            if( !isAuthenticated ){
              $state.go( 'index.login' );
              requestedState = toState;
              $rootScope.$broadcast( AUTH_EVENTS.notAuthenticated );
            }
            else{
              //$log.debug( '... logged in, but not authorized')
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
          }
        }

        function preventDefault( event ){
          //$log.debug( '...preventDefault');
          iscProgressLoader.end();
          event.preventDefault();
        }

        function loadDataFromStoredSession(){
          //$log.debug( 'ischNavContainer.loadDataFromStoredSession');

          // NOTE - set the login response and create the session BEFORE calling initSessionTimeout
          // since the warning for sessionTimeout time is predicate on setting the sessionTimeout time first
          var storedLoginResponse = iscSessionStorageHelper.getLoginResponse();
          if( !_.isEmpty( storedLoginResponse )){
            //$log.debug( '...got storedLoginResponse: ' + JSON.stringify( storedLoginResponse ));
            iscSessionModel.create( storedLoginResponse );
          }

          var timeoutCounter = iscSessionStorageHelper.getSessionTimeoutCounter();
          //$log.debug( '...got a counter: ' + timeoutCounter );
          if( timeoutCounter > 0 ){
            //$log.debug( '...got a counter: ' + timeoutCounter );
            iscSessionModel.initSessionTimeout( timeoutCounter );
          }
        }

        function updateStateByRole(){
          var currentUser = iscSessionModel.getCurrentUser();
          var userRole = !!currentUser ? currentUser.userRole : '';
          iscCustomConfigService.updateStateByRole( userRole );
        }

      }]);
})();
