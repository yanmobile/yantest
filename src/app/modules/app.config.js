/**
 * Created by hzou on 12/11/15.
 */

(function () {
  'use strict';

  angular
    .module('app')
    .constant('appConfig', getConfig());

  /*========================================
   =              app config               =
   ========================================*/
  function getConfig() {
    return {
      'api': {
        'protocol': 'http',
        'hostname': 'localhost',
        'port'    : 3030,
        'path'    : 'api/v1'
      }
    };
  }

})();
