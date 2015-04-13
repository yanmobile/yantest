/**
 * Created by douglasgoodman on 12/8/14.
 */
(function(){
  'use strict';

  iscLibrarySearchResultItem.$inject = ['$log'];

  function iscLibrarySearchResultItem(){

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      scope: {
        item: '='
      },

      link: link,
      templateUrl: 'library/directives/librarySearchResultItem/iscLibrarySearchResultItem.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){
      if(scope.$last) {
        elem.after('&nbsp;');
      }
    }
  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscLibrary' )
      .directive( 'iscLibrarySearchResultItem', iscLibrarySearchResultItem );

})();