
(function(){
  'use strict';

  bindDirective.$inject = [ '$log','$compile' ];

  function bindDirective( $log,$compile ){

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      restrict: 'A',
      link: function($scope, $element, $attrs) {
        var html = $scope.$eval($attrs.bindDirective),
          toCompile = angular.element('<' + html + '>');
        $element.append($compile(toCompile)($scope));

        //call parent handler
        $element.bind("click", function () {

          //pass in method define in parent declaration
          $scope.$apply($attrs.click);
        })
      }
    };

    return directive;

  } //END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscHsCommunityAngular' )
    .directive( 'bindDirective', bindDirective );

})();

