/**
 * Created by hzou on 12/8/15.
 */

(function () {
  'use strict';
  angular
    .module('hsSampleApp', ['isc.common'])
    .config(function (iscCustomConfigServiceProvider, devlogProvider, hsSampleAppConfig) {
    /* @ngInject */
      iscCustomConfigServiceProvider.loadConfig(hsSampleAppConfig);
      devlogProvider.loadConfig(hsSampleAppConfig);
    /* @ngInject */
    .run(function (iscCustomConfigService) {
      iscCustomConfigService.addStates();
    });

})();
