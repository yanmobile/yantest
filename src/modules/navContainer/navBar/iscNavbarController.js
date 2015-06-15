(function(){
  'use strict';

  // ------------------------------------------
  // factory function
  // ------------------------------------------

  iscNavbarController.$inject = [ '$log', '$scope', '$state', '$rootScope', 'iscCustomConfigService', 'iscCustomConfigHelper', 'iscUiHelper', 'iscSessionModel', 'AUTH_EVENTS' ];

  function iscNavbarController( $log, $scope, $state, $rootScope, iscCustomConfigService, iscCustomConfigHelper, iscUiHelper, iscSessionModel, AUTH_EVENTS ){//jshint ignore:line
//    //$log.debug( 'iscNavbarController LOADED');

    var self = this;

    self.iscUiHelper = iscUiHelper;
    self.configService = iscCustomConfigService;
    self.sessionModel = iscSessionModel;

    self.tabs = self.configService.getTopTabsArray();
    self.logoutButton = self.configService.getLogoutButtonConfig();
    self.loginButton = self.configService.getLoginButtonConfig();

    self.sectionTranslationKey = '';

    self.logout = function(){
      //$log.debug( 'iscNavbarController.logout');
      $rootScope.$broadcast( AUTH_EVENTS.logout );
    };

    self.showLogin = function(){
      //$log.debug( 'iscNavbarController.showLogin');

      var loggedIn = self.sessionModel.isAuthenticated();
      var isLoginPage = $state.is( 'index.login' );

      return !loggedIn && !isLoginPage;
    };

    self.showLogout= function(){
      //$log.debug( 'iscNavbarController.showLoout');

      var loggedIn = self.sessionModel.isAuthenticated();
      var isLoginPage = $state.is( 'index.login' );
      return loggedIn && !isLoginPage;
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
      function( newVal, oldVal ){//jshint ignore:line
        self.translationParams = {
          userName: self.sessionModel.getFullName()
        };
      });

    // -----------------------------
    // listeners
    // -----------------------------

    $rootScope.$on('$stateChangeSuccess',
      function( event, toState, toParams, fromState, fromParams ){//jshint ignore:line
        //$log.debug( 'iscNavbarController.$stateChangeSuccess', arguments);
        setPageState( toState.name );
      });

    // when you refresh the page, this will reset the active state of the selected tab
    angular.element(document).ready(function () {//jshint ignore:line
      setPageState( $state.$current.name );
    });

    function setPageState( name ){
      self.setTabActiveState( name );
      self.sectionTranslationKey = iscCustomConfigHelper.getSectionTranslationKeyFromName( name );
    }


  } // END CLASS

  // ------------------------------------------
  // module injection
  // ------------------------------------------
  angular.module('iscNavContainer')
    .controller( 'iscNavbarController', iscNavbarController );

})();


