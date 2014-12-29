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
    var statePermissions;

    // ----------------------------
    // class factory
    // ----------------------------

    var service  = {
      // all
      getConfig: getConfig,
      setConfig: setConfig,
      loadConfig: loadConfig,
      clearConfig: clearConfig,

      getStatePermissions: getStatePermissions,

      getTopTabsConfig: getTopTabsConfig,
      getHomePageConfig: getHomePageConfig,
      getLogoutButtonConfig: getLogoutButtonConfig,
      getLoginButtonConfig: getLoginButtonConfig,

      getLibrarySecondaryNav: getLibrarySecondaryNav,
      getMessagesSecondaryNav: getMessagesSecondaryNav,
      getMyAccountSecondaryNav: getMyAccountSecondaryNav,
      getCustomerTabSecondaryNav: getCustomerTabSecondaryNav
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    // ----------------------------
    // all configurations

    function loadConfig(){
      //$log.debug( 'iscCustomConfigService.loadConfig' );

      var deferred = $q.defer();
      var url = '/assets/configuration/configFile.json';

      if( config ){
        //$log.debug( '...exists' );
        deferred.resolve( config );
      }
      else{
        //$log.debug( '...loading');
        $http.get( url ).then(
          function( results ){
            //$log.debug( '...SUCCESS: ' + JSON.stringify( results ));
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
      })

    }

    function getConfig(){
//      //$log.debug( 'iscCustomConfigService.getConfig' );
//      //$log.debug( '...config ' + JSON.stringify( config ) );
      return config;
    }

    function setConfig( val ){
      //$log.debug( 'iscCustomConfigService.setConfig' );
//      //$log.debug( '...val ' + JSON.stringify( val ) );
      config = val;
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
    // specific config getters

    function getTopTabsConfig(){
      return config.topTabs;
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
