/**
 * Created by douglasgoodman on 12/8/14.
 */

(function(){
  'use strict';

  iscArrayStringFilter.$inject = [ '$log', '$filter' ];

  function iscArrayStringFilter( $log, $filter ){
//    //$log.debug( 'iscArrayStringFilter LOADED');

    // ----------------------------
    // vars
    // ----------------------------


    // ----------------------------
    // class factory
    // ----------------------------

    return getArrayString;

    // ----------------------------
    // functions
    // ----------------------------


    function getArrayString( array ){
      //$log.debug('iscArrayStringFilter.getArrayString');
      //$log.debug('...array', array);
      //$log.debug('...array', typeof array);

      if( Object.prototype.toString.call( array ) !== '[object Array]' ){
        return '';
      }

      var string = '';
      var len = array.length;
      array.forEach( function( item, idx ){
        string += item.toString();
        if( idx < (len-1) )
          string += ', ';
      });

      return string;
    }


  }//END CLASS
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
      .filter( 'arrayString', iscArrayStringFilter );

})();
