/**
 * Created by Trevor Hudson on 10/27/15.
 */
// This filter contains standards for Date display for consistency
// for custom formatting, please refer to http://momentjs.com/docs/#/displaying/format/
// First option takes in custom format strings, 'date', 'dateWithTime', or 'fromNow'
// Second option is UTC: true indicates to use UTC mode

( function() {
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.filters' )
      .filter( 'iscDate', iscDate );

  /* @ngInject */
  function iscDate( devlog ) {
    var log = devlog.channel( 'iscDate' );
    log.debug( 'iscDate LOADED' );

    return function( date, format, utc ) {

      if ( !moment ) {
        log.error( 'Error: momentJS is not loaded as a global' );
        return date;
      }
      // moment(undefined) is the current date
      // moment(null) and moment('') are Invalid Dates
      if ( !date ) {
        return '';
      }

      var iscMoment = utc ? moment.utc : moment;

      if ( !format ) { // September 26, 1986 9:00 AM
        return iscMoment( date ).format( 'LLL' );
      }
      if ( format === 'date' ) { // September 26, 1986
        return iscMoment( date ).format( 'LL' );
      }
      else if ( format === 'dateWithTime' ) { // 9/26/1986 9:00 AM
        return iscMoment( date ).format( 'L' ) + ' ' + iscMoment( date ).format( 'LT' );
      }
      else if ( format === 'fromNow' ) { // 29 years ago
        return iscMoment( date ).fromNow();
      }
      else { // refer to moment website
        return iscMoment( date ).format( format );
      }
    };

  }//END CLASS

} )();
