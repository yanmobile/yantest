/**
 * Created by douglas goodman on 3/17/15.
 */

(function(){
  'use strict';

  iscRadioGroup.$inject = [ '$log', '$parse' ];

  function iscRadioGroup( $log, $parse ){
//    //$log.debug( 'iscRadioGroup LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      link: link
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){
      // pass in the data provider for the radio items, and this handles the selection process
      var radioGroupItems = $parse(attr.iscRadioGroup)(scope);
      //$log.debug( 'iscRadioGroup, items', radioGroupItems );

      scope.radioSelect = function( selectedItem ){
        //$log.debug( 'iscRadioGroup.radioSelect', selectedItem );
        radioGroupItems.forEach( function( item ){
          item.$$selected = false;
        });

        selectedItem.$$selected = true;
      }
    }


  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.common' )
      .directive( 'iscRadioGroup', iscRadioGroup );

})();
