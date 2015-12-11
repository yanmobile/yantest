/**
 * Created by paul robbins on 12/11/15
 */
(function () {
  'use strict';

  angular.module('isc.http')
    .provider('iscExternalRoute', iscExternalRouteProvider);

  /**
   * This provider allows routing into a state within the application,
   * based on query params provided to the initial application url.
   *
   * Configuration should be done during application config by calling iscExternalRouteProvider.configure
   * with a function that takes a queryParams parameter. Expect queryParams to be an object with
   * query string names as property names and values as property values.
   *
   * The configuration function should return a desired route as an object with nextState and stateParams properties.
   *
   * e.g.:
   * If loading the application with:
   * http://thisapplication.com/#?documentId=123&mode=edit
   *
   * To route to index.editDocument with the given id and mode as state params, add the following to the app.config:
   *
   * iscExternalRouteProvider.configure(function(queryParams) {
   *   var nextState = '', stateParams = {};
   *
   *   if (queryParams.documentId) {
   *     nextState = 'index.editDocument';
   *     stateParams = {
   *       'documentId' : queryParams.documentId,
   *       'mode'       : queryParams.mode
   *     };
   *   }
   *
   *   return {
   *     'nextState'   : nextState,
   *     'stateParams' : stateParams
   *   };
   * });
   */

  /* @ngInject */
  function iscExternalRouteProvider() {
    this.configure = function (mappingFunction) {
      if (_.isFunction(mappingFunction)) {
        // Get raw location hash
        var hash = window.location.hash.replace(/#/, '');

        // Parse into query strings
        var queryStrings = _.compact(hash.split(/[\?&]/g));

        // Parse into name/value properties
        var queryParams = {};
        _.forEach(queryStrings, function(param) {
          var split = param.split(/=/);
          // Note that empty query params such as ?param=&anotherParam= will split to empty string values.
          if (split.length > 1) {
            _.set(queryParams, split[0], split[1]);
          }
        });

        // Process params through provided config function
        var nextStateObject = mappingFunction(queryParams);

        // If a next state was returned (a nextState string is minimally required), store desired state in session
        // This will be returned during app.run with iscExternalRouteApi.getInitialState()
        if (_.isObject(nextStateObject) && nextStateObject.nextState) {
          var nextState   = nextStateObject.nextState,
              stateParams = nextStateObject.stateParams;
          if (!_.isObject(stateParams)) {
            stateParams = {};
          }
          window.sessionStorage.setItem('initialState',
            JSON.stringify({
              'nextState'  : nextState,
              'stateParams': stateParams
            })
          );
        }
      }
    };

    this.$get = ['apiToken', function iscExternalRouteFactory(apiToken, mappingFunction) {
      return new iscExternalRoute(apiToken, mappingFunction)
    }];

  }
})();

