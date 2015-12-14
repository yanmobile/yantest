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
   * Sample usage:
   *
   * If loading the application with:
   * http://thisapplication.com/#?documentId=123&mode=edit
   *
   * Because the initially requested state may be in a protected part of the application, and we may redirect to an
   * external application for authentication for an arbitrary amount of time, requested states expire after a duration,
   * which is configured (in minutes) as the second parameter to the configure function.
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
   * }, 15);
   */

  /* @ngInject */
  function iscExternalRouteProvider() {
    this.configure = function (mappingFunction, externalRequestExpirationInMinutes) {
      // Get raw location hash
      var hash = window.location.hash.replace(/#/, ''),
          nextStateObject;

      // If the hash fragment starts with ?, then it is url query params for the application
      // Direct Angular ui-routes are handled by iscExternalRouteApi.persistCurrentState
      if (_.startsWith(hash, '?') && _.isFunction(mappingFunction)) {
        // Parse into query strings
        var queryStrings = _.compact(hash.split(/[\?&]/g));

        // Parse into name/value properties
        var queryParams = {};
        _.forEach(queryStrings, function (param) {
          var split = param.split(/=/);
          // Note that empty query params such as ?param=&anotherParam= will split to empty string values.
          if (split.length > 1) {
            _.set(queryParams, split[0], split[1]);
          }
        });

        // Process params through provided config function
        nextStateObject = mappingFunction(queryParams);
      }


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
            'stateParams': stateParams,
            // Set an expiration -- if this state is later retrieved after it has expired, this state will be ignored
            'expiresOn'  : externalRequestExpirationInMinutes
              ? moment().add(externalRequestExpirationInMinutes, 'minute').toISOString()
              : undefined
          })
        );
      }
    };

    this.$get = [function iscExternalRouteFactory() {
      return new iscExternalRoute();
    }];

  }
})();

