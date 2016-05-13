/**
 * Created by douglas goodman on 3/9/15.
 */

(function() {
  'use strict';

  // ----------------------------
  // injection
  // ----------------------------

  angular
    .module( 'isc.states', ['isc.authentication', 'isc.core', 'ui.router'] )
    .config( decorateState );

  /**
   * @description
   *    decorating $state to have next and toParam
   */
  function decorateState( $provide ) {
    $provide.decorator( '$state', function( $delegate, $rootScope ) {
      $rootScope.$on( '$stateChangeStart', function( event, state, params ) {
        $delegate.next     = state;
        $delegate.toParams = params;
      } );
      return $delegate;
    } );
  }

} )();

