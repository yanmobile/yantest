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
        id           : '=',
        model        : '=',
        options      : '=',
        isObjectModel: '='
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
      var self = this;

    }

    function link(scope, elem, attrs, ngModel) {
      var ctrl          = scope.radioCtrl,
          options       = ctrl.options,
          isObjectModel = ctrl.isObjectModel;

      scope.displayProp = _.get(options, 'data.displayField', 'name');
      scope.valueProp   = _.get(options, 'data.valueField', 'value');
      scope.groupProp   = _.get(options, 'data.groupField', 'group');

      ngModel.$render = function () {
        if (ngModel.$viewValue) {
          ctrl.model = ngModel.$viewValue;
        }
      };

      scope.onSelect = function (option) {
        ctrl.model = option;
        ngModel.$setTouched();
        ngModel.$setViewValue(ctrl.model);
      };

      ctrl.isChecked = function (option) {
        if (isObjectModel) {
          return ctrl.model[scope.valueProp] === option[scope.valueProp];
        }
        else {
          return ctrl.model === option;
        }
      };
    }

  }//END CLASS
})();
