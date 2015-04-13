/**
 * Created by douglasgoodman on 12/8/14.
 */

(function(){
  'use strict';

  iscDateFilter.$inject = [ '$log', '$filter' ];

  function iscDateFilter( $log, $filter ){
//    //$log.debug( 'iscDateFilter LOADED');

    // ----------------------------
    // vars
    // ----------------------------


    // ----------------------------
    // class factory
    // ----------------------------

    return getDateString;

    // ----------------------------
    // functions
    // ----------------------------

    /**
     * accepts strings in the format of "2014-12-07 05:20:00"
     * where the format 'yyyy mm dd' is required and everything after is optional
     * @param itemDate
     * @returns String 'Today' / 'Yesterday' / (date that was supplied)
     */
    function getDateString( itemDate, showTimeStamp ){
      //console.debug('isc.common.iscDateFilter.getDateStr');
      //console.debug('............itemDate: ' + itemDate );

      var DATE_EXPR = 'YYYY-MMM-DD';
      var TIME_EXPR = 'h:mm a';

      // strip extra whitespace, split on (now single) space, join with T
      // so '2015-03-02      04:57:00' becomes '2015-03-02T04:57:00'
      var itemDateFormatted = itemDate.replace(/\s+/g, " ").split( ' ' ).join( 'T' );

      var now = moment().local();
      var date = moment( itemDateFormatted).local().format( DATE_EXPR );
      var time = ', ' + moment( itemDateFormatted ).local().format( TIME_EXPR );
      var today = now.format( DATE_EXPR );
      var yesterday = now.subtract( 1, 'days' ).format( DATE_EXPR );

      //console.debug( '...itemDateFormatted', itemDateFormatted );
      //console.debug('.......today: ' + today );
      //console.debug('...yesterday: ' + yesterday );
      //console.debug('........date: ' + date );
      //console.debug('........time: ' + time );

      if( date === today ){
        return showTimeStamp ? $filter('translate')('ISC_TODAY') + time : $filter('translate')('ISC_TODAY');
      }
      else if( date === yesterday ){
        return showTimeStamp ? $filter('translate')('ISC_YESTERDAY') + time : $filter('translate')('ISC_YESTERDAY');
      }

      return showTimeStamp ? date + time : date;
    }


  }//END CLASS
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
      .filter( 'iscDateFilter', iscDateFilter );

})();
