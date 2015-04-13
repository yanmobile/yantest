/**
 * Created by douglas goodman on 3/17/15.
 */

(function(){
  'use strict';

  iscProviderSearch.$inject = [ '$log'];

  function iscProviderSearch( $log ){
//    //$log.debug( 'iscProviderSearch LOADED');

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
        onClose: '&'
      },
      link: link,
      templateUrl: 'messages/workflows/directives/lookupProvider/providerSearch/iscProviderSearch.html'
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
      .directive( 'iscProviderSearch', iscProviderSearch );

})();
