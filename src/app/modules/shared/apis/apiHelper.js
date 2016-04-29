/**
 * Created by hzou on 1/7/16.
 */

(function () {
  'use strict';

  angular
    .module('app')
    .factory('apiHelper', apiHelper);

  function apiHelper(appConfig) {
    var service = {
      getUrl      : getUrl,
      getConfigUrl: getConfigUrl,
      getWsUri    : getWsUri
    };
    return service;

    ////////////////

    function getUrl(url) {
      var retUrl = [appConfig.api.protocol + ":/",
        appConfig.api.hostname + ":" + appConfig.api.port,
        appConfig.api.path,
        url].join('/');
      return retUrl;
    }

    /**
     * @description
     *  Returns an absolute url constructed from the application's configured API properties.
     * @param {Object} configProp - The configuration property to use when constructing the url.
     * @returns {string} The absolute url destination
     */
    function getConfigUrl(configProp) {
      var apiProp = _.merge({}, appConfig.api, configProp);
      return [apiProp.protocol + ":/",
        apiProp.hostname + ":" + apiProp.port,
        apiProp.path].join('/');
    }

    function getWsUri() {
      var retUrl = ["ws:/",
        appConfig.api.hostname + ":" + appConfig.api.port].join('/');
      return retUrl;
    }
  }

})();

