(function(){

  'use strict';

  iscMyAccountController.$inject = [ '$log', 'iscMyAccountModel' ];

  function iscMyAccountController( $log, iscMyAccountModel ){
//    //$log.debug( 'iscMyAccountController LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;

    self.model = iscMyAccountModel;

    self.historyItems = self.model.getHistory();
    self.accountSummary = self.model.getAccountSummary();
    self.proxies = self.model.getAccountProxies();
    self.changePasswordData = self.model.getChangePasswordData();

    self.showPasswordPagePassword = false;
    self.showEmailPagePassword = false;



    // ----------------------------
    // functions
    // ----------------------------

    self.changePassword = function(){
      //$log.debug( 'iscMyAccountController.changePassword');
    };

    self.changeEmail = function(){
      //$log.debug( 'iscMyAccountController.changeEmail');
    }
  }


  angular.module('iscMyAccount')
      .controller('iscMyAccountController', iscMyAccountController );

})();
