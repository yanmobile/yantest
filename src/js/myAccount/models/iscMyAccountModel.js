/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscMyAccountModel.$inject = [ '$log'];

  function iscMyAccountModel( $log ){
    //$log.debug( 'iscMyAccountModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var historyEvents;

    var accountSummary;

    var accountProxies;

    var changePasswordData = {
      Password: 'HOOHA',
      NewPassword: null,
      ConfirmPassword: null
    };

    // ----------------------------
    // class factory
    // ----------------------------
    var model = {
      getHistory: getHistory,
      setHistory: setHistory,

      getAccountSummary: getAccountSummary,
      setAccountSummary: setAccountSummary,

      getAccountProxies: getAccountProxies,
      setAccountProxies: setAccountProxies,

      getChangePasswordData: getChangePasswordData,
      setChangePasswordData: setChangePasswordData,
      passwordIsValid: passwordIsValid
    };

    return model;


    // ----------------------------
    // functions
    // ----------------------------

    // --------------
    // history
    function getHistory(){
      return historyEvents;
    }

    function setHistory( val ){
      historyEvents = val;
    }


    function getAccountProxies(){
      return accountProxies;
    }

    function setAccountProxies( val ){
      accountProxies = val;
    }


    //account summary

    function getAccountSummary(){



      return accountSummary;
    }

    function setAccountSummary(val){



      accountSummary = val;
    }

    // --------------
    // change password
    function getChangePasswordData(){
      return changePasswordData;
    }

    function setChangePasswordData( val ){
      changePasswordData = val;
    }

    function passwordIsValid(){
      //$log.debug( 'iscMyAccountModel.passwordIsValid');
      var exists =  !!changePasswordData.NewPassword;
      var confirmed = (changePasswordData.NewPassword === changePasswordData.ConfirmPassword);

      //$log.debug( '......exists',exists);
      //$log.debug( '...confirmed',confirmed);

      return exists && confirmed;
    }

  } // END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'iscMyAccount' )
      .factory( 'iscMyAccountModel', iscMyAccountModel );

})();
