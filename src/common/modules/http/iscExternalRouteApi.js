/**
 * Created by paul robbins on 12/11/15
 */
(function () {
  'use strict';

  angular.module('isc.http')
    .factory('iscExternalRouteApi', iscExternalRouteApi);

  /**
   * This API allows routing into a state within the application,
   * based on query params provided to the initial application load.
   *
   * Initial states can be configured during app.config with iscExternalRouteProvider.
   * This API retrieves that state and returns it as an object with nextState and stateParams properties.
   */

  /* @ngInject */
  function iscExternalRouteApi($window) {
    return {
      getInitialState : getInitialState
    };

    function getInitialState() {
      var initialState = $window.sessionStorage.getItem('initialState');
      if (initialState) {
        $window.sessionStorage.removeItem('initialState');
        return JSON.parse(initialState);
      }
      else {
        return undefined;
      }
    }
  }
})();

