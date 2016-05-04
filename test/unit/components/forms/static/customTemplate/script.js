(function () {
  return {
    "name"          : "customTemplate",
    "extends"       : "input",
    "templateUrl"   : "customTemplate.input.html",
    "controller"    : ['$scope', function ($scope) {
      var templateOptions         = $scope.to;
      templateOptions.placeholder = 'Set in custom controller';
    }],
    "defaultOptions": {
      "templateOptions": {
        "onFocus": "model.customControlFocused = true",
        "onBlur" : "model.customControlFocused = false"
      },
      "data" : {
        "viewMode" : {
          "template" : "<div></div>"
        }
      }
    }
  }
})();
