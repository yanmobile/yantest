/**
 * Created by douglas goodman on 3/13/15.
 */

(function(){
  'use strict';

  iscSelectAlert.$inject = [ '$log'];

  function iscSelectAlert( $log ){
//    //$log.debug( 'iscSelectAlert LOADED');

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
        foo: '='
      },
      link: link,
      templateUrl: ''
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

  angular.module( 'iscMessages' )
      .directive( 'iscSelectAlert', iscSelectAlert );

})();
