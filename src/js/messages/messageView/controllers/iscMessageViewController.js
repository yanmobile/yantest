/**
 * Created by douglasgoodman on 2/27/15.
 */

(function(){

  'use strict';

  iscMessageViewController.$inject = [ '$log', '$state', 'iscMessagesApi', 'iscMessageViewModel', 'iscMessagesModel', 'iscStateManager' ];

  function iscMessageViewController( $log, $state, iscMessagesApi, iscMessageViewModel, iscMessagesModel, iscStateManager ){
    //$log.debug( 'iscMessageViewController LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;

    self.messageViewModel = iscMessageViewModel;
    self.stateManager = iscStateManager;

    self.mail = iscMessageViewModel.getSelectedMail();
    self.mailReply;

    self.showEmergencyWarning = iscMessagesModel.getShowEmergencyWarning();

    // ----------------------------
    // functions
    // ----------------------------
    self.init = function(){
      self.mailReply = iscMessageViewModel.initReply( self.mail );
    };

    self.sendEnabled = function(){
      return iscMessageViewModel.replyIsValid();
    };

    self.closeEmergencyWarning = function(){
      //$log.debug( 'iscMessagesController.closeWarning' );
      self.showEmergencyWarning = iscMessagesModel.closeEmergencyWarning();
    };

    self.sendReply = function(){
      $log.debug( 'iscMessagesController.sendReply', self.mail.$$parentSref );
      iscMessagesApi.sendReply().then( function( data ){
        $state.go( self.mail.$$parentSref );
      })
    };

    self.init();


  }// END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module('iscMessages')
      .controller('iscMessageViewController', iscMessageViewController );

})();
