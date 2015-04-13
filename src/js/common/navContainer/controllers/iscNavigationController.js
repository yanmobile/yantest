/**
 * Created by douglasgoodman on 11/21/14.
 */
(function(){

  'use strict';

  iscNavigationController.$inject = [ '$log', '$rootScope', '$scope', 'iscSessionModel', 'iscNavContainerModel', 'iscAlertModel', 'iscCustomConfigHelper', 'iscUiHelper', 'iscStateManager', 'AUTH_EVENTS', 'NAV_EVENTS' ];

  function iscNavigationController( $log, $rootScope, $scope, iscSessionModel, iscNavContainerModel, iscAlertModel, iscCustomConfigHelper, iscUiHelper, iscStateManager, AUTH_EVENTS, NAV_EVENTS ){
//    $log.debug( 'iscNavigationController LOADED');

    var self = this;

    // --------------
    // models
    self.navModel = iscNavContainerModel;
    self.sessionModel = iscSessionModel;
    self.customConfigHelper = iscCustomConfigHelper;
    self.stateManager = iscStateManager;
    self.iscUiHelper = iscUiHelper;

    // --------------
    // nav bars and alerts
    // --------------
    self.showAlert = false;
    self.alertShowing = false;
    self.showSideNav = false;
    self.showSecondaryNav = false;
    self.showModalBkgrnd = false;

    // --------------
    self.hideAllPopups = function(){
      self.showModalBkgrnd = false;
      self.showAlert = false;
      self.alertShowing = false;
      self.showSideNav = false;
      self.showSecondaryNav = false;
      self.showModalBkgrnd = false;
    };

    // --------------
    self.showSideNavbar = function(){
      self.hideAllPopups(); // close any that are already up

      self.showSideNav = true;
      self.showModalBkgrnd = true;
    };

    self.hideSideNavbar = function(){
      self.showSideNav = false;
      self.showModalBkgrnd = false;
    };

    // --------------
    self.showSecondaryNavbar = function(){
      //$log.debug( 'iscNavigationController.showSecondaryNavbar');
      self.hideAllPopups(); // close any that are already up

      self.showSecondaryNav = true;
      self.showModalBkgrnd = true;
    };

    self.hideSecondaryNavbar = function(){
      //$log.debug( 'iscNavigationController.hideSecondaryNavbar');
      self.showSecondaryNav = false;
      self.showModalBkgrnd = false;
      self.stateManager.setParentSref( '' );
    };

    // --------------
    self.showAlertBox = function(){
      self.hideAllPopups(); // close any that are already up

      self.showAlert = true;
      self.showModalBkgrnd = true;
      self.alertShowing = true;
    };

    self.hideAlertBox = function(){
      self.showAlert = false;
      self.showModalBkgrnd = false;
      self.alertShowing = false;
    };

    // --------------
    self.showSortOptions = function(){
      self.hideAllPopups(); // close any that are already up

      self.showSortOpts = true;
      self.showModalBkgrnd = true;
    };

    self.hideSortOptions = function(){
      self.showSortOpts = false;
      self.showModalBkgrnd = false;
    };
    // --------------
    // session / login
    // --------------
    self.currentUser = self.sessionModel.getCurrentUser();
    self.credentials = self.sessionModel.getCredentials();

    // --------------
    // session timeout callbacks
    self.onContinueSession = function(){
      //$log.debug( 'iscNavigationController.onContinueSession');
      $rootScope.$broadcast( AUTH_EVENTS.sessionTimeoutReset );
    };

    self.onCancelSession = function(){
      //$log.debug( 'iscNavigationController.onCancelSession');
      $rootScope.$broadcast( AUTH_EVENTS.sessionTimeoutConfirm );
    };

    // --------------
    // listeners
    // --------------
    $scope.$on( AUTH_EVENTS.responseError, function( event, response ){
      //$log.debug( 'iscNavigationController.responseError' );
      //$log.debug( '...response' + JSON.stringify( response ));
      iscAlertModel.setOptionsByType( AUTH_EVENTS.responseError, response, null, null );
      self.showAlertBox();
    });

    $scope.$on( AUTH_EVENTS.notAuthenticated, function( event, response ){
//      //$log.debug( 'iscNavigationController.loginError' );
      iscAlertModel.setOptionsByType( AUTH_EVENTS.notAuthenticated, response, null, null );
      self.showAlertBox();
    });

    $scope.$on( AUTH_EVENTS.notAuthorized, function( event, response ){
//      //$log.debug( 'iscNavigationController.loginError' );
      iscAlertModel.setOptionsByType( AUTH_EVENTS.notAuthorized, response, null, null );
      self.showAlertBox();
    });

    $scope.$on( AUTH_EVENTS.sessionTimeoutWarning, function( event, response ){
      //$log.debug( 'iscNavigationController.sessionTimeoutWarning' );
      //$log.debug( '...self.alertShowing: ' + self.alertShowing );

      if( self.alertShowing ){
        //$log.debug( '...nope' );
        return;
      }
      //$log.debug( '...yup' );
      self.alertShowing = true;
      iscAlertModel.setOptionsByType( AUTH_EVENTS.sessionTimeoutWarning, response, self.onContinueSession, self.onCancelSession );
      self.showAlertBox();
    });

    $scope.$on( AUTH_EVENTS.sessionTimeout, function( event, response ){
      //$log.debug( 'iscNavigationController.sessionTimeout' );
      iscAlertModel.setOptionsByType( AUTH_EVENTS.sessionTimeout, response, null, null );
      self.showAlertBox();
    });

    $scope.$on( NAV_EVENTS.showSecondaryNav, function( event, response ){
      //$log.debug( 'iscNavigationController.iscShowModal' );
      self.showSecondaryNavbar();
    });

    $scope.$on( NAV_EVENTS.hideSecondaryNav, function( event, response ){
      //$log.debug( 'iscNavigationController.iscHideModal' );
      self.hideSecondaryNavbar();
    });

    $scope.$on( NAV_EVENTS.openSortOptions, function( event, response ){
      //$log.debug( 'iscNavigationController.openSortOptions' );
      self.showSortOptions();
    });


  }// END CLASS

  // --------------
  // inject
  // --------------
  angular.module('iscNavContainer')
    .controller('iscNavigationController', iscNavigationController );

})();


