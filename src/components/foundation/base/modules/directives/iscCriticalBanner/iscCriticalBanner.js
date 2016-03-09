/**
 * Created by hzou on 12/12/15.
 */

(function () {
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------

  angular.module('isc.directives')
    .directive('iscCriticalBanner', iscCriticalBanner);

  /* @ngInject */
  function iscCriticalBanner() {//jshint ignore:line

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict        : 'EA',
      scope           : {
        message : '@',
        cssClass: '@'
      },
      controller      : controller,
      controllerAs    : 'iscBannerCtrl',
      bindToController: true,
      templateUrl     : function (elem, attrs) {
        return attrs.templateUrl || 'directives/iscCriticalBanner/iscCriticalBanner.html';
      }
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function controller() {
      var self = this;
    }

  }//END CLASS



})();
