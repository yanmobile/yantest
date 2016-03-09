/**
 * Created by hzou on 1/7/16.
 */

(function () {
  'use strict';

  angular
    .module('isc.core')
    .factory('apiHelper', apiHelper);

  function apiHelper(appConfig) {
    var service = {
      getUrl  : getUrl,
      getWsUri: getWsUri
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

    function getWsUri() {
      var retUrl = ["ws:/",
        appConfig.api.hostname + ":" + appConfig.api.port].join('/');
      return retUrl;
    }
  }

})();

