/**
 * Created by probbins on 1/25/2017
 *
 */

( function() {
  'use strict';

  angular.module( 'isc.forms' )
    .directive( 'iscFormsUiSelectShim', iscFormsUiSelectShim );

  /* @ngInject */
  function iscFormsUiSelectShim( $timeout ) {
    return {
      restrict: 'A',
      require : 'uiSelect',
      link    : link
    };

    function link( scope, element, attrs, $select ) {
      var searchInput = element.find( 'input.ui-select-search' );

      // limitToList is passed to the directive attribute.
      // This determines whether the widget should limit its data model to only
      // those options in its dropdown list.
      var limitToList = attrs.iscFormsUiSelectShim;

      // Override ui-select's clear function
      var baseClear = $select.clear;
      $select.clear = function( $event ) {
        baseClear( $event );

        // On clearing, the search should be nulled. If it is not, the widget's model
        // value will be set to it and it will persist in the search input.
        $select.search = '';
        // We also need to explicitly close the dropdown
        $select.close( true );
      };

      // After selecting an item and returning to the ui-select, the widget can get into
      // a bad state where the container gets the focus instead of the search input,
      // and it becomes frustratingly difficult to get the cursor inside the search input.
      scope.$on( 'uis:activate', function() {
        switchFocusToInput();
      } );

      // We need to track focus and blur events on the search input,
      // so when a blur occurs, we can determine whether an option was
      // selected from the options list or the user simply blurred the input.
      searchInput.on( 'focus', function() {
        scope.hasInputFocus = true;
      } );

      searchInput.on( 'blur', function( event ) {
        $timeout( function() {
          // Only do anything if an option was NOT already selected by clicking on an option
          if ( scope.hasInputFocus ) {
            scope.hasInputFocus = false;

            if ( limitToList ) {
              // Need to manually close if blurring a limited ui-select
              $select.close( true );
            }

            else {
              scope.$apply( function() {
                // Calling $select.select('') does not do what you think it should do
                // Instead, we need to call clear if the search input is empty
                if ( !$select.search ) {
                  $select.clear( event );
                }
                else {
                  // This sets the model to what was typed in. This is necessary for
                  // blurring by clicking outside the widget (using TAB or ENTER is
                  // handled by the tagging process).
                  $select.ngModel.$setViewValue( $select.search );
                  $select.select( $select.search );
                  $select.ngModel.$commitViewValue();
                }
              } );
            }
          }
        }, 150 );
      } );

      scope.$on( 'uis:select', function( event, item ) {
        // This indicates to blur that an option was selected from the list
        scope.hasInputFocus = false;
      } );


      // Clean up
      scope.$on( '$destroy', function() {
        searchInput.off( 'focus, blur' );
      } );

      // If the focused element is the container, this focuses the search input instead.
      // This works around a bug that occurs when entering a value, blurring the widget,
      // then clicking back into the widget.
      function switchFocusToInput() {
        $timeout( function() {
          var focusedElement = $( element.find( ':focus' ).first().context );
          if ( focusedElement.hasClass( 'ui-select-container' ) ) {
            // $select.focusSearchInput();
            searchInput.focus();
          }
        }, 25 );
      }
    }
  }
} )();
