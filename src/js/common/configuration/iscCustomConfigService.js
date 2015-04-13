/**
 * Created by douglasgoodman on 11/19/14.
 */

(function(){
  'use strict';

  iscCustomConfigService.$inject = [ '$log', '$q', '$http' ,'iscSessionModel', 'iscCustomConfigHelper' ];

  function iscCustomConfigService( $log, $q, $http, iscSessionModel, iscCustomConfigHelper ){
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

      getConfig: getConfig,
      setConfig: setConfig,
      loadConfig: loadConfig,
      clearConfig: clearConfig,

      getStatePermissions: getStatePermissions,

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
    // all configurations


    function getConfig(){
//      //$log.debug( 'iscCustomConfigService.getConfig' );
//      //$log.debug( '...config ' + JSON.stringify( config ) );
      return config;
    }

    function setConfig( val ){
      //$log.debug( 'iscCustomConfigService.setConfig' );
      //$log.debug( '...baseUrl ' + JSON.stringify( val.baseUrl ) );
      //$log.debug( '...config ' + JSON.stringify( val ) );
      config = val;
    }

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
            setConfig( results.data );
            iscSessionModel.setStatePermissions( results.data.statePermissions );
            iscSessionModel.setNoLoginRequiredList( results.data.noLoginRequired );
            addStates();

            deferred.resolve( results.data );
          }
        );
      }

      return deferred.promise;
    }

    function addStates(){
      //$log.debug( 'iscCustomConfigService.addStates' );

      // add the top tabs
      iscCustomConfigHelper.addStates( config.topTabs );
      iscCustomConfigHelper.addStates( config.loginButton );

      // add the secondary tabs
      var secondaryNavs = _.filter( config, 'secondaryNav' );
      _.forEach( secondaryNavs, function( obj ){
        iscCustomConfigHelper.addStates( obj.secondaryNav );
      });

      var tasks = _.filter( config, 'tasks' );
      _.forEach( tasks, function( obj ){
        iscCustomConfigHelper.addStates( obj.tasks );
      });

    }

    function clearConfig( val ){
//      //$log.debug( 'iscCustomConfigService.clearConfig' );
      config = null;
    }

    // ----------------------------
    function getUserRoles() {
      return config.userRoles;
    }

    // ----------------------------
    function getStatePermissions(){
      return config.statePermissions;
    }

    // ----------------------------
    /*
    private
     */
    function getBaseUrl(){
      //$log.debug( 'iscCustomConfigService.getBaseUrl' );
      //$log.debug( '...baseUrl', config ? config.baseUrl : '');
      return config ? config.baseUrl : null;

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
