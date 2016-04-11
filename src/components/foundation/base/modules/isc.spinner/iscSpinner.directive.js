(function () {
  'use strict';

  angular
    .module('isc.spinner')
    .directive('iscSpinner', iscSpinner);

  /**
   * @ngDoc directive
   * @memberOf isc.spinner
   * @returns {{bindToController: {}, controller: iscSpinnerController, controllerAs: string, restrict: string, templateUrl: directive.templateUrl}}
     */
  function iscSpinner() {
    var directive = {
      bindToController: {},
      controller      : iscSpinnerController,
      controllerAs    : 'spinnerCtrl',
      restrict        : 'EA',
      templateUrl     : function (elem, attrs) {
        return attrs.templateUrl || 'isc.spinner/iscSpinner.html';
      }
    };
    return directive;

    /* @ngInject */
    /**
     * @ngDoc controller
     * @memberOf iscSpinner
     * @param devlog
     * @param iscSpinnerModel
       */
    function iscSpinnerController(devlog, iscSpinnerModel) {
      devlog.channel('iscSpinnerController').debug('inside iscSpinnerController');
      var self       = this;
      self.isLoading = isLoding;

      function isLoding() {
        return iscSpinnerModel.getPendingReqs() > 0;
      }
    }
  }

})();

