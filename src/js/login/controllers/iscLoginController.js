(function(){

  'use strict';

  iscLoginController.$inject = [ '$log', 'iscSessionModel', 'iscAuthenticationApi' ];

  function iscLoginController( $log, iscSessionModel, iscAuthenticationApi ){
//    //$log.debug( 'iscLoginController LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;

    self.sessionModel = iscSessionModel;

    self.translationParams = {
    };

    // used for passing credentials to the login api
    // the credentials, once login success, are stored in the iscSessionModel
    self.credentials = {
      Username: 'adameveryman',
      Password: 'Password1a'
    };

    // ----------------------------
    // functions
    // ----------------------------

    self.login = function( credentials ){
      iscAuthenticationApi.login( credentials );
    };

  }// END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module('iscLogin')
      .controller('iscLoginController', iscLoginController );

})();
