/**
 * Created by hzou on 1/2/16.
 */


(function () {
  'use strict';


  angular
    .module('isc.spinner')
    .factory('httpLoaderInterceptor', httpLoaderInterceptor);

  function httpLoaderInterceptor($q, iscSpinnerModel, devlog) {

    var factory = {
      request      : request,
      response     : response,
      responseError: responseError
    };

    return factory;

    function request(config) {
      if (config.showLoader) {
        devlog.channel('httpLoaderInterceptor').debug('adding url to loader ' + config.url);
        iscSpinnerModel.addPendingReq(config.url);
      }
      return config;
    }

    function response(res) {
      if (res.config.showLoader) {
        devlog.channel('httpLoaderInterceptor').debug('moving url from loader ' + res.config.url);
        iscSpinnerModel.subtractPendingReq(res.config.url);
      }
      return res;
    }

    function responseError(res) {
      if (res.config.showLoader) {
        devlog.channel('httpLoaderInterceptor').debug('moving url from loader ' + res.config.url);
        iscSpinnerModel.subtractPendingReq(res.config.url);
      }
      return $q.reject(res);
    }
  }
})();

