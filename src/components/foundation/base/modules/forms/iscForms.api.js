(function () {
  'use strict';

  angular.module('isc.forms')
    .factory('iscFormsApi', iscFormsApi);

  /* @ngInject */
  function iscFormsApi(devlog, apiHelper, iscHttpapi) {
    var formsUrl     = apiHelper.getUrl('forms/');
    var formInfoUrl  = apiHelper.getUrl('formInfo/status/');
    var scriptsUrl   = apiHelper.getUrl('formTemplates/userScripts/');
    var templatesUrl = apiHelper.getUrl('formTemplates/');

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
      return iscHttpapi.get(formInfoUrl + formType);
    }

    function setFormStatus(formType, formStatuses) {
      devlog.channel('iscFormsApi').debug('iscFormsApi.setFormStatus');
      return iscHttpapi.put(formInfoUrl + formType, formStatuses);
    }

    function getFormDefinition(formKey) {
      devlog.channel('iscFormsApi').debug('iscFormsApi.getFormDefinition');
      return iscHttpapi.get(formsUrl + formKey);
    }

    function getUserScript(scriptName) {
      devlog.channel('iscFormsApi').debug('iscFormsApi.getUserScript');
      return iscHttpapi.get(scriptsUrl + scriptName);
    }

    function getTemplate(templateName) {
      devlog.channel('iscFormsApi').debug('iscFormsApi.getTemplate');
      return iscHttpapi.get(templatesUrl + templateName);
    }
  }
})();
