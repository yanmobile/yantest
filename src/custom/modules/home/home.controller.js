/**
 * Created by hzou on 12/13/15.
 */

(function () {

  'use strict';

  /* @ngInject */
  function homeController(devlog) {
    devlog.channel('homeController').debug('homeController LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var self = this;


  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module('home')
    .controller('homeController', homeController);

})();
