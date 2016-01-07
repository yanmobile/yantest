/**
 * Created by trevor hudson on 10/16/15.
 */
// 2.16.840.1.113883.3.86 is an Intersystems code that represents null


(function(){
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------
  angular.module( 'isc.filters' )
    .filter( 'iscCapitalize', iscCapitalize );

  /* @ngInject */
  function iscCapitalize(){

    return function( stringToCap){

      if (!stringToCap){
        return '';
      }
      else {
        stringToCap = _.capitalize(stringToCap);
      }

      return stringToCap;
    };

  }//END CLASS

})();
