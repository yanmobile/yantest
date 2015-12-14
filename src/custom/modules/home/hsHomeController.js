/**
 * Created by hzou on 12/13/15.
 */

(function () {

  'use strict';

  /* @ngInject */
  function hsHomeController( devlog) {
    devlog.channel('hsHomeController').debug('hsHomeController LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var self = this;


  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module('hsHome')
    .controller('hsHomeController', hsHomeController);

})();
