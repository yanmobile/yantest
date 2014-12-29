/**
 * Created by douglasgoodman on 11/21/14.
 */
(function(){

  'use strict';

  iscNavigationController.$inject = [ '$log', '$rootScope', '$scope', '$modalStack', '$location', '$global', 'iscSessionModel', 'iscPopupHelper', 'AUTH_EVENTS' ];

  function iscNavigationController( $log, $rootScope, $scope, $modalStack,  $location, $global, iscSessionModel, iscPopupHelper, AUTH_EVENTS ){
//    //$log.debug( 'iscNavigationController LOADED');

    var self = this;

    // ---------------------------
    // DJG
    // ---------------------------

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

    self.openPopup = function( type ){
      $modalStack.dismissAll( 'close' );
      iscPopupHelper.openPopup( type );
    };

    self.openDialog = function( type, okFunc, cancelFunc ){
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
    };

    // --------------
    // listeners
    $scope.$on( AUTH_EVENTS.loginError, function( event, response ){
//      //$log.debug( 'iscNavigationController.loginError' );
      self.openPopup( AUTH_EVENTS.loginError );
    });

    $scope.$on( AUTH_EVENTS.notAuthenticated, function( event, response ){
//      //$log.debug( 'iscNavigationController.loginError' );
      self.openPopup( AUTH_EVENTS.notAuthenticated );
    });

    $scope.$on( AUTH_EVENTS.notAuthorized, function( event, response ){
//      //$log.debug( 'iscNavigationController.loginError' );
      self.openPopup( AUTH_EVENTS.notAuthorized );
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
      self.openPopup( 'iscSessionTimeout' );
    });

    // ---------------------------
    // END DJG
    // ---------------------------


    var setParent = function (children, parent) {
      angular.forEach(children, function (child) {
        child.parent = parent;
        if (child.children !== undefined) {
          setParent (child.children, child);
        }
      });
    };

    self.findItemByUrl = function (children, url) {
      if( !children ) return;

      for (var i = 0, length = children.length; i<length; i++) {
        if (children[i].url && children[i].url.replace('#', '') == url) return children[i];
        if (children[i].children !== undefined) {
          var item = $scope.findItemByUrl (children[i].children, url);
          if (item) return item;
        }
      }
    };

    setParent ($scope.menu, null);

    self.openItems = [];
    self.selectedItems = [];
    self.selectedFromNavMenu = false;

    self.select = function (item) {
      // close open nodes
      if (item.open) {
        item.open = false;
        return;
      }

      for (var i = $scope.openItems.length - 1; i >= 0; i--) {
        self.openItems[i].open = false;
      };

      self.openItems = [];
      var parentRef = item;
      while (parentRef !== null) {
        parentRef.open = true;
        self.openItems.push(parentRef);
        parentRef = parentRef.parent;
      }

      // handle leaf nodes
      if (!item.children || (item.children && item.children.length<1)) {
        self.selectedFromNavMenu = true;
        for (var j = $scope.selectedItems.length - 1; j >= 0; j--) {
          self.selectedItems[j].selected = false;
        };
        self.selectedItems = [];
        var parentRef = item;
        while (parentRef !== null) {
          parentRef.selected = true;
          self.selectedItems.push(parentRef);
          parentRef = parentRef.parent;
        }
      };
    };

    $scope.$watch(function () {
      return $location.path();
    }, function (newVal, oldVal) {
      if (self.selectedFromNavMenu == false) {
        var item = self.findItemByUrl ($scope.menu, newVal);
        if (item)
          $timeout (function () { $scope.select (item); });
      }
      self.selectedFromNavMenu = false;
    });

    // searchbar
    self.showSearchBar = function ($e) {
      $e.stopPropagation();
      $global.set('showSearchCollapsed', true);
    };

    $scope.$on('globalStyles:changed:showSearchCollapsed', function (event, newVal) {
      self.style_showSearchCollapsed = newVal;
    });

    self.goToSearch = function () {
      $location.path('/extras-search')
    };

  }// END CLASS


  angular.module('iscNavContainer')
      .controller('iscNavigationController', iscNavigationController );

})();
