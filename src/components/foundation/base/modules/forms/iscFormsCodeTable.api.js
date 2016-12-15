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
   * @returns {{loadAll: loadAll, get: get}}
   */
  function iscFormsCodeTableApi( iscHttpapi, apiHelper, iscCustomConfigService ) {
    var config        = iscCustomConfigService.getConfig(),
        moduleConfig  = _.get( config, 'moduleApi', {} ),
        defaultScheme = _.get( config, 'forms.defaultCodeTableScheme', '$' );

    var codeTableUrl = apiHelper.getConfigUrl( moduleConfig.formCodeTables );

    var codeTableCache = {};

    return {
      loadAll: loadAll,
      load   : load,
      get    : get
    };

    /**
     * @memberOf iscFormsCodeTableApi
     * @description
     * Loads all the code tables from the server and caches them locally.
     * @returns {Promise}
     */
    function loadAll() {
      // Server responds with an object containing all code tables, with one property per table.
      // The property key is the code table name, while the property value is the code table.
      return iscHttpapi.get( codeTableUrl ).then( function( codeTables ) {
        _.forEach( codeTables, function( codeTable, name ) {
          _.set(
            codeTableCache,
            [name, codeTable.Scheme || defaultScheme].join( '.' ),
            codeTable.Items
          );
        } );
        return codeTables;
      } );
    }

    /**
     * @memberOf iscFormsCodeTableApi
     * @description
     * Loads a single code table from the server and caches it.
     * @param {String} name - The code table name
     * @param {String=} scheme - The code table scheme
     * @returns {Promise}
     */
    function load( name, scheme ) {
      scheme = scheme || defaultScheme;

      // Server responds with an object containing all code tables, with one property per table.
      // The property key is the code table name, while the property value is the code table.
      return iscHttpapi.get( [codeTableUrl, name, scheme].join( '/' ) ).then(
        function( codeTable ) {
          _.set(
            codeTableCache,
            [name, scheme].join( '.' ),
            codeTable
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
     * @param {String=} scheme - The code table scheme
     * @returns {Array}
     */
    function get( name, scheme ) {
      return _.get(
        codeTableCache,
        [name, scheme || defaultScheme].join( '.' ),
        []
      );
    }
  }

} )();
