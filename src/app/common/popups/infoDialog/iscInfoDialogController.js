/**
 * Created by douglasgoodman on 12/9/14.
 */
(function(){
  'use strict';

  iscInfoDialogController.$inject = ['$log', '$modalInstance', 'title', 'message'];

  function iscInfoDialogController( $log, $modalInstance, title, message ){

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
      //$log.debug( 'iscInfoDialogController.ok');
      $modalInstance.close();
    };

    self.cancel = function () {
      //$log.debug( 'iscInfoDialogController.cancel');
      $modalInstance.dismiss('cancel');
    };


  }// END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'isc.common' )
      .controller( 'iscInfoDialogController', iscInfoDialogController );
})();
