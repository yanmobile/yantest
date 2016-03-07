(function () {
  'use strict';

  angular.module('isc.states')
    .factory('iscStateInit', iscStateInit);

  /* @ngInject */
  function iscStateInit($q) {
    var initFunctions = {};

    return {
      run   : run,
      config: config
    };

    /**
     * Configures this service by passing in a configuration object.
     *
     * @param {Object} configuration - Include an initFunction property as an object or array,
     * containing the asynchronous functions that should be resolved during app initialization.
     */
    function config(configuration) {
      var functions = configuration.initFunctions;
      if (functions) {
        if (_.isArray(functions)) {
          var key = 0;
          _.forEach(functions, function (fn) {
            initFunctions[(key++).toString()] = fn;
          });
        }
        else if (_.isObject(functions)) {
          initFunctions = functions;
        }
      }
    }

    /**
     * Executes all functions provided to config and returns a promise with all the resolutions.
     * @returns {Promise}
     */
    function run() {
      var promises    = {};
      var initPromise = $q.defer();

      _.forEach(initFunctions, function (fn, name) {
        if (_.isFunction(fn)) {
          var deferred   = $q.defer();
          promises[name] = deferred.promise;
          fn().then(function (results) {
            deferred.resolve(results);
          });
        }
      });

      $q.all(promises).then(function (results) {
        initPromise.resolve(results);
      });

      return initPromise.promise;
    }
  }//END CLASS


})();

