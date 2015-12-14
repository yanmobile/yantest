/**
 * Created by hzou on 12/8/15.
 */

(function () {
  'use strict';
  angular
    .module('hsSampleApp', ['isc.common', 'hsHome'])
    /* @ngInject */
    .config(function (iscCustomConfigServiceProvider, devlogProvider, hsSampleAppConfig, $translateProvider) {
      iscCustomConfigServiceProvider.loadConfig(hsSampleAppConfig);
      devlogProvider.loadConfig(hsSampleAppConfig);

      $translateProvider.useStaticFilesLoader({
        prefix: 'assets/i18n/locale-',
        suffix: '.json'
      });

      $translateProvider.preferredLanguage('en_US');
    })
    /* @ngInject */
    .run(function (iscCustomConfigService) {
      iscCustomConfigService.addStates();
    });

})();
