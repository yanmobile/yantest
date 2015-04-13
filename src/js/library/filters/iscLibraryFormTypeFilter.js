/**
 * Created by douglasgoodman on 12/8/14.
 */

(function(){
  'use strict';

  iscLibraryFormTypeFilter.$inject = [ '$log'];

  function iscLibraryFormTypeFilter( $log ){
//    //$log.debug( 'iscLibraryFormTypeFilter LOADED');

    // ----------------------------
    // vars
    // ----------------------------


    // ----------------------------
    // class factory
    // ----------------------------

    return getTitleFromType;

    // ----------------------------
    // functions
    // ----------------------------

    function getTitleFromType( type ){
      var title = '';

      switch( type ){

        case 'GEN':
          return 'Hospital and Provider Information';

        case 'IRS':
          return 'Tax and Insurance Forms';

        case 'CORP':
          return 'Health History Forms';
      }
      return title;
    }


  };//END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'iscLibrary' )
      .filter( 'iscLibraryFormTypeFilter', iscLibraryFormTypeFilter );

})();
