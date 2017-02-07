/**
 * Created by probbins on 2/1/2017
 *
 */

( function() {
  'use strict';

  /**
   * This filter ensures the returned results for a ui-select data source
   * will render correctly when a minimum input length is used.
   * Otherwise, entering a search >= the minimum length, then erasing the
   * search, then re-entering criteria that would return the same results
   * will show no results (erroneously).
   * This filter works by returning an empty set if the minimum input length
   * is not met, and returning the original fields [] otherwise. The actual
   * result set filtering is performed by the formly field controller.
   */
  angular.module( 'isc.forms' )
    .filter( 'uiSelectMinLength', uiSelectMinLength );

  /* @ngInject */
  function uiSelectMinLength( ) {
    return function( fields, search, minInputLength ) {
      if ( _.get( search, 'length', 0 ) >= minInputLength ) {
        return fields;
      }
      else {
        return [];
      }
    };
  }

} )();
