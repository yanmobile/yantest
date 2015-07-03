/**
 * Created by douglasgoodman on 11/24/14.
 */

(function(){
  'use strict';

  angular.module('iscNavContainer', ['ui.router'])

      .constant('AUTH_EVENTS', {
        loginError:            'iscLoginError',
        loginSuccess:          'iscLoginSuccess',
        loginFailed:           'iscLoginFailed',
        logout:                'iscLogout',
        logoutSuccess:         'iscLogoutSuccess',
        notAuthenticated:      'iscNotAuthenticated',
        notAuthorized:         'iscNotAuthorized',
        openSortOptions:       'iscOpenSortOptions',
        responseError:         'iscResponseError',
        sessionResumedSuccess: 'iscSessionResumedSuccess',
        sessionTimeout:        'iscSessionTimeout',
        sessionTimeoutConfirm: 'iscSessionTimeoutConfirm',
        sessionTimeoutWarning: 'iscSessionTimeoutWarning',
        sessionTimeoutReset:   'iscSessionTimeoutReset'
      })

      .constant('APP_EVENTS', {
        appLoaded:     'iscAppLoaded'
      })

      .constant('NAV_EVENTS', {
        showSecondaryNav:     'iscShowSecondaryNav',
        hideSecondaryNav:     'iscHideSecondaryNav',
        goToBeforeLoginPage:  'iscGoToBeforeLoginPage'
      })

      .constant('DROPDOWN_EVENTS', {
        dropdownShow:          'DROPDOWN_SHOW',
        showDropdownList:      'SHOW_DROPDOWN_LIST',
        dropdownItemSelected:  'DROPDOWN_ITEM_SELECTED'
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
                  //devlog.channel('StateNav').debug( 'iscNavContainer.loadConfig');
                  return iscCustomConfigService.loadConfig();
                }
              }
            });

//        TODO use this for deploy, but re-write the urls on the server
//        $locationProvider.html5Mode(true);

      })

      .run( function( devlog, $rootScope, $state, $window, $timeout, iscProgressLoader, iscSessionModel, iscCustomConfigService,
                      iscCustomConfigHelper, iscSessionStorageHelper,  AUTH_EVENTS, APP_EVENTS, NAV_EVENTS ){
        //console.log( 'iscNavContainer.run' );

        // ------------------------
        // all the .run() functions have been called
        // this is dispached from app.run() - so be sure to add it there
        $rootScope.$on( APP_EVENTS.appLoaded, function(){
          loadDataFromStoredSession();
        });

        // ------------------------
        // stateChange start
        $rootScope.$on('$stateChangeStart',
            function( event, toState, toParams, fromState, fromParams ){
              //devlog.channel('StateNav').debug( 'ischNavContainer.$stateChangeStart');
              //devlog.channel('StateNav').debug( '...from: ' + fromState.name );
              //devlog.channel('StateNav').debug( '.....to: ', toState.name );

              iscCustomConfigService.loadConfig().then( function( config ){//jshint ignore:line
                //devlog.channel('StateNav').debug( 'State change request received');
                //devlog.channel('StateNav').debug( 'Beginning state change from "%s" to "%s"', fromState.name, toState.name);

                startLoadingAnimation();
                handleStateChangeStart( event, toState, toParams, fromState, fromParams  );
              });
            });

        // ------------------------
        // stateChange success
        $rootScope.$on('$stateChangeSuccess',
            function( event, toState, toParams, fromState, fromParams ){//jshint ignore:line
              //devlog.channel('StateNav').debug( 'ischNavContainer.$stateChangeSuccess');

              // end loading animation
              iscProgressLoader.end();
            });

        // ------------------------
        // functions
        // ------------------------
        function startLoadingAnimation(){
          iscProgressLoader.start();
          iscProgressLoader.set(50);
        }

        function handleStateChangeStart( event, toState, toParams, fromState, fromParams ){//jshint ignore:line
          //devlog.channel('StateNav').debug( 'iscNavContainer.handleStateChangeStart');

          var stateIsExcluded = iscCustomConfigHelper.stateIsExcluded( toState.name );

          if( stateIsExcluded ){
            //devlog.channel('StateNav').debug( '...excluded state');
            // even if you are authorized and logged in, don't navigate to excluded states
            // this prevents navigation to excluded pages via entering the uri directly in the browser
            preventDefault( event );
          }
          else if( toState.name === fromState.name ){
            //devlog.channel('StateNav').debug( '...double tap');
            // no double taps
            preventDefault( event );
          }

          // get the permissions for this state
          var isAuthorized = iscSessionModel.isAuthorized( toState.name ); // either your role is permitted or the state is whitelisted
          var isAuthenticated = iscSessionModel.isAuthenticated(); // you are logged i

          //devlog.channel('StateNav').debug( '...isAuthorized',isAuthorized);
          //devlog.channel('StateNav').debug( '...isAuthenticated',isAuthenticated);

          if( !isAuthorized ){
            //devlog.channel('StateNav').debug( '...not authorized');

            if( !isAuthenticated ){
              //devlog.channel('StateNav').debug( '...not authenticated');

              //$state.go( DEFAULT_PAGES.beforeLogin );
              $rootScope.$broadcast( NAV_EVENTS.goToBeforeLoginPage );
              $rootScope.$broadcast( AUTH_EVENTS.notAuthenticated );
            }
            else{
              //devlog.channel('StateNav').debug( '... logged in, but not authorized');
              $rootScope.$broadcast( AUTH_EVENTS.notAuthorized );

              if( !fromState || !fromState.name ){
                //devlog.channel('StateNav').debug( '... going home');
                // edge case where your permissions changed underneath you
                // and you refreshed the page
                //$state.go( DEFAULT_PAGES.beforeLogin );
                $rootScope.$broadcast( NAV_EVENTS.goToBeforeLoginPage );
              }
              else{
                //devlog.channel('StateNav').debug( '... going to ',fromState.name );
                $state.go( fromState.name );
              }
            }
          }
        }

        function preventDefault( event ){
          //devlog.channel('StateNav').debug( '...preventDefault');
          iscProgressLoader.end();
          event.preventDefault();
        }

        function loadDataFromStoredSession(){
          //console.log( 'iscNavContainer.loadDataFromStoredSession');

          var storedConfig = iscSessionStorageHelper.getConfig();
          if( storedConfig && !_.isEmpty( storedConfig )){
            //console.log( '...got storedConfig: ', storedConfig );
            iscCustomConfigService.initSession( storedConfig );
          }

          // NOTE - set the login response and create the session BEFORE calling initSessionTimeout
          // since the warning for sessionTimeout time is predicate on setting the sessionTimeout time first
          var storedLoginResponse = iscSessionStorageHelper.getLoginResponse();
          if( !_.isEmpty( storedLoginResponse )){
            //console.log( '...got storedLoginResponse: ',storedLoginResponse );
            iscSessionModel.create( storedLoginResponse, false );
          }

          var timeoutCounter = iscSessionStorageHelper.getSessionTimeoutCounter();
          //devlog.channel('StateNav').debug( '...got a counter: ', timeoutCounter );
          if( timeoutCounter > 0 ){
            //devlog.channel('StateNav').debug( '...got a counter: ' + timeoutCounter );
            iscSessionModel.initSessionTimeout( timeoutCounter );
          }
        }

      });
})();
