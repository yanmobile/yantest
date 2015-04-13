/**
 * Created by douglas goodman on 3/13/15.
 */

(function(){
  'use strict';

  iscOptionsPopup.$inject = [ '$log'];

  function iscOptionsPopup( $log ){
//    //$log.debug( 'iscOptionsPopup LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      replace: true,
      transclude: false,
      scope: {
        showPopup: '=',
        listItems: '=',
        title: '=',
        onClose: '&',
        onSelect: '&'
      },
      link: link,
      templateUrl: 'app/directives/iscOptionsPopup.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){
    }


  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'iscHsCommunityAngular' )
      .directive( 'iscOptionsPopup', iscOptionsPopup );

})();
