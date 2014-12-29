(function(){
  'use strict';

  // ------------------------------------------
  // factory function
  // ------------------------------------------

  iscNavbarController.$inject = [ '$log', '$scope', '$state', '$rootScope', 'iscCustomConfigService', 'iscCustomConfigHelper', 'iscUiHelper', 'iscSessionModel', 'iscAuthenticationApi' ];

  function iscNavbarController( $log, $scope, $state, $rootScope, iscCustomConfigService, iscCustomConfigHelper, iscUiHelper, iscSessionModel, iscAuthenticationApi ){
//    //$log.debug( 'iscNavbarController LOADED');

    var self = this;

    self.iscUiHelper = iscUiHelper;
    self.configService = iscCustomConfigService;
    self.sessionModel = iscSessionModel;

    self.tabs = _.toArray( self.configService.getTopTabsConfig() );
    self.logoutButton = self.configService.getLogoutButtonConfig();
    self.loginButton = self.configService.getLoginButtonConfig();

    self.translationParams = {};


    self.logout = function(){
      //$log.debug( 'iscNavbarController.logout');
      iscAuthenticationApi.logout();
    };

    self.iconClass = function( tab ){
      return 'glyphicon ' + tab.iconClasses;
    };

    self.showLogin = function(){
//      //$log.debug( 'iscNavbarController.showLogin');

      var loggedIn = self.sessionModel.isAuthenticated();
      var isLoginPage = $state.is( 'index.login' );

      return !loggedIn && !isLoginPage;
    };

    self.showTab = function( tab ){
      //$log.debug( 'iscNavbarController.showTab');
      //$log.debug( '...tab: ' + tab.state );

      var isWhiteListed = iscSessionModel.isWhiteListed( tab.state );

      if( tab.state === 'index.login' ){
        //$log.debug( '...hide login: ' + tab.state );
        return false
      }

      if( isWhiteListed ){
        //$log.debug( '...show whitelisted: ' + tab.state );
        return true;
      }

      var isAuthenticated = iscSessionModel.isAuthenticated();
      var isAuthorized = iscSessionModel.isAuthorized( tab.state );

      var show = isAuthenticated && isAuthorized && !tab.exclude;

      //$log.debug( '...isAuthenticated : ' + isAuthenticated );
      //$log.debug( '...isAuthorized : ' + isAuthorized );
      //$log.debug( '...show : ' + show );

      return show
    };

    self.setTabActiveState = function ( state ) {
      //$log.debug( 'iscNavbarController.setTabActiveState');
      self.iscUiHelper.setTabActiveState( state, self.tabs );
    };

    // -----------------------------
    // watchers
    // -----------------------------
    $scope.$watch(
      function(){
        return self.sessionModel.getCurrentUser();
      },
      function( newVal, oldVal ){
        self.translationParams = {
          userName: self.sessionModel.getFullName()
        };
      });

    // -----------------------------
    // listeners
    // -----------------------------

    $rootScope.$on('$stateChangeSuccess',
      function( event, toState, toParams, fromState, fromParams ){
        //$log.debug( 'iscNavbarController.$stateChangeSuccess');
        self.setTabActiveState( toState.name )
      });

    // when you refresh the page, this will reset the active state of the selected tab
    angular.element(document).ready(function () {
      self.setTabActiveState( $state.$current.name );
    });


  } // END CLASS

  // ------------------------------------------
  // module injection
  // ------------------------------------------
  angular.module('iscNavContainer')
    .controller( 'iscNavbarController', iscNavbarController );

})();


