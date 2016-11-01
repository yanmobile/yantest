( function() {
  'use strict';

  angular.module( 'isc.http' )
    .provider( 'iscAuthenticationInterceptorConfig', iscAuthenticationInterceptorConfig );

  /* @ngInject */
  function iscAuthenticationInterceptorConfig() {
    /**
     * These default configs can be overridden by invoking "setConfig(<new config>)".
     * The merge algorithm uses _.merge() instead of _.extend()
     *
     * @type {{statusApiUrl: string, ignoredUrls: RegExp[]}}
     */
    var localConfig = {
      statusApiUrl: 'api/v1/auth/status',
      ignoredUrls : [
        /api\/v1\/auth\/status$/,
        /api\/v1\/auth\/logout$/
      ]
    };

    return {
      configure: configure,
      $get     : function() {
        return {
          configure: configure,
          getConfig: getConfig
        };
      }
    };

    function configure( config ) {
      _.extend( localConfig, config );
    }

    function getConfig( key ) {
      return key ? localConfig[key] : localConfig;
    }

  }
} )();

