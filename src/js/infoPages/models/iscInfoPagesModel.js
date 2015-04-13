
/**
 * Created by douglasgoodman on 1/5/15.
 */
(function () {
  'use strict';

  iscInfoPagesModel.$inject = ['$log'];

  function iscInfoPagesModel( $log ){

    // --------------------
    // vars
    // --------------------

    // the data returned from the server
    var data;

    // forgot password or user name
    var forgotData = {
      Username: 'adameveryman',
      Email: 'adam.everyman@gmail.com',
      SendUsername: false,
      $$forgotPassword: false
    };

    // activate the account
    var activateOptions = {
      AccessCode: '123',
      Birthday: null
    };

    // enroll new user
    var enrollOptions = {
      FirstName: 'Adam',
      MiddleName: 'Every',
      LastName: 'Man',
      Sex: 'M',
      MothersMaidenName: 'Somewomen',
      SSN: '123456789',
      DateOfBirth: '1965-12-15',
      Address1: '105 Main Street',
      City: 'Somewhere',
      State: 'MA',
      ZipCode: '02345',
      Email: 'adameveryman@gmail.com',
      TermsAccepted: false,
      $$showSSN: false,
      $$inputType: 'password'
    };

    var genderOptions = [
      {label:'ISC_FEMALE', value:'F'},
      {label:'ISC_MALE', value:'M'}
    ];

    // --------------------
    // class factory
    // --------------------

    var service = {
      forgotData: forgotData,
      activateOptions: activateOptions,
      enrollOptions: enrollOptions,
      genderOptions: genderOptions,

      setData: setData,
      getHsInfo: getHsInfo,
      getLegalInfo: getLegalInfo,
      getTermsInfo: getTermsInfo,
      getTermsAndConditions: getTermsAndConditions,
      getStates: getStates
    };

    return service;

    // --------------------
    // functions
    // --------------------

    function setData( val ) {
      data = val;
    }

    function getHsInfo() {
      return data.hsInfoContent;
    }

    function getLegalInfo() {
      return data.legalInfo;
    }

    function getTermsInfo() {
      return data.termsInfo;
    }

    function getTermsAndConditions(){
      return data.termsAndConditions;
    }

    function getStates(){
      return data.states;
    }

  }// END CLASS

  // --------------------
  // inject
  // --------------------

  angular.module('iscInfoPages')
    .factory('iscInfoPagesModel', iscInfoPagesModel);

})();
