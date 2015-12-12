/**
 * Created by hzou on 12/8/15.
 */

(function () {
  'use strict';
  angular
    .module('hsSampleApp', ['isc.common'])
    .config(function (iscCustomConfigServiceProvider, devlogProvider, iscCustomConfig) {
      iscCustomConfigServiceProvider.loadConfig(iscCustomConfig);
      devlogProvider.loadConfig(iscCustomConfig);
    });

})();
