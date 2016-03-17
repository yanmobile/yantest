/**
 * Created by Henry Zou on 3/16/2016, 3:07:35 PM.
 */

(function () {

  'use strict';


  angular.module('isc.error')
    .controller('error404Controller', error404Controller);

  function error404Controller(devlog) {
    devlog.channel('error404Controller').debug('error404Controller LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var self = this;


  }// END CLASS

})();
