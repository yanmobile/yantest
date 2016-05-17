( function() {
  'use strict';

  angular.module( 'isc.forms' )
    .factory( 'iscFormDataApi', iscFormDataApi );

  /**
   * @ngdoc factory
   * @memberOf isc.forms
   * @param devlog
   * @param apiHelper
   * @param iscCustomConfigService
   * @param iscHttpapi
   * @returns {{get: get, put: put, post: post, delete: deleteApi, list: list}}
   */
  /* @ngInject */
  function iscFormDataApi( devlog, apiHelper, iscCustomConfigService, iscHttpapi ) {
    var channel = devlog.channel( 'iscFormDataApi' );

    var config       = iscCustomConfigService.getConfig(),
        moduleConfig = _.get( config, 'moduleApi', {} );

    var formDataUrl = apiHelper.getConfigUrl( moduleConfig.formData );

    var api = {
      get   : get,
      put   : put,
      post  : post,
      delete: deleteApi,
      list  : list
    };

    return api;

    /**
     * @memberOf iscFormDataApi
     * @param id
     * @returns {*}
     */
    function get( id ) {
      channel.debug( 'iscFormDataApi.get' );
      return iscHttpapi.get( [formDataUrl, id].join( '/' ) );
    }

    /**
     * @memberOf iscFormDataApi
     * @param id
     * @param form
     * @returns {*}
     */
    function put( id, form ) {
      channel.debug( 'iscFormDataApi.put' );
      return iscHttpapi.put( [formDataUrl, id].join( '/' ), form );
    }

    /**
     * @memberOf iscFormDataApi
     * @param form
     * @returns {*}
     */
    function post( form ) {
      channel.debug( 'iscFormDataApi.post' );
      return iscHttpapi.post( formDataUrl, form );
    }

    /**
     * @memberOf iscFormDataApi
     * @param id
     * @returns {*}
     */
    function deleteApi( id ) {
      channel.debug( 'iscFormDataApi.delete' );
      return iscHttpapi.delete( [formDataUrl, id].join( '/' ) );
    }

    /**
     * @memberOf iscFormDataApi
     * @returns {*}
     */
    function list() {
      channel.debug( 'iscFormDataApi.list' );
      return iscHttpapi.get( formDataUrl );
    }

  }
} )();
