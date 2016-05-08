/**
 * Created by Henry Zou on 3/16/2016, 3:07:35 PM.
 */

(function () {

  'use strict';

  angular.module('isc.error')
    .controller('error404Controller', error404Controller);

  /**
   * @ngdoc controller
   * @memberOf isc.error
   * @param devlog
     */
  function error404Controller(devlog) {
    var channel = devlog.channel('devlog');
    channel.debug('error404Controller LOADED');

    // ----------------------------
    // vars
    // ----------------------------
    var self = this;

  }// END CLASS

})();
