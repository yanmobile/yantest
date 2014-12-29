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
    function getDateString( itemDate ){
      //console.debug('isc.common.iscDateFilter.getDateStr');
      //console.debug('............itemDate: ' + itemDate );

      var dateExpr = 'YYYY-MMM-DD';
      var dateNoTime = itemDate.split(' ')[0];
      var now = moment().local();
      var item = moment( dateNoTime ).local().format( dateExpr );
      var today = now.format( dateExpr );
      var yesterday = now.subtract( 1, 'days' ).format( dateExpr );

      //console.debug('.......today: ' + today );
      //console.debug('...yesterday: ' + yesterday );
      //console.debug('........item: ' + item );

      if( item === today ){
        return $filter('translate')('ISC_TODAY');
      }
      else if( item === yesterday ){
        return $filter('translate')('ISC_YESTERDAY');
      }

      return item;
    }


  };//END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
      .filter( 'iscDateFilter', iscDateFilter );

})();
