/**
 * Created by douglasgoodman on 11/19/14.
 */

(function(){
  'use strict';

  iscCustomConfigService.$inject = [ '$log','$q', '$http' ,'iscSessionModel', 'iscSessionStorageHelper', 'iscCustomConfigHelper' ];

  function iscCustomConfigService( $log, $q, $http, iscSessionModel, iscSessionStorageHelper, iscCustomConfigHelper ){
//    //$log.debug( 'iscCustomConfigService LOADED' );

    // ----------------------------
    // vars
    // ----------------------------

    var config;
    var topTabsArray;

    // ----------------------------
    // class factory
    // ----------------------------

    var service  = {
      getBaseUrl: getBaseUrl,
      getBaseUrlSecondary: getBaseUrlSecondary,
      getApiUrl: getApiUrl,

      getConfig: getConfig,
      setConfig: setConfig,
      loadConfig: loadConfig,
      initSession: initSession,
      clearConfig: clearConfig,

      updateStateByRole: updateStateByRole,

      getTopTabsConfig: getTopTabsConfig,
      getTopTabsArray: getTopTabsArray,
      getHomePageConfig: getHomePageConfig,
      getLogoutButtonConfig: getLogoutButtonConfig,
      getLoginButtonConfig: getLoginButtonConfig,

      getLibrarySecondaryNav: getLibrarySecondaryNav,
      getMessagesSecondaryNav: getMessagesSecondaryNav,
      getMessagesSecondaryNavTasks: getMessagesSecondaryNavTasks,
      getMyAccountSecondaryNav: getMyAccountSecondaryNav,
      getCustomerTabSecondaryNav: getCustomerTabSecondaryNav
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    // ----------------------------
    // base url

    function getBaseUrl(){
      //$log.debug( 'iscCustomConfigService.getBaseUrl' );
      //$log.debug( '...baseUrl', config ? config.baseUrl : '');
      return config ? config.baseUrl : null;
    }

    function getBaseUrlSecondary(){
      return config.baseUrlSecondary;
    }

    function getApiUrl(apiUrl){
      if( !config.api ){
        return apiUrl;
      }

      var url = (config.api.protocol || 'http') + '://' + config.api.hostname + ':' + (config.api.port || 80);
      url += (apiUrl || '');
      return url;
    }

    // ----------------------------
    // config

    function loadConfig(){
      //$log.debug( 'iscCustomConfigService.loadConfig' );

      var deferred = $q.defer();
      var url = 'assets/configuration/configFile.json';

      if( config ){
        //$log.debug( '...exists', config );
        deferred.resolve( config );
      }
      else{
        //$log.debug( '...loading');
        $http.get( url ).then(
            function( results ){
              //$log.debug( '...SUCCESS: ', results);
              // load the config here
              var config = results.data;
              initSession( config );
              deferred.resolve( config );
            }
        );
      }

      return deferred.promise;
    }

    function initSession( config ){
      setConfig( config );
      iscSessionModel.setNoLoginRequiredList( config.noLoginRequired );
      iscSessionModel.setPermittedStates( [] );
      addStates();

      // update the states based on the user's role, if any
      var currentUser = iscSessionModel.getCurrentUser();
      var userRole = !!currentUser ? currentUser.userRole : '';
      updateStateByRole( userRole );
    }

    function getConfig(){
//      //$log.debug( 'iscCustomConfigService.getConfig' );
//      //$log.debug( '...config ' + JSON.stringify( config ) );
      return config;
    }

    function setConfig( val ){
      //$log.debug( 'iscCustomConfigService.setConfig' );
      //$log.debug( '...baseUrl ' + JSON.stringify( val.baseUrl ) );
      //$log.debug( '...config ', val );
      config = val;
      iscSessionStorageHelper.setConfig( val );
    }

    // ----------------------------
    // states

    function addStates(){
      //$log.debug( 'iscCustomConfigService.addStates' );

      // add the top tabs
      iscCustomConfigHelper.addStates( config.topTabs );

      // add the login button if it exists
      var login = config.loginButton;
      if( !!login ){
        iscCustomConfigHelper.addStates( {
          loginButton: config.loginButton
        });
      }

      // add the secondary navs
      var secondaryNavs = _.filter( config, 'secondaryNav' );
      //$log.debug( '...secondaryNavs', secondaryNavs );
      _.forEach( secondaryNavs, function( obj ){
        iscCustomConfigHelper.addStates( obj.secondaryNav );
      });

      // add the secondary tasks
      var tasks = _.filter( config, 'tasks' );
      //$log.debug( '...tasks', tasks );
      _.forEach( tasks, function( obj ){
        iscCustomConfigHelper.addStates( obj.tasks );
      });

    }

    function clearConfig(){
//      //$log.debug( 'iscCustomConfigService.clearConfig' );
      config = null;
    }

    // ----------------------------
    /**
     * adds or removes tabs based on the user's permissions in the configFile.json
     * eg:
     "userPermittedTabs": {
            "user":["*"],
            "guest":["index.home","index.library"]
       }
     * supports wildcards (eg 'index.home.*')
     * where '*' will allow all tabs
     * NOTE - if you want to include some but not all subtabs,
     *        be sure to also include the parent tab (eg ['index.messages', 'index.messages.subtab1' ])
     *
     * @param role String
     */
    function updateStateByRole( role ){
      //$log.debug( 'iscCustomConfigService.updateStateByRole', role );

      var allStates = iscCustomConfigHelper.getAllStates();
      //$log.debug( '...allStates', allStates );

      // start by excluding everything
      _.forEach( allStates, function( tab ){
        if( tab ){
          tab.exclude = true;
        }
      });

      if( !config ){
        return;
      }

      var noLoginRequired = angular.copy( config.noLoginRequired );
      var userPermittedStates = angular.copy( config.userPermittedTabs[role] );
      var allPermittedStates = [];
      if( !!userPermittedStates ){
        allPermittedStates = noLoginRequired.concat( userPermittedStates );
      }
      else{
        allPermittedStates = noLoginRequired;
      }

      iscSessionModel.setPermittedStates( allPermittedStates );
      //$log.debug( '...allPermittedStates', allPermittedStates );

      if( _.contains( allPermittedStates,  '*' )){
        //console.debug( '...adding all' );
        //turn everything on
        _.forEach( allStates, function( state ){
          state.exclude = false;
        });
      }
      else{

        _.forEach( allPermittedStates, function( permittedTab ){
          //$log.debug( '...permittedTab', permittedTab );

          // handle wildcards
          var starIdx = permittedTab.indexOf( '.*' );
          if( starIdx > -1 ){
            var superState = permittedTab.substr( 0, starIdx );
            //$log.debug( '...superState', superState );

            _.forEach( allStates, function( state ){
              if( state.state.indexOf( superState ) > -1 ){
                state.exclude = false;
              }
            });
          }
          else{
            //$log.debug( '...allStates[permittedTab]', allStates[permittedTab] );
            if( allStates[permittedTab] ){
              allStates[permittedTab].exclude = false;
            }
          }
        });
      }

      //$log.debug( 'Finished updating navbar');
    }

    // ----------------------------
    // specific config getters

    function getTopTabsConfig(){
      return config.topTabs;
    }

    function getTopTabsArray(){
      if( !topTabsArray ){
        topTabsArray = _.toArray( config.topTabs );
      }
      return topTabsArray;
    }

    function getLogoutButtonConfig(){
      return config.logoutButton;
    }

    function getLoginButtonConfig(){
      return config.loginButton;
    }

    function getHomePageConfig(){
      return config.homePage;
    }

    function getMyAccountSecondaryNav(){
      return config.myAccount.secondaryNav;
    }

    function getMessagesSecondaryNav(){
      return config.messages.secondaryNav;
    }

    function getMessagesSecondaryNavTasks(){
      return config.messages.tasks;
    }

    function getLibrarySecondaryNav(){
      return config.library.secondaryNav;
    }

    function getCustomerTabSecondaryNav(){
      return config.customerTab.secondaryNav;
    }

  }// END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .factory( 'iscCustomConfigService', iscCustomConfigService );
})();
