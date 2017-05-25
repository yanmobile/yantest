( function() {
  'use strict';

  angular
    .module( 'isc.filters' )
    .filter( 'iscTelephone', iscTelephoneFilter );

  /* @ngInject */
  function iscTelephoneFilter() {
    // Filter for prettifying telephone numbers
    // Currently filters US phone numbers only
    return function iscTelephoneFilter( input ) {
      if ( _.isString( input ) || _.isNumber( input ) ) {
        // Strip non-digits for filtering
        var inputDigits = input.toString().replace( /\D/g, '' );

        // 7-digit US phone number
        if ( inputDigits.length === 7 ) {
          return us7Digit( inputDigits );
        }

        // 10-digit US phone number
        else if ( inputDigits.length === 10 ) {
          return us10Digit( inputDigits );
        }

        // 10-digit US phone number with a 1-prefix;
        // e.g., 1-800-123-4567
        else if ( inputDigits.length === 11 && inputDigits[0] === '1' ) {
          return us10Digit( inputDigits.slice( 1 ) );
        }
      }
      return input;

      function us7Digit( input ) {
        return [
          input.slice( 0, 3 ), '-',
          input.slice( 3 )
        ].join( '' );
      }

      function us10Digit( input ) {
        return [
          '(', input.slice( 0, 3 ), ')',
          input.slice( 3, 6 ), '-',
          input.slice( 6 )
        ].join( '' );
      }
    };
  }

} )();
