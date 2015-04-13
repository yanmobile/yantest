/**
 * Created by douglasgoodman on 2/10/15.
 */

(function(){

  'use strict';

  iscAlertController.$inject = ['$log', 'iscAlertModel'];

  function iscAlertController( $log, iscAlertModel ){
    //$log.debug( 'iscAlertController LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;


    // ----------------------------
    // functions
    // ----------------------------

    self.ok = function () {
      //$log.debug( 'iscAlertController.ok');
      if( self.getOptions().okCallback ){
        //$log.debug( '...shazam');
        self.getOptions().okCallback();
      }
    };

    self.cancel = function () {
      //$log.debug( 'iscAlertController.cancel');
      if( self.getOptions().cancelCallback ){
        //$log.debug( '...shazam');
        self.getOptions().cancelCallback();
      }
    };

    self.showFooter = function () {
      return self.getOptions().showCancel || self.getOptions().showOk;
    };

    // ----------------

    self.getOptions = function(){
      return iscAlertModel.getOptions()
    }

  }// END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module('iscNavContainer')
    .controller('iscAlertController', iscAlertController);

})();
