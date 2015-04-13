/**
 * Created by douglas goodman on 3/17/15.
 */

(function(){
  'use strict';

  iscSelectedProvider.$inject = [ '$log'];

  function iscSelectedProvider( $log ){
//    //$log.debug( 'iscSelectedProvider LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      replace: true,
      scope: {
        selectedProvider: '=',
        searchProviders: '&'
      },
      link: link,
      templateUrl: 'messages/workflows/directives/lookupProvider/iscSelectedProvider.html'
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
      .directive( 'iscSelectedProvider', iscSelectedProvider );

})();
