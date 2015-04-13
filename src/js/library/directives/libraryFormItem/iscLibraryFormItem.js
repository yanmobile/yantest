/**
 * Created by douglasgoodman on 12/8/14.
 */
(function(){
  'use strict';

  iscLibraryFormDirective.$inject = ['$log'];

  function iscLibraryFormDirective( $log ){

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      scope: {
        formItem: '=',
        even: '='
      },

      link: link,
      templateUrl: 'library/directives/libraryFormItem/iscLibraryFormItem.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){
    }
  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscLibrary' )
      .directive( 'iscLibraryFormDirective', iscLibraryFormDirective );

})();
