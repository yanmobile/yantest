/**
 * Created by douglasgoodman on 2/10/15.
 */

(function(){

  'use strict';
  // ----------------------------
  // injection
  // ----------------------------
  angular.module('iscNavContainer')
    .controller('iscAlertController', iscAlertController);

  /* @ngInject */
  function iscAlertController( devlog, iscAlertModel, iscSessionModel ){
    devlog.channel('iscAlertController').debug( 'iscAlertController LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;


    // ----------------------------
    // functions
    // ----------------------------

    self.ok = function () {
      devlog.channel('iscAlertController').debug( 'iscAlertController.ok');
      if( self.getOptions().okCallback ){
        devlog.channel('iscAlertController').debug( '...shazam');
        self.getOptions().okCallback();
      }
    };

    self.cancel = function () {
      devlog.channel('iscAlertController').debug( 'iscAlertController.cancel');
      if( self.getOptions().cancelCallback ){
        devlog.channel('iscAlertController').debug( '...shazam');
        self.getOptions().cancelCallback();
      }
    };

    self.showFooter = function () {
      return self.getOptions().showCancel || self.getOptions().showOk;
    };

    // ----------------
    self.getOptions = function(){
      return iscAlertModel.getOptions();
    };

    // ----------------
    self.getRemainingSessionTime = function(){
      return iscSessionModel.getRemainingTime();
    };

  }// END CLASS



})();
