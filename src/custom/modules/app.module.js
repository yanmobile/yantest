/**
 * Created by hzou on 12/8/15.
 */

(function () {
  'use strict';
  angular
    .module('app', ['isc.common', 'home'])
    /* @ngInject */
    .config(function (iscCustomConfigServiceProvider, devlogProvider, appConfig, $translateProvider) {
      iscCustomConfigServiceProvider.loadConfig(appConfig);
      devlogProvider.loadConfig(appConfig);

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
