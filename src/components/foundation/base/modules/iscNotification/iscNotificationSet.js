(function () {
  'use strict';

  angular.module('isc.notification')
    .directive('iscNotificationSet', iscNotificationSet);


  /* @ngInject */
  function iscNotificationSet() {//jshint ignore:line
    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict        : 'E',
      replace         : true,
      templateUrl     : 'iscNotification/iscNotificationSet.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

  }//END CLASS

})();