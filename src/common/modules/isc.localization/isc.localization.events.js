/**
 * Created by probbins on 5/2/17
 */

( function() {
  'use strict';

  /**
   * @memberof isc.localization
   * @ngdoc constant
   * @name LOCALIZATION_EVENTS
   * @description Events supporting language and localization functionality
   */
  angular
    .module( 'isc.localization' )
    .constant( 'LOCALIZATION_EVENTS', {
      languageChanged: 'iscLanguageChanged'
    } );

} )();
