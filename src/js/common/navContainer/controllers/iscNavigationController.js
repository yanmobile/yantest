/**
 * Created by douglasgoodman on 11/21/14.
 */
(function(){

  'use strict';

  iscNavigationController.$inject = [ '$log', '$rootScope', '$timeout', '$scope', 'iscSessionModel', 'iscSessionStorageHelper', 'iscNavContainerModel', 'iscAlertModel', 'iscCustomConfigHelper', 'iscUiHelper', 'iscStateManager', 'AUTH_EVENTS', 'NAV_EVENTS' ];

  function iscNavigationController( $log, $rootScope, $timeout, $scope, iscSessionModel, iscSessionStorageHelper, iscNavContainerModel, iscAlertModel, iscCustomConfigHelper, iscUiHelper, iscStateManager, AUTH_EVENTS, NAV_EVENTS ){
    //$log.debug( 'iscNavigationController LOADED');

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
      //$log.debug( 'iscNavigationController.hideAllPopups');
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
      //$log.debug( 'iscNavigationController.showAlertBox');
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
    // on load
    // --------------
    self.onLoad = function(){
      //$log.debug( 'iscNavigationController.onLoad');
      //$log.debug( '...alertShowing ', self.alertShowing );

      // When the session times out, we refresh the page to reset all model data
      // and set a localStorage var to show a warning:
      // This looks for the localStorage var and triggers the warning popup
      // Wrapped in a timeout to ensure the dom is loaded
      $timeout( function(){
        var showTimedOutAlert = !!iscSessionStorageHelper.getShowTimedOutAlert();
        //$log.debug( '...showTimedOutAlert',showTimedOutAlert);

        if( showTimedOutAlert ){
          //$log.debug( '...showTimedOutAlert 2',showTimedOutAlert);
          iscSessionStorageHelper.setShowTimedOutAlert( false );
          iscAlertModel.setOptionsByType( AUTH_EVENTS.sessionTimeout, null, null, null );
          self.showAlertBox();
        }
      }, 250);
    };

    self.onLoad();


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

    $scope.$on( AUTH_EVENTS.sessionTimeout, function(){
      //$log.debug( 'ischNavContainer.sessionTimeout');
      self.hideAllPopups();
      self.alertShowing = false;
    });

    $scope.$on( NAV_EVENTS.showSecondaryNav, function( event, response ){//jshint ignore:line
      //$log.debug( 'iscNavigationController.iscShowModal' );
      self.showSecondaryNavbar();
    });

    $scope.$on( NAV_EVENTS.hideSecondaryNav, function( event, response ){//jshint ignore:line
      //$log.debug( 'iscNavigationController.iscHideModal' );
      self.hideSecondaryNavbar();
    });


  }// END CLASS

  // --------------
  // inject
  // --------------
  angular.module('iscNavContainer')
    .controller('iscNavigationController', iscNavigationController );

})();


