/**
 * Created by douglasgoodman on 12/8/14.
 */

(function(){
  'use strict';

  /* @ngInject */
  function iscArrayStringFilter( $log, $filter ){//jshint ignore:line
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

      array.sort();

      var string = '';
      var len = array.length;
      array.forEach( function( item, idx ){
        string += item.toString();
        if( idx < (len-1) ){
          string += ', ';
        }

      });

      return string;
    }


  }//END CLASS
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.filters' )
      .filter( 'arrayString', iscArrayStringFilter );

})();
