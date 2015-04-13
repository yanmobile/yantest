/**
 * Created by douglas goodman on 3/17/15.
 */

(function(){
  'use strict';

  iscModalPopups.$inject = [ '$log'];

  function iscModalPopups( $log ){
//    //$log.debug( 'iscModalPopups LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      transclude: false,
      scope: {
        showPopup: '=',
        listItems: '=',
        title: '=',
        onClose: '&',
        onSelect: '&'
      },
      link: link,
      templateUrl: 'app/directives/iscModalPopups.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){

      scope.modalSelect = function( selection ){
        scope.onSelect( {selection: selection} );
      }
    }


  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'iscHsCommunityAngular' )
      .directive( 'iscModalPopups', iscModalPopups );

})();
