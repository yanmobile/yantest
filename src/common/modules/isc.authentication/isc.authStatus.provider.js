/**
 * Created by paul robbins on 7/8/16.
 */

( function() {
  'use strict';

  angular.module( 'isc.authentication' )
    .provider( 'iscAuthStatus', iscAuthStatusProvider );

  /* @ngInject */
  function iscAuthStatusProvider() {
    var authConfig = {
      authStatusHasBeenChecked: false,
      authResults             : null
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
      authConfig.authStatusUrl           = config.authStatusUrl;
      authConfig.authStatusFocusCallback = config.authStatusFocusCallback;

      authConfig.useAuthStatus = !!authConfig.authStatusUrl;
    }

    function getConfig() {
      return authConfig;
    }

  }
} )();

