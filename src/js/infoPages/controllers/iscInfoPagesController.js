(function(){

  'use strict';

  iscInfoPagesController.$inject = [ '$log', '$window', 'iscInfoPagesModel', 'iscEnrollApi', 'iscForgotUsernameOrPasswordApi' ];

  function iscInfoPagesController( $log, $window, iscInfoPagesModel, iscEnrollApi, iscForgotUsernameOrPasswordApi ){
//    //$log.debug( 'iscInfoPagesController LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;

    // ----------------------------
    // credentials to the activate account api
    self.activateOptions = iscInfoPagesModel.activateOptions;

    // credentials to the forgot username / password api
    self.forgotData = iscInfoPagesModel.forgotData;

    // credentials to the enroll api
    self.enrollOptions = iscInfoPagesModel.enrollOptions;

    // options for the dropdown
    self.genderOptions = iscInfoPagesModel.genderOptions;

    // ----------------------------
    // text for pages
    self.hsInfo = iscInfoPagesModel.getHsInfo();
    self.legalInfo = iscInfoPagesModel.getLegalInfo();
    self.termsInfo = iscInfoPagesModel.getTermsInfo();
    self.termsAndConditions = iscInfoPagesModel.getTermsAndConditions();
    self.states = iscInfoPagesModel.getStates();

    // ----------------------------
    // datepicker on enroll and activate
    self.dateFormat = 'yyyy-MM-dd';
    self.dateOpen = false;

    self.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    // ----------------------------
    // functions
    // ----------------------------

    self.openDate = function( evt ) {
      //$log.debug( 'iscInfoPagesController.openDate');
      evt.preventDefault();
      evt.stopPropagation();

      self.dateOpen = true;
    };

    self.closeDate = function( evt ) {
      //$log.debug( 'iscInfoPagesController.closeDate');
      evt.preventDefault();
      evt.stopPropagation();

      self.dateOpen = false;
    };

    // ----------------------------
    self.submitForgotData = function(){
      //$log.debug( 'iscInfoPagesController.submitForgotData');

      if( self.forgotData.$$forgotPassword ){
        iscForgotUsernameOrPasswordApi.forgotpassword( self.forgotData );
      }
      else{
        iscForgotUsernameOrPasswordApi.forgotusername( self.forgotData );
      }
    };

    self.getForgotSubmitDisabled = function( invalid ){
      //$log.debug( 'iscInfoPagesController.getForgotSubmitDisabled', invalid);

      // form must be valid, and you must have checked either forgotPassword or forgotUsername
      return invalid || ( !self.forgotData.$$forgotPassword && !self.forgotData.SendUsername )
    };

    // ----------------------------
    self.enroll = function(){
      //$log.debug( 'iscInfoPagesController.enroll');
      iscEnrollApi.enrollSelf( self.enrollOptions );
    };

    self.acceptTermsAndConditions = function(){
      //$log.debug( 'iscInfoPagesController.acceptTermsAndConditions');
      self.enrollOptions.TermsAccepted = true;
    };

    // ----------------------------
    self.activateAccount = function(){
      //$log.debug( 'iscInfoPagesController.activateAccount');
    };

    // ----------------------------
    // back button
    self.back = function(){
      $window.history.back();
    };

  } // END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module('iscInfoPages')
      .controller('iscInfoPagesController', iscInfoPagesController );

})();
