/**
 * Created by douglasgoodman on 12/8/14.
 */

( function() {
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.filters' )
    .filter( 'arrayString', iscArrayStringFilter );

  /**
   * @description if type is array, it does the same as array.join(", ")
   * @param devlog
   * @returns {getArrayString}
   */
  function iscArrayStringFilter( devlog ) {//jshint ignore:line
    var channel = devlog.channel( 'iscArrayStringFilter' );
    channel.debug( 'iscArrayStringFilter LOADED' );

    return getArrayString;

    // ----------------------------
    // functions
    // ----------------------------

    function getArrayString( array ) {
      channel.debug( 'iscArrayStringFilter.getArrayString' );
      channel.debug( '...array', array );
      channel.debug( '...array', typeof array );

      //does the same as this?
      // if( _.isTypeOf(array, "Array") ){
      //   return array.sort().join(", ");
      // }
      // return '';

      if ( !_.isTypeOf( array, "Array" ) ) {
        return '';
      }

      array.sort();

      var string = '';
      var len = array.length;
      array.forEach( function( item, idx ) {
        string += item.toString();
        if ( idx < ( len - 1 ) ) {
          string += ', ';
        }

      } );

      return string;
    }

  }//END CLASS

} )();
