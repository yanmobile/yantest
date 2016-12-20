( function() {
  'use strict';

  /* @ngInject */
  angular
    .module( 'isc.forms' )
    .factory( 'iscFormsCodeTableApi', iscFormsCodeTableApi );

  /**
   * @ngdoc factory
   * @memberOf isc.forms
   * @param iscHttpapi
   * @param apiHelper
   * @param iscCustomConfigService
   * @returns {{getAsync: function, getSync: function}}
   */
  function iscFormsCodeTableApi( iscHttpapi, apiHelper, iscCustomConfigService ) {
    var config        = iscCustomConfigService.getConfig(),
        moduleConfig  = _.get( config, 'moduleApi', {} );

    var codeTableUrl = apiHelper.getConfigUrl( moduleConfig.formCodeTables );

    var codeTableCache = {};

    return {
      getAsync: getAsync,
      getSync : getSync
    };

    /**
     * @memberOf iscFormsCodeTableApi
     * @description
     * Loads a single code table from the server by name and caches it by name.
     * This call is guaranteed to cache at least an empty array.
     * @param {String} name - The code table name
     * @returns {Promise}
     */
    function getAsync( name ) {
      return iscHttpapi.get( [codeTableUrl, name, '$'].join( '/' ) ).then(
        function( codeTable ) {
          var tableToCache = ( codeTable && _.isArray( codeTable ) ) ? codeTable : [];
          _.set(
            codeTableCache,
            name,
            tableToCache
          );
          return codeTable;
        }
      );
    }

    /**
     * @memberOf iscFormsCodeTableApi
     * @description
     * Synchronously returns a single code table from the cache by name.
     * @param {String} name - The code table name
     * @returns {Array} - If this call returns undefined, then the codeTable with
     * "name" does not exist in the cache.
     */
    function getSync( name ) {
      return _.get(
        codeTableCache,
        name
      );
    }
  }

} )();
