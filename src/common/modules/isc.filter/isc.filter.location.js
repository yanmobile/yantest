/**
 * Created by trevor hudson on 10/16/15.
 */

( function () {
  'use strict';
  // 2.16.840.1.113883.3.86 is an InterSystems code that represents null
  var iscNullValCode = 2.16;

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.filters' )
    .filter( 'iscLocation', iscLocation );

  /* @ngInject */
  function iscLocation( $filter ) {

    return function ( locationString, showMessage ) {

      if ( !locationString ) {
        return '';
      }
      else if ( parseFloat( locationString ) === iscNullValCode ) {
        return !!showMessage ? $filter( 'translate' )( 'ISC_UNKNOWN_LOCATION' ) : '';
      }

      return locationString;
    };

  }//END CLASS

} )();
