/**
 * Created by Trevor Hudson on 10/27/15.
 */
// This filter contains standards for Date display for consistancy
// for custom formating, please refer to http://momentjs.com/docs/#/displaying/format/

(function(){
  'use strict';

  iscDate.$inject = [ '$log', '$filter' ];

  function iscDate( $log, $filter ){
    //$log.debug( 'iscDate LOADED');

    return function(date, format) {
      if(!moment) {
        console.log('Error: momentJS is not loaded as a global');
        return '!momentJS';
      }
      if (!format) { // September 26, 1986 9:00 AM
        return moment(date).format('MMMM Do, YYYY h:mm A');
      }
      if (format === 'date') { // September 26, 1986
        return moment(date).format('MMMM Do, YYYY');
      }
      else if (format === 'dateWithTime') { // 9/26/1986 9:00 AM
        return moment(date).format('M/D/YY h:mm A');
      }
      else if (format === 'fromNow') { // 29 years ago
        return moment(date).fromNow();
      }
      else { // refer to moment website
        return moment(date).format(format);
      }
    };

  }//END CLASS
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.common' )
      .filter( 'iscDate', iscDate );

})();
