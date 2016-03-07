/**
 * Created by douglas goodman on 2/26/15.
 */

 // ******* NOTE: The ng-model you put on this element has to reference a property of a property on scope, not a property on scope **********

(function(){
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.directives' )
    .directive( 'iscCheckBox', iscCheckBox );

  /* @ngInject */
  /**
   * @memberof core-ui-directives
   * @ngdoc directive
   * @param devlog
   * @returns {{restrict: string, transclude: boolean, require: string, scope: {onToggle: string}, link: link, templateUrl: directive.templateUrl}}
     */
  function iscCheckBox( devlog ){//jshint ignore:line
//    devlog.channel('iscCheckBox').debug( 'iscCheckBox LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      transclude: false,
      require: '?ngModel',
      scope: {
        onToggle: '&'
      },
      link: link,
      templateUrl: function (elem, attrs) {
        return attrs.templateUrl || 'svg/isc-checkbox.html';
      }
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    /**
     *
     * @param scope
     * @param elem
     * @param attr
     * @param ngModelCtrl
       */
    function link( scope, elem, attr, ngModelCtrl ){

      scope.selected = false;

      if( ngModelCtrl ){
        ngModelCtrl.$render = function(){
          scope.selected = ngModelCtrl.$viewValue;
        };
      }

      scope.toggleCheckBox = function(){
        scope.selected = !scope.selected;
        scope.onToggle( {selected: scope.selected} );

        if( ngModelCtrl ){
          devlog.channel('iscCheckBox').debug( 'iscCheckBox.$setViewValue');
          ngModelCtrl.$setViewValue( !ngModelCtrl.$viewValue );
        }
      };
    }

  }//END CLASS



})();
