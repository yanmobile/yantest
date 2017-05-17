/**
 * Created by Grace Huo on 5/16/2017, 1:37:30 PM.
 * Format the 9 digit zip-code with dash
 */

( function() {
  'use strict';

  angular
    .module( 'isc.filters' )
    .filter( 'iscZipCode', iscZipCodeFilter );

  /* @ngInject */
  function iscZipCodeFilter( devlog ) {

    var log = devlog.channel( 'iscZipCodeFilter' );
    log.debug( 'LOADED' );

    return iscZipCode;

    // ----------------------------
    // functions
    // ----------------------------

    function iscZipCode( input ) {
      log.debug( '...input', input );

      if ( input && input.length === 9 ) {
        return input.slice( 0, 5 ) + '-' + input.slice( 5 );
      }
      else {
        return input;
      }
    }

  }//END CLASS

} )();
