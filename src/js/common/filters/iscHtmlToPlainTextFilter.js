/**
 * Created by douglasgoodman on 12/8/14.
 */

(function(){
  'use strict';

  iscHtmlToPlainText.$inject = [ '$log' ];

  function iscHtmlToPlainText( $log ){
//    //$log.debug( 'iscHtmlToPlainText LOADED');


    // ----------------------------
    // class factory
    // ----------------------------

    return convert;

    // ----------------------------
    // functions
    // ----------------------------

    /**
     * returns plain text from an html string
     */
    function convert( text ){
      return String( text ).replace(/<[^>]+>/gm, '');
    }


  };//END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
      .filter( 'iscHtmlToPlainText', iscHtmlToPlainText );

})();
