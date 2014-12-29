/**
 * Created by douglasgoodman on 12/9/14.
 */
(function(){
  'use strict';

  iscInfoPopupController.$inject = ['$log', '$modalInstance', 'title', 'message'];

  function iscInfoPopupController( $log, $modalInstance, title, message ){

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;

    self.title = title;
    self.message = message;


    // ----------------------------
    // functions
    // ----------------------------

    self.ok = function () {
      //$log.debug( 'iscInfoPopupController.ok');
      $modalInstance.close();
    };

    self.cancel = function () {
      //$log.debug( 'iscInfoPopupController.cancel');
      $modalInstance.dismiss('cancel');
    };


  }// END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .controller( 'iscInfoPopupController', iscInfoPopupController );
})();
