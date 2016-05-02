/**
 * Created by hzou on 2/8/2016, 8:57:49 AM.
 */

(function () {
  'use strict';

  angular.module('layout')
    .controller('layoutController', layoutController);

  function layoutController(devlog, $rootScope, $state) {
    var log = devlog.channel('layoutController');
    log.debug('layoutController LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var self = this;
    self.layout = $state.next.layout;
    $rootScope.$on('$stateChangeStart', function (event, state, params) {
      self.layout = state.layout;
    });
  }// END CLASS

})();
