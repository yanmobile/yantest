( function () {
  'use strict';

  angular.module( 'isc.forms' )
    .factory( 'iscFormsApi', iscFormsApi );

  /**
   * @ngdoc factory
   * @memberOf isc.forms
   * @param devlog
   * @param apiHelper
   * @param iscCustomConfigService
   * @param iscHttpapi
   * @returns {{listForms: listForms, getActiveForms: getActiveForms, setFormStatus: setFormStatus, getFormDefinition: getFormDefinition, getUserScript: getUserScript, getTemplate: getTemplate}}
   */
  /* @ngInject */
  function iscFormsApi( devlog, apiHelper, iscCustomConfigService, iscHttpapi ) {
    var channel = devlog.channel( 'iscFormsApi' );

    var config       = iscCustomConfigService.getConfig(),
        moduleConfig = _.get( config, 'moduleApi', {} );

    var formsUrl     = apiHelper.getConfigUrl( moduleConfig.forms );
    var formInfoUrl  = apiHelper.getConfigUrl( moduleConfig.formInfo );
    var templatesUrl = apiHelper.getConfigUrl( moduleConfig.formTemplates );

    var statusUrl  = [formInfoUrl, 'status'].join( '/' );
    var scriptsUrl = [templatesUrl, 'userScripts'].join( '/' );

    var api = {
      listForms        : listForms,
      getFormStatuses  : getFormStatuses,
      setFormStatus    : setFormStatus,
      getFormDefinition: getFormDefinition,
      getUserScript    : getUserScript,
      getTemplate      : getTemplate
    };

    return api;

    /**
     * @memberOf iscFormsApi
     * @returns {*}
     */
    function listForms() {
      channel.debug( 'iscFormsApi.listForms' );
      return iscHttpapi.get( formsUrl );
    }

    /**
     * @memberOf iscFormsApi
     * @param formType
     * @returns {*}
     */
    function getFormStatuses( formType ) {
      channel.debug( 'iscFormsApi.getActiveForms' );
      return iscHttpapi.get( [statusUrl, formType].join( '/' ) );
    }

    /**
     * @memberOf iscFormsApi
     * @param formType
     * @param formStatuses
     * @returns {*}
     */
    function setFormStatus( formType, formStatuses ) {
      channel.debug( 'iscFormsApi.setFormStatus' );
      return iscHttpapi.put( [formInfoUrl, formType].join( '/' ), formStatuses );
    }

    /**
     * @memberOf iscFormsApi
     * @param formKey
     * @returns {*}
     */
    function getFormDefinition( formKey ) {
      channel.debug( 'iscFormsApi.getFormDefinition' );
      return iscHttpapi.get( [formsUrl, formKey].join( '/' ) );
    }

    /**
     * @memberOf iscFormsApi
     * @param scriptName
     * @returns {*}
     */
    function getUserScript( scriptName ) {
      channel.debug( 'iscFormsApi.getUserScript' );
      return iscHttpapi.get( [scriptsUrl, scriptName].join( '/' ) );
    }

    /**
     * @memberOf iscFormsApi
     * @param templateName
     * @returns {*}
     */
    function getTemplate( templateName ) {
      channel.debug( 'iscFormsApi.getTemplate' );
      return iscHttpapi.get( [templatesUrl, templateName].join( '/' ) );
    }
  }
} )();
