(function () {
  'use strict';

  angular.module('isc.forms')
    .factory('iscFormsApi', iscFormsApi);

  /* @ngInject */
  function iscFormsApi(devlog, apiHelper, iscCustomConfigService, iscHttpapi) {
    var config       = iscCustomConfigService.getConfig(),
        moduleConfig = _.get(config, 'moduleApi', {});

    var formsUrl     = apiHelper.getConfigUrl(moduleConfig.forms);
    var formInfoUrl  = apiHelper.getConfigUrl(moduleConfig.formInfo);
    var templatesUrl = apiHelper.getConfigUrl(moduleConfig.formTemplates);

    var statusUrl  = [formInfoUrl, 'status'].join('/');
    var scriptsUrl = [templatesUrl, 'userScripts'].join('/');

    var api = {
      listForms        : listForms,
      getActiveForms   : getActiveForms,
      setFormStatus    : setFormStatus,
      getFormDefinition: getFormDefinition,
      getUserScript    : getUserScript,
      getTemplate      : getTemplate
    };

    return api;

    function listForms() {
      devlog.channel('iscFormsApi').debug('iscFormsApi.listForms');
      return iscHttpapi.get(formsUrl);
    }

    function getActiveForms(formType) {
      devlog.channel('iscFormsApi').debug('iscFormsApi.getActiveForms');
      return iscHttpapi.get([statusUrl, formType].join('/'));
    }

    function setFormStatus(formType, formStatuses) {
      devlog.channel('iscFormsApi').debug('iscFormsApi.setFormStatus');
      return iscHttpapi.put([formInfoUrl, formType].join('/'), formStatuses);
    }

    function getFormDefinition(formKey) {
      devlog.channel('iscFormsApi').debug('iscFormsApi.getFormDefinition');
      return iscHttpapi.get([formsUrl, formKey].join('/'));
    }

    function getUserScript(scriptName) {
      devlog.channel('iscFormsApi').debug('iscFormsApi.getUserScript');
      return iscHttpapi.get([scriptsUrl, scriptName].join('/'));
    }

    function getTemplate(templateName) {
      devlog.channel('iscFormsApi').debug('iscFormsApi.getTemplate');
      return iscHttpapi.get([templatesUrl, templateName].join('/'));
    }
  }
})();
