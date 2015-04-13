/**
 * Created by douglasgoodman on 11/19/14.
 */

(function(){
  'use strict';

  iscAlertService.$inject = [ '$log', 'iscAlertModel' ];

  function iscAlertService( $log, iscAlertModel ){
    //$log.debug( 'iscAlertService LOADED' );

    // ----------------------------
    // vars
    // ----------------------------

    //var MODAL_SIZES = {
    //  'sm' : 'sm',
    //  'md' : 'md',
    //  'lg' : 'lg'
    //};

    //var MODAL_TYPES = {
    //  'info' : 'info',
    //  'dialog' : 'dialog'
    //};

    var ALERT_TITLES = {
      iscResponseError: 'Server Error',
      iscNotAuthenticated: 'Not Logged In',
      iscNotAuthorized: 'Not Authorized',
      iscSessionTimeoutWarning: 'Your Session is about to expire',
      iscSessionTimeout: 'Your Session has expired'
    };

    var ALERT_MESSAGES = {
      iscResponseError: 'Unable to complete your request.',
      iscNotAuthenticated: 'Please log in to view this page.',
      iscNotAuthorized: 'You are not authorized to view this page. Please contact your system administrator to check your permissions.',
      iscSessionTimeoutWarning: 'Your session is about to expire. Click Ok to continue or Cancel to log out.',
      iscSessionTimeout: 'Your session has expired. Please click Login to continue.'
    };

    var OK_BUTTON_KEYS = {
      iscResponseError: 'Unable to complete your request.',
      iscNotAuthenticated: 'Please log in to view this page.',
      iscNotAuthorized: 'You are not authorized to view this page. Please contact your system administrator to check your permissions.',
      iscSessionTimeoutWarning: 'Your session is about to expire. Click Ok to continue or Cancel to log out.',
      iscSessionTimeout: 'Your session has expired. Please click Login to continue.'
    };


    // ----------------------------
    // class factory
    // ----------------------------

    var service  = {
      open: open
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function open( type ){
      //$log.debug( 'iscAlertService open' );

      var options =
      //$log.debug( 'iscAlertService open' );
      iscAlertModel.options = getOptions( type );
    }

    function getOptions( type ){
      var options = {
        title: ALERT_TITLES[ type ],
        message: ALERT_MESSAGES[ type ],

        showOk: false,
        okCallback: null,
        okTextKey: 'ISC_OK',

        showCancel: false,
        cancelCallback: null,
        cancelTextKey: 'ISC_CANCEL'
      };

      return options;
    }

  } // END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscNavContainer' )
      .factory( 'iscAlertService', iscAlertService );
})();
