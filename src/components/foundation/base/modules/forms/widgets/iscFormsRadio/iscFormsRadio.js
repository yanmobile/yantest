(function () {
  'use strict';

  angular.module('isc.core')
    .directive('iscFormsRadio', iscFormsRadio);

  /* @ngInject */
  function iscFormsRadio() {//jshint ignore:line
    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict        : 'E',
      replace         : true,
      require         : 'ngModel',
      scope           : true,
      bindToController: {
        model  : '=',
        options: '='
      },
      controllerAs    : 'radioCtrl',
      controller      : controller,
      link            : link,
      templateUrl     : 'forms/widgets/iscFormsRadio/iscFormsRadio.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function controller() {
    }

    function link(scope, elem, attrs, ngModel) {
      var options = scope.radioCtrl.options;

      scope.displayProp = _.get(options, 'data.displayField', 'name');
      scope.valueProp   = _.get(options, 'data.valueField', 'value');
      scope.groupProp   = _.get(options, 'data.groupField', 'group');

      ngModel.$render = function () {
        if (ngModel.$viewValue) {
          scope.radioCtrl.model = ngModel.$viewValue;
        }
      };

      scope.onSelect = function (option) {
        scope.radioCtrl.model = option;
        ngModel.$setTouched();
        ngModel.$setViewValue(scope.radioCtrl.model);
      };
    }

  }//END CLASS
})();
