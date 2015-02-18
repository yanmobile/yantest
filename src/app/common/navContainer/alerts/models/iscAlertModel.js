/**
 * Created by dgoodman on 2/3/15.
 */
/**
 * Created by douglasgoodman on 2/3/15.
 */

(function () {
  'use strict';

  iscAlertModel.$inject = ['$log'];

  function iscAlertModel( $log ){
//    $log.debug( 'iscAlertModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------
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

    var OK_BTN_KEYS = {
      iscResponseError: 'ISC_OK',
      iscNotAuthenticated: 'ISC_OK',
      iscNotAuthorized: 'ISC_OK',
      iscSessionTimeoutWarning: 'Continue Working',
      iscSessionTimeout: 'ISC_OK'
    };

    var CANCEL_BTN_KEYS = {
      iscResponseError: 'ISC_CANCEL',
      iscNotAuthenticated: 'ISC_CANCEL',
      iscNotAuthorized: 'ISC_CANCEL',
      iscSessionTimeoutWarning: 'Close Session',
      iscSessionTimeout: 'ISC_CANCEL'
    };

    var options = {
      title: 'none',
      message: 'none',
      serverResponse: 'none',

      showOk: false,
      okCallback: null,
      okTextKey: 'ISC_OK',

      showCancel: false,
      cancelCallback: null,
      cancelTextKey: 'ISC_CANCEL'
    };

    // ----------------------------
    // class factory
    // ----------------------------
    var model = {
      getOptions: getOptions,
      setOptions: setOptions,
      setOptionsByType: setOptionsByType
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------
    function getOptions(){
      return options;
    }

    function setOptions( val ){
      options = val;
    }

    function setOptionsByType( type, response, okCallback, cancelCallback  ){
      //$log.debug( 'iscAlertModel.setOptions');
      options = {
        title: ALERT_TITLES[ type ],
        message: ALERT_MESSAGES[ type ],
        serverResponse: getServerResponse( response ),

        showOk: false,
        okCallback: okCallback,
        okTextKey: OK_BTN_KEYS[ type ],

        showCancel: false,
        cancelCallback: cancelCallback,
        cancelTextKey: CANCEL_BTN_KEYS[ type ]
      };

      if( type === 'iscSessionTimeoutWarning' ){
        options.showOk = true;
        options.showCancel = true;
      }

      //$log.debug( '...options',options);
      return options;
    }

    function getServerResponse( response ) {
      //$log.debug( '...response',response);
      var naMessage = '\n No further information is available.';

      if( response ){
        if( response.data && response.data.error ){
          return response.data.error
        }
        else{
          return naMessage; // if there is a response, but no data, give this message
        }
      }
      else{
        return ''; // if there is no server response, dont append anything
      }
    }

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module('iscNavContainer')
    .factory('iscAlertModel', iscAlertModel);

})();

