/**
 * Created by douglas goodman on 2/26/15.
 */

(function(){
  'use strict';

  iscRadio.$inject = [ '$log', 'iscRadioGroupHelper'];

  function iscRadio( $log, iscRadioGroupHelper ){
//    //$log.debug( 'iscRadio LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      transclude: true,
      scope: {
        onToggle: '&',
        radioGroup: '=',
        radioItem: '='
      },
      link: link,
      templateUrl: 'common/svg/isc-radio.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){

      scope.toggle = function(){
        iscRadioGroupHelper.radioSelect( scope.radioItem, scope.radioGroup );
      };
    }

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.common' )
      .directive( 'iscRadio', iscRadio );

})();
