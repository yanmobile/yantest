(function () {
  'use strict';

  /* @ngInject */
  angular
    .module('isc.core')
    .factory('iscVersionApi', function (iscHttpapi) {
      var _url = 'version.json';

      var _versionInfo;

      return {
        load: load,
        get : get
      };

      /**
       * Loads the version.json file and caches it.
       * @returns {Promise}
       */
      function load() {
        return iscHttpapi.get(_url).then(function (version) {
          _versionInfo = version;
          return version;
        });
      }

      /**
       * Returns the current build info as an object.
       * @returns {Object}
       */
      function get() {
        return _.merge({}, _versionInfo);
      }
    });

})();