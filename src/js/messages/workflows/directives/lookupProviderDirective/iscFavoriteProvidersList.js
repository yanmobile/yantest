/**
 * Created by douglas goodman on 3/17/15.
 */

(function(){
  'use strict';

  iscFavoriteProvidersList.$inject = [ '$log'];

  function iscFavoriteProvidersList( $log ){
//    //$log.debug( 'iscFavoriteProvidersList LOADED');

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
        favoritesList: '=',
        onSelect: '&'
      },
      link: link,
      templateUrl: 'messages/workflows/directives/lookupProvider/iscFavoriteProvidersList.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){
      //$log.debug( 'iscFavoriteProvidersList.link, favoritesList', scope.favoritesList);
      scope.onToggle = function( item ){
        scope.radioSelect( item ); // call the select on the radioButtonGroup directive
        scope.onSelect( {item: item} );
      }
    }


  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'iscMessages' )
      .directive( 'iscFavoriteProvidersList', iscFavoriteProvidersList );

})();
