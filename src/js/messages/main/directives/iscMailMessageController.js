/**
 * Created by douglasgoodman on 2/27/15.
 */

(function(){

  'use strict';

  iscMailMessageController.$inject = [ '$log', '$scope', '$state', 'iscStateManager' ];

  function iscMailMessageController( $log, $scope, $state, iscStateManager ){
    //$log.debug( 'iscMailMessageController LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;

    self.mail = $scope.mail;

    // for the outboxes, show To, for inboxes, show From
    self.actor = $scope.showTo ? self.mail.To : self.mail.From;

    // ----------------------------
    // functions
    // ----------------------------

    self.toggleSelected = function( val ){
      //$log.debug( 'iscMailMessageController.toggleSelected', val );

      self.mail.$$selected = val;
      $scope.onToggleMessage( {mail: self.mail} );

      //$log.debug( '...$$selected', self.mail );
    };

    self.onSelectMessage = function(){
      //$log.debug( 'iscMailMessageController.onSelectMessage', self.mail );
      iscStateManager.setParentSref( self.mail.$$parentSref );
      $state.go( 'index.messages.message', {id: self.mail.id})
    };


  }// END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module('iscMessages')
      .controller('iscMailMessageController', iscMailMessageController );

})();
