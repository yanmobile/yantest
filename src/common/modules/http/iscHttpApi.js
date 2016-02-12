/**
 * Created by ryan jarvis on 6/3/15
 */

/**
 * This is a wrapper for angular's $http service
 * @param $http
 * @returns {{get: get, put: put, post: post}}
 *
 * Since any additional properties that's not part of the built-in Angular's config
 * will not be passed as part of the ajax request.
 * We are leveraging fact to pass in any custom attributes we want. E.g. responseAsObject
 *
 * see Angular's $http doc: https://docs.angularjs.org/api/ng/service/$http#usage
 */
(function () {
  'use strict';

  angular.module('isc.http')
    .factory('iscHttpapi', iscHttpapi);

  /* @ngInject */
  function iscHttpapi($http, iscSessionModel) {

    return {
      get   : get,
      put   : put,
      post  : post,
      delete: deleteApi
    };

    /**
     * Methods: get(url, [config]);
     */
    function get(url, config) {
      var partialReturnedResponseData = _.partial(returnResponseData, config);
      return $http.get(url, config).then(partialReturnedResponseData);
    }

    /**
     * Methods: put(url, data, [config]);
     */
    function put(url, data, config) {
      var partialReturnedResponseData = _.partial(returnResponseData, config);
      return $http.put(url, data, config).then(partialReturnedResponseData);
    }

    /**
     * Methods: post(url, data, [config]);
     */
    function post(url, data, config) {
      var partialReturnedResponseData = _.partial(returnResponseData, config);
      return $http.post(url, data, config).then(partialReturnedResponseData);
    }

    /**
     * Methods: delete(url, [config]);
     */
    function deleteApi(url, config) {
      var partialReturnedResponseData = _.partial(returnResponseData, config);
      return $http.delete(url, config).then(partialReturnedResponseData);
    }

    function returnResponseData(config, response) {
      config = config || {};

      // On any server response, assume session has been renewed
      if (!config.bypassSessionReset) {
        iscSessionModel.resetSessionTimeout();
      }

      if (config.responseAsObject) {
        return response;
      } else {
        return response.data;
      }

    }

  }
})();

