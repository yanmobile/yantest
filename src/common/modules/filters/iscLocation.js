/**
 * Created by trevor hudson on 10/16/15.
 */
// 2.16.840.1.113883.3.86 is an Intersystems code that represents null


(function(){
  'use strict';

  /* @ngInject */
  function iscLocation($filter, $log){

    return function( locationString, showMessage ){

      if (!locationString){
        return '';
      }
      else if (parseFloat(locationString) === 2.16) {
        return !!showMessage ? $filter('translate')('ISC_UNKNOWN_LOCATION') : '';
      }

      return locationString;
    };

  }//END CLASS
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.filters' )
      .filter( 'iscLocation', iscLocation );

})();
