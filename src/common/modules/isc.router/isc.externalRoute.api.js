/**
 * Created by paul robbins on 12/11/15
 */
( function () {
  'use strict';

  angular.module( 'isc.router' )
    .factory( 'iscExternalRouteApi', iscExternalRouteApi );

  /**
   * This API allows routing into a state within the application,
   * based on query params provided to the initial application load.
   *
   * Initial states can be configured during app.config with iscExternalRouteProvider.
   * This API retrieves that state and returns it as an object with nextState and stateParams properties.
   *
   * The persistCurrentState function can be called to remember the current state during a session timeout.
   */

  /* @ngInject */
  function iscExternalRouteApi( iscExternalRoute ) {
    return {
      persistCurrentState: persistCurrentState,
      getNextState       : getNextState
    };

    function getNextState() {
      var nextState = iscExternalRoute.getNext();

      // If an initial route was set, process it now
      if ( nextState ) {
        var expiresOn = nextState.expiresOn ? moment( nextState.expiresOn ) : undefined,
            now       = moment();

        // If an expiration was not provided, or the requested route has not expired yet, return it as the new route
        if ( !expiresOn || expiresOn.isAfter( now ) ) {
          return nextState;
        }
      }
      return undefined;
    }

    function persistCurrentState( state, stateParams, externalRequestExpirationInMinutes ) {
      var stateName = _.get( state, 'name' );
      if ( stateName ) {
        iscExternalRoute.addRoute(
          {
            'nextState'  : stateName,
            'stateParams': stateParams || {},
            // Set an expiration if provided
            'expiresOn'  : externalRequestExpirationInMinutes ?
              moment().add( externalRequestExpirationInMinutes, 'minute' ).toISOString()
              : undefined
          }
        );
      }
    }
  }
} )();

