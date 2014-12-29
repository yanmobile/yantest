/**
 * Created by douglasgoodman on 11/19/14.
 */

(function(){
  'use strict';

  iscPopupHelper.$inject = [ '$log', '$modal' ];

  function iscPopupHelper( $log, $modal ){
//    //$log.debug( 'iscPopupHelper LOADED' );

    // ----------------------------
    // vars
    // ----------------------------

    var MODAL_SIZES = {
      'sm' : 'sm',
      'md' : 'md',
      'lg' : 'lg'
    };

    var MODAL_TYPES = {
      'info' : 'info',
      'dialog' : 'dialog'
    };

    var MODAL_TITLES = {
      iscLoginError: 'Server Error',
      iscNotAuthenticated: 'Not Logged In',
      iscNotAuthorized: 'Not Authorized',
      iscSessionTimeoutWarning: 'Your Session is about to expire',
      iscSessionTimeout: 'Your Session has expired'
    };

    var MODAL_MESSAGES = {
      iscLoginError: 'Unable to contact the server at this time. Please try later.',
      iscNotAuthenticated: 'Please log in to view this page.',
      iscNotAuthorized: 'You are not authorized to view this page. Please contact your system administrator to check your permissions.',
      iscSessionTimeoutWarning: 'Your session is about to expire. Click Ok to continue or Cancel to log out.',
      iscSessionTimeout: 'Your session has expired. Please click Login to continue.'
    };

    var modalSize = MODAL_SIZES.sm;
    var modalTitle = '';
    var modalMessage = '';
    var onOk = null;
    var onCancel = null;

    var infoPopup = {
      templateUrl: '/app/common/popups/infoPopup/iscInfoPopup.html',
      controller: 'iscInfoPopupController as modalCtrl',
      size: function(){
        return modalSize;
      },
      resolve:{
        title: function(){
          return modalTitle;
        },
        message: function(){
          return modalMessage;
        }
      }
    };

    var infoDialog = {
      templateUrl: '/app/common/popups/infoDialog/iscInfoDialog.html',
      controller: 'iscInfoDialogController as modalCtrl',
      size: function(){
        return modalSize;
      },
      resolve:{
        title: function(){
          return modalTitle;
        },
        message: function(){
          return modalMessage;
        },
        cancelFunc: function(){
          return onCancel;
        },
        okFunc: function(){
          return onOk;
        }
      }
    };

    // ----------------------------
    // class factory
    // ----------------------------

    var service  = {
      openPopup: openPopup,
      openDialog: openDialog
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function  openPopup( modalType ){
      //$log.debug( 'iscPopupHelper.openPopup');
      //$log.debug( '...modalType: ' + modalType );

      modalSize = MODAL_SIZES.sm;
      modalTitle = MODAL_TITLES[ modalType ];
      modalMessage = MODAL_MESSAGES[ modalType ];

      var modalInstance = $modal.open(
        infoPopup
      );

      // handle ok / cancel events
      modalInstance.result.then(
        function(){
          //$log.debug( 'Modal ok');
        },

        function(){
          //$log.debug( 'Modal cancel');
        }
      )
    };

    function  openDialog( modalType, okFunc, cancelFunc ){
      //$log.debug( 'iscPopupHelper.openDialog');
      //$log.debug( '...modalType: ' + modalType );
      //$log.debug( '...okFunc: ' + okFunc );
      //$log.debug( '...cancelFunc: ' + cancelFunc );

      modalSize = MODAL_SIZES.sm;
      modalTitle = MODAL_TITLES[ modalType ];
      modalMessage = MODAL_MESSAGES[ modalType ];
      onOk = okFunc;
      onCancel = cancelFunc;

      var modalInstance = $modal.open(
        infoDialog
      );

      // handle ok / cancel events
      modalInstance.result.then(
        function(){
          //$log.debug( 'Modal ok');
          onOk()
        },

        function(){
          //$log.debug( 'Modal cancel');
          onCancel();
        })
    };


  }// END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .factory( 'iscPopupHelper', iscPopupHelper );
})();
