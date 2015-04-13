(function(){

  'use strict';

  iscHomeController.$inject = [ '$log', '$rootScope', 'AUTH_EVENTS', '$scope',  '$translate', 'iscHomeModel', 'iscSessionModel', 'iscAuthenticationApi' ];

  function iscHomeController( $log, $rootScope, AUTH_EVENTS, $scope, $translate, iscHomeModel, iscSessionModel, iscAuthenticationApi ){
//    //$log.debug( 'iscHomeController LOADED');

    var self = this;

    // -------------------------
    // model

    self.model = iscHomeModel;
    self.sessionModel = iscSessionModel;

    // -------------------------
    // services

    self.dispatchEvent = function(){
      $rootScope.$broadcast( AUTH_EVENTS.sessionTimeoutWarning );
    };


    // -------------------------
    // translation

    self.language = 'en_US';

    self.translate = function(){
      //$log.debug( 'iscHomeController.translate');
      (self.language === 'es_ES') ? self.language = 'en_US' : self.language = 'es_ES';
      $translate.use( self.language );
    };

    // -------------------------
    // patient data

    self.patientData = self.model.getPatientData();
    self.panelData = self.model.getPanelData();

    // -------------------------
    // log in

    // used for passing credentials to the login api
    // the credentials, once login success, are stored in the iscSessionModel
    self.credentials = {
      Username: 'adameveryman',
      Password: 'Password1a'
    };

    self.login = function(){
      iscAuthenticationApi.login( self.credentials );
    };


    // -------------------------
    // other

    self.currentTitle = '-1';

    self.scrollStick = false;

    self.setButtonClass = function( atTop ){
      //$log.debug( 'iscHomeController.setButtonClass', atTop );

      var scroller = angular.element( document.querySelector( '#fixed-scroll' ) );
      self.scrollStick = atTop;

      //$log.debug( '...scroller', scroller );

      if( atTop ){
        scroller.removeClass('isc-scroll-stick-container');
        scroller.addClass('isc-scroll-stick-container-fixed');
      }
      else{
        scroller.addClass('isc-scroll-stick-container');
        scroller.removeClass('isc-scroll-stick-container-fixed');
      }

      $scope.$apply();
    };


  }// END CLASS


  // -------------------------
  // inject
  // -------------------------
  angular.module('iscHome')
      .controller('iscHomeController', iscHomeController );

})();
