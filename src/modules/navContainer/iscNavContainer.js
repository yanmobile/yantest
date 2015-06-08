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

      .config( function( $stateProvider ){
        //console.log('iscNavContainer.config');

        // ----------------------------
        // state management
        // ----------------------------
        $stateProvider
            .state('index', {
              abstract: true,
              url: '/',

              views: {
                '@': {
                  templateUrl: 'app/navContainer/iscNavContainer.html',
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

      })

      .run( function( $log, devlog, $rootScope, $state, $window, $timeout, iscProgressLoader, iscSessionModel, iscCustomConfigService,
                      iscCustomConfigHelper, iscSessionStorageHelper, iscDefaultPages, iscAuthenticationApi, AUTH_EVENTS ){
        //$log.debug( 'iscNavContainer.run' );

        // wrapped in a timeout to ensure that the dom is loaded
        // loading the config first
        $timeout( function(){
          //iscCustomConfigService.loadConfig().then( function(){
          //  devlog.channel('StateNav').debug( 'loading data from stored session');
            loadDataFromStoredSession();
          //});

        },0);

        // when you refresh the page, this stores your requested state,
        // so that you dont loose it when refreshing the sessionModel causes a loginSuccess event
        // and the ensuing navigation
        var requestedState;

        // ------------------------
        // stateChange start
        $rootScope.$on('$stateChangeStart',
            function( event, toState, toParams, fromState, fromParams ){
              //$log.debug( 'ischNavContainer.$stateChangeStart');
              //$log.debug( '...from: ' + fromState.name );
              //$log.debug( '.....to: ', toState );

              requestedState = toState;

              // loading config since sometimes the event is broadcast
              // before the config is loaded
              iscCustomConfigService.loadConfig().then( function(){
                devlog.channel('StateNav').debug( 'State change request received');
                devlog.channel('StateNav').debug( 'Beginning state change from "%s" to "%s"', fromState.name, toState.name);

                startLoadingAnimation();
                handleStateChangeStart( event, toState, toParams, fromState, fromParams  );
              });
            });

        // ------------------------
        // stateChange success
        $rootScope.$on('$stateChangeSuccess',
            function( event, toState, toParams, fromState, fromParams ){//jshint ignore:line
              devlog.channel('StateNav').debug( 'State change was successful');

              // end loading animation
              iscProgressLoader.end();
            });

        $rootScope.$on('$stateChangeError',
            function( event, toState, toParams, fromState, fromParams, error){
              devlog.channel('StateNav').debug( 'State change encountered an error' );
              iscProgressLoader.end();
            }
        );

        $rootScope.$on('$stateNotFound',
            function( event, toState, toParams, fromState, fromParams, error){
              devlog.channel('StateNav').debug( 'State not found' );
              iscProgressLoader.end();
            }
        );

        // ------------------------
        // login success event
        $rootScope.$on( AUTH_EVENTS.loginSuccess, function(){
          //log.debug( 'ischNavContainer.AUTH_EVENTS.loginSuccess');

          var userRole = iscSessionModel.getCurrentUser().userRole;
          devlog.channel('Login','StateNav').debug( 'Nav Container received login success for user of role %s', userRole);
          updateStateByRole( userRole );

          devlog.channel('Login','StateNav').debug('Updating main page');
          devlog.channel('Login','StateNav').debug('Requested state is ' + requestedState.name);

          // dont go back to the login page
          if( requestedState && requestedState.name === iscDefaultPages.beforeLoginSref ){
            requestedState = null;
          }

          var nextState = requestedState ? requestedState.name : iscDefaultPages.afterLoginSref;
          devlog.channel('Login','StateNav').debug('Next state shall be ' + nextState);

          $state.go( nextState );
          devlog.channel('Login','StateNav').debug('Finished updating main page');
          requestedState = null;
        });

        // ------------------------
        // logout success event
        $rootScope.$on( AUTH_EVENTS.logoutSuccess, function(){
          devlog.channel('Logout').debug( 'ischNavContainer.AUTH_EVENTS.logoutSuccess');

          updateStateByRole();
          $state.go( iscDefaultPages.beforeLoginSref );
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
          devlog.channel('StateNav').debug( 'Checking if state is accessible');

          var stateIsExcluded = iscCustomConfigHelper.stateIsExcluded( toState.name );

          if( stateIsExcluded ){
            devlog.channel('StateNav').debug( 'State is excluded, aborting');
            // even if you are authorized and logged in, don't navigate to excluded states
            // this prevents navigation to excluded pages via entering the uri directly in the browser
            preventDefault( event );
          }
          else if( toState.name === fromState.name ){
            devlog.channel('StateNav').debug( 'State is the same, aborting');
            // no double taps
            preventDefault( event );
          }

          // get the permissions for this state
          var isAuthorized = iscSessionModel.isAuthorized( toState.name ); // either your role is permitted or the state is whitelisted
          var isAuthenticated = iscSessionModel.isAuthenticated(); // you are logged i

          //$log.debug( '...isAuthorized',isAuthorized);
          //$log.debug( '...isAuthenticated',isAuthenticated);

          if( !isAuthorized ){
            devlog.channel('StateNav').debug( 'User is not authorized');

            if( !isAuthenticated ){
              devlog.channel('StateNav').debug( 'User is not authenticated');

              devlog.channel('StateNav').debug( 'User will be sent to "%s"', iscDefaultPages.beforeLoginSref);
              $state.go( iscDefaultPages.beforeLoginSref );
              requestedState = toState;
              $rootScope.$broadcast( AUTH_EVENTS.notAuthenticated );
              return
            }
            else{
              devlog.channel('StateNav').debug( 'User is authenticated, but not authorized');
              $rootScope.$broadcast( AUTH_EVENTS.notAuthorized );

              if( !fromState || !fromState.name ){
                devlog.channel('StateNav').debug( 'User will be sent to "%s"', iscDefaultPages.beforeLoginSref);
                // edge case where your permissions changed underneath you
                // and you refreshed the page - assumes the Home state is always permitted
                $state.go( iscDefaultPages.beforeLoginSref );
                return
              }
              else{
                devlog.channel('StateNav').debug( 'User will be sent to "%s"', fromState.name);
                $state.go( fromState.name );
                return
              }
            }
          }

          devlog.channel('StateNav').debug( 'State is accessible.  Proceeding...');
        }

        function preventDefault( event ){
          //$log.debug( '...preventDefault');
          iscProgressLoader.end();
          event.preventDefault();
        }

        function loadDataFromStoredSession(){
          devlog.channel('StateNav').debug( 'iscNavContainer.loadDataFromStoredSession');

          // NOTE - set the login response and create the session BEFORE calling initSessionTimeout
          // since the warning for sessionTimeout time is predicate on setting the sessionTimeout time first
          var storedLoginResponse = iscSessionStorageHelper.getLoginResponse();
          if( !_.isEmpty( storedLoginResponse )){
            //$log.debug( '...got storedLoginResponse: ',storedLoginResponse );
            iscSessionModel.create( storedLoginResponse );
          }

          var timeoutCounter = iscSessionStorageHelper.getSessionTimeoutCounter();
          //$log.debug( '...got a counter: ', timeoutCounter );
          if( timeoutCounter > 0 ){
            //$log.debug( '...got a counter: ' + timeoutCounter );
            iscSessionModel.initSessionTimeout( timeoutCounter );
          }
        }

        function updateStateByRole(){
          //$log.debug( 'ischNavContainer.updateStateByRole');
          var currentUser = iscSessionModel.getCurrentUser();
          var userRole = !!currentUser ? currentUser.userRole : '';
          devlog.channel('StateNav').debug( 'Updating navbar for role %s', userRole);
          iscCustomConfigService.updateStateByRole( userRole );
          devlog.channel('StateNav').debug( 'Finished updating navbar');
        }

      });
})();
