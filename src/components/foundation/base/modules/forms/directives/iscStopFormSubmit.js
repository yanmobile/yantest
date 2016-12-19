/**
 * Created by probbins on 12/6/2016
 *
 * Attribute directive that stops propagation of the enter key unless the
 * event comes from a textarea. Based on iscEnter but this directive is
 * more specific to forms and only stops propagation conditionally.
 *
 * Usage:
 * <my-element isc-stop-form-submit>
 * </my-element>
 */

( function() {
  'use strict';

  angular.module( 'isc.forms' )
    .directive( 'iscStopFormSubmit', iscStopFormSubmit );

  /* @ngInject */
  function iscStopFormSubmit( keyCode ) {
    return {
      restrict: 'A',
      link    : link
    };

    function link( scope, element, attrs ) {
      element.bind( 'keydown keypress', function( event ) {
        if ( getKey() === keyCode.ENTER ) {
          if ( !$( event.target ).is( 'textarea' ) ) {
            event.preventDefault();
          }
        }

        function getKey() {
          return event.charCode || event.keyCode || event.which || 0;
        }
      } );
    }
  }
} )();
