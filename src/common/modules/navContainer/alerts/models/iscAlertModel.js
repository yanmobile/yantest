/**
 * Created by dgoodman on 2/3/15.
 */
/**
 * Created by douglasgoodman on 2/3/15.
 */

(function () {
  'use strict';

  /* @ngInject */
  function iscAlertModel( devlog ){//jshint ignore:line
//    $log.debug( 'iscAlertModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var ALERT_TITLES = {
      iscResponseError: 'ISC_ALERT_RESPONSE_ERROR',
      iscNotAuthenticated: 'ISC_ALERT_NOT_AUTHENTICATED',
      iscNotAuthorized: 'ISC_ALERT_NOT_AUTHORIZED',
      iscSessionTimeoutWarning: 'ISC_ALERT_SESSION_TIMEOUT_WARNING',
      iscSessionTimeout: 'ISC_ALERT_SESSION_TIMEOUT'
    };

    var ALERT_MESSAGES = {
      iscResponseError: 'ISC_ALERT_RESPONSE_ERROR_MSG',
      iscNotAuthenticated: 'ISC_ALERT_NOT_AUTHENTICATED_MSG',
      iscNotAuthorized: 'ISC_ALERT_NOT_AUTHORIZED_MSG',
      iscSessionTimeoutWarning: 'ISC_ALERT_SESSION_TIMEOUT_WARNING_MSG',
      iscSessionTimeout: 'ISC_ALERT_SESSION_TIMEOUT_MSG'
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
      devlog.channel('iscAlertModel').debug( 'iscAlertModel.setOptions');
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

      devlog.channel('iscAlertModel').debug( '...options',options);
      return options;
    }

    function getServerResponse( response ) {
      devlog.channel('iscAlertModel').debug( '...response',response);
      var naMessage = '\n No further information is available.';

      if( response ){
        if( response.data && response.data.error ){
          return response.data.error;
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

