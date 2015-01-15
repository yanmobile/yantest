/**
 * Created by douglasgoodman on 11/21/14.
 */
(function(){

  'use strict';

  iscNavigationController.$inject = [ '$log', '$rootScope', '$scope', '$modalStack', 'iscSessionModel', 'iscPopupHelper', 'AUTH_EVENTS' ];

  function iscNavigationController( $log, $rootScope, $scope, $modalStack, iscSessionModel, iscPopupHelper, AUTH_EVENTS ){
//    //$log.debug( 'iscNavigationController LOADED');

    var self = this;

    // --------------
    // models
    self.sessionModel = iscSessionModel;

    // --------------
    // session / login
    self.currentUser = self.sessionModel.getCurrentUser();
    self.credentials = self.sessionModel.getCredentials();

    // --------------
    // modal popup

    // this is to prevent the modal popup from showing
    // on every timer tick - dont show it if its already displayed
    self.warningDialogIsShowing = false;

    self.openPopup = function( type, response ){
      //$log.debug( 'iscNavigationController.openPopup' );
      $modalStack.dismissAll( 'close' );
      iscPopupHelper.openPopup( type, response );
    };

    self.openDialog = function( type, okFunc, cancelFunc ){
      $log.debug( 'iscNavigationController.openDialog' );
      $modalStack.dismissAll( 'close' );
      iscPopupHelper.openDialog( type, okFunc, cancelFunc  );
    };

    self.onContinueSession = function(){
      //$log.debug( 'iscNavigationController.onContinueSession');
      self.warningDialogIsShowing = false;
      $rootScope.$broadcast( AUTH_EVENTS.sessionTimeoutReset );
    };

    self.onCancelSession = function(){
      //$log.debug( 'iscNavigationController.onCancelSession');
      self.warningDialogIsShowing = false;
      $rootScope.$broadcast( AUTH_EVENTS.sessionTimeoutConfirm );
    };

    // --------------
    // listeners
    $scope.$on( AUTH_EVENTS.responseError, function( event, response ){
      //$log.debug( 'iscNavigationController.responseError' );
      //$log.debug( '...response' + JSON.stringify( response ));
      self.openPopup( AUTH_EVENTS.responseError, response );
    });

    $scope.$on( AUTH_EVENTS.notAuthenticated, function( event, response ){
//      //$log.debug( 'iscNavigationController.loginError' );
      self.openPopup( AUTH_EVENTS.notAuthenticated, response );
    });

    $scope.$on( AUTH_EVENTS.notAuthorized, function( event, response ){
//      //$log.debug( 'iscNavigationController.loginError' );
      self.openPopup( AUTH_EVENTS.notAuthorized, response );
    });

    $scope.$on( AUTH_EVENTS.sessionTimeoutWarning, function( event, response ){
      //$log.debug( 'iscNavigationController.sessionTimeoutWarning' );
      //$log.debug( '...self.warningDialogIsShowing: ' + self.warningDialogIsShowing );

      if( self.warningDialogIsShowing ){
        //$log.debug( '...nope' );
        return;
      }
      //$log.debug( '...yup' );
      self.warningDialogIsShowing = true;
      self.openDialog( AUTH_EVENTS.sessionTimeoutWarning, self.onContinueSession, self.onCancelSession );
    });

    $scope.$on( AUTH_EVENTS.sessionTimeout, function( event, response ){
      //$log.debug( 'iscNavigationController.sessionTimeout' );
      self.openPopup( AUTH_EVENTS.sessionTimeout, response );
    });

  }// END CLASS


  angular.module('iscNavContainer')
      .controller('iscNavigationController', iscNavigationController );

})();
