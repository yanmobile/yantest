( function() {
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
    var templatesUrl = apiHelper.getConfigUrl( moduleConfig.formTemplates );

    var scriptsUrl = [templatesUrl, 'userScripts'].join( '/' );

    var fdnAssetPath = 'assets/FDN/';

    var api = {
      getFdnAsset      : getFdnAsset,
      getFormDefinition: getFormDefinition,
      getTemplate      : getTemplate,
      getUserScript    : getUserScript,
      listForms        : listForms
    };

    return api;

    /**
     * @memberOf iscFormsApi
     * @returns {Promise}
     */
    function listForms() {
      channel.debug( 'iscFormsApi.listForms' );
      return iscHttpapi.get( formsUrl );
    }

    /**
     * @memberOf iscFormsApi
     * @param {String} fdnName
     * @returns {Promise}
     */
    function getFdnAsset( fdnName ) {
      return iscHttpapi.get( [fdnAssetPath, fdnName, '.json'].join( '' ) );
    }

    /**
     * @memberOf iscFormsApi
     * @param {String} formKey
     * @param {=String} formVersion
     * @returns {Promise}
     */
    function getFormDefinition( formKey, formVersion ) {
      channel.debug( 'iscFormsApi.getFormDefinition' );
      return iscHttpapi.get( _.compact( [formsUrl, formKey, formVersion] ).join( '/' ), { showLoader : true } );
    }

    /**
     * @memberOf iscFormsApi
     * @param scriptName
     * @returns {Promise}
     */
    function getUserScript( scriptName ) {
      channel.debug( 'iscFormsApi.getUserScript' );
      return iscHttpapi.get( [scriptsUrl, scriptName].join( '/' ) );
    }

    /**
     * @memberOf iscFormsApi
     * @param templateName
     * @returns {Promise}
     */
    function getTemplate( templateName ) {
      channel.debug( 'iscFormsApi.getTemplate' );
      return iscHttpapi.get( [templatesUrl, templateName].join( '/' ) );
    }
  }
} )();
