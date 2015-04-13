/**
 * Created by douglas goodman on 2/27/15.
 */

(function(){
  'use strict';

  iscMailMessageService.$inject = [ '$log', 'iscMessagesModel' ];

  function iscMailMessageService( $log, iscMessagesModel ){
    //$log.debug( 'iscMailMessageService.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // wrapped in an obj for javascripty reasons
    var selectedParams = {
      oneSelected: false,
      allSelected: false
    };

    // ----------------------------
    // class factory
    // ----------------------------
    var service = {
      selectedParams: selectedParams,
      onSelectAll: onSelectAll,
      onToggleMessage: onToggleMessage,
      setSelectedParams: setSelectedParams,
      someMessageIsSelected: someMessageIsSelected,
      getReadMessageCount: getReadMessageCount
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function onSelectAll( val ){
      //$log.debug( 'iscMailMessageService.onSelectAll' );
      //$log.debug( '...iscMessagesModel.getInbox()',iscMessagesModel.getInbox());

      val = !!val; // make sure its a boolean

      iscMessagesModel.getCurrentMail().forEach( function( message ){
        message.$$selected = val;
      });

      //$log.debug( '...iscMessagesModel.getInbox()',iscMessagesModel.getInbox());

      selectedParams.allSelected = val;
      selectedParams.oneSelected = val;
    }

    function onToggleMessage(){
      //$log.debug( 'iscMailMessageService.onToggleMessage' );
      setSelectedParams();
    }

    function setSelectedParams(){
      //$log.debug( 'iscMailMessageService.setSelectedParams' );
      var oneIsUnselected = false;
      var oneIsSelected = false;

      iscMessagesModel.getCurrentMail().forEach( function( message ){
        if( !message.$$selected ){
          oneIsUnselected  = true;
        }
        else{
          oneIsSelected = true;
        }
      });

     // if even one is selected, oneSelected should be true
      selectedParams.oneSelected = oneIsSelected;

      // if not one is unselected, allSelected should be true
      selectedParams.allSelected = !oneIsUnselected;

      //$log.debug( '...options.allSelected',options.allSelected);
    }

    function someMessageIsSelected(){
      return selectedParams.oneSelected;
    }

    function getReadMessageCount(){
      var count = 0;
      iscMessagesModel.getCurrentMail().forEach( function( message ){
        if( message.IsRead === 1){
          count++;
        }
      });

      return count;
    }

  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'iscMessages' )
      .factory( 'iscMailMessageService', iscMailMessageService );

})();

