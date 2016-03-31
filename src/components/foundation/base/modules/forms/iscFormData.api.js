(function () {
  'use strict';

  angular.module('isc.forms')
    .factory('iscFormDataApi', iscFormDataApi);

  /* @ngInject */
  function iscFormDataApi(devlog, apiHelper, iscCustomConfigService, iscHttpapi) {
    var config       = iscCustomConfigService.getConfig(),
        moduleConfig = _.get(config, 'moduleApi', {});

    var formDataUrl = apiHelper.getConfigUrl(moduleConfig.formData);

    var api = {
      get   : get,
      put   : put,
      post  : post,
      delete: deleteApi,
      list  : list
    };

    return api;

    function get(id) {
      devlog.channel('iscFormDataApi').debug('iscFormDataApi.get');
      return iscHttpapi.get([formDataUrl, id].join('/'));
    }

    function put(id, form) {
      devlog.channel('iscFormDataApi').debug('iscFormDataApi.put');
      return iscHttpapi.put([formDataUrl, id].join('/'), form);
    }

    function post(form) {
      devlog.channel('iscFormDataApi').debug('iscFormDataApi.post');
      return iscHttpapi.post(formDataUrl, form);
    }

    function deleteApi(id) {
      devlog.channel('iscFormDataApi').debug('iscFormDataApi.delete');
      return iscHttpapi.delete([formDataUrl, id].join('/'));
    }

    function list() {
      devlog.channel('iscFormDataApi').debug('iscFormDataApi.list');
      return iscHttpapi.get(formDataUrl);
    }

  }
})();
