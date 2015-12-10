/**
 * Created by hzou on 12/8/15.
 */

(function () {

  'use strict';

  angular.module('hsSampleApp')
    .controller('hsSampleAppController', hsSampleAppController);

  /* @ngInject */
  function hsSampleAppController($log) {
    $log.channel('hsSampleApp.module').debug('hsSampleApp.module.js LOADED');

  }// END CLASS

})();
