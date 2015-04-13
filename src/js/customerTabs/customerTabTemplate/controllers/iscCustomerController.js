(function(){

  'use strict';

  iscCustomerTabController.$inject = [ '$log', '$scope', 'iscUiHelper', 'iscCustomConfigService', 'iscCustomerTabModel', 'AUTH_EVENTS' ];

  function iscCustomerTabController( $log, $scope, iscCustomConfigService, iscUiHelper, iscCustomerTabModel, AUTH_EVENTS ){
//    //$log.debug( 'iscCustomerTabController LOADED');

    var self = this;

    // -----------------------------
    // models and services
    // -----------------------------
    self.model = iscCustomerTabModel;
    self.iscUiHelper = iscUiHelper;

    // -----------------------------
    // secondary nav
    // -----------------------------
    self.secondaryNav = _.toArray( iscCustomConfigService.getCustomerTabSecondaryNav() );

    // -----------------------------
    // translation params
    // -----------------------------
    self.translationParams = {
    };

    // -----------------------------
    // listeners
    // -----------------------------


  }//END CLASS

  angular.module('iscCustomerTab')
      .controller('iscCustomerTabController', iscCustomerTabController );

})();
