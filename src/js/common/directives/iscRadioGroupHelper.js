/**
 * Created by douglasgoodman on 11/18/14.
 *
 * this is for a group of items with a $$selected property
 * the iscRadio directive handles this functionality internally
 * but if you need to call it in an outside function, this can be used
 */

(function(){
  'use strict';

  iscRadioGroupHelper.$inject = [ '$log' ];

  function iscRadioGroupHelper( $log ){
    //$log.debug( 'iscRadioGroupHelper LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var service = {
      radioSelect: radioSelect
    };

    return service;

    // ----------------------------
    // functions
    // ----------------------------

    function radioSelect( selectedItem, radioGroup ){
      //$log.debug( 'iscRadioGroupHelper.radioSelect', selectedItem, radioGroup );
      var currentState = !!selectedItem.$$selected;
      radioGroup.forEach( function( item ){
        item.$$selected = false;
      });

      selectedItem.$$selected = !currentState;
    }

  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
    .factory( 'iscRadioGroupHelper', iscRadioGroupHelper );

})();
