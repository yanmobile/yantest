/**
 * copied from: https://gist.github.com/deanapeterson/b93b48fd8c258861f26b
 */
( function () {
  'use strict';

  /**
   * Hijacks the ui-router $state.transitionTo() method to capture it's promise.
   * the promise is added to the $state as $promise (may or may not be needed);
   * also adds handler for rejection of the $promise.
   */

  angular
    .module( 'isc.states' )
    .config( stateChangeRejected );

  function stateChangeRejected( $provide ) {
    $provide.decorator( '$state', decorateTransitionTo );

    /* @ngInject */
    function decorateTransitionTo( $delegate, $rootScope ) { //$delegate === $state
      var nativeTransitionTo = $delegate.transitionTo; //transfer reference

      $delegate.transitionTo = transitionToWrapper;// replace with wrapper

      return $delegate;

      function transitionToWrapper() {
        var args    = [].slice.call( arguments );
        var promise = nativeTransitionTo.apply( this, args );//call original transitionTo, capture promise

        promise['catch']( onStateRejection );	//add handler for rejection
        $delegate.$promise = promise;		//add $promise to default $state object

        return promise;

        function onStateRejection( error ) {
          var toState  = $delegate.get( args[0] );
          var toParams = args[1];

          $rootScope.$emit( '$stateChangeRejected', toState, toParams, $delegate.current, $delegate.params, error );

          return error;
        }
      }
    }
  }
}() );
