/**
 * Created by douglas goodman on 2/26/15.
 */

(function(){
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.directives' )
    .directive( 'iscRoundCheckBox', iscRoundCheckBox );

  /* @ngInject */
  /**
   * @memberof core-ui-directives
   * @ngdoc directive
   * @param devlog
   * @returns {{restrict: string, transclude: boolean, require: string, scope: {onToggle: string}, link: link, templateUrl: directive.templateUrl}}
     */
  function iscRoundCheckBox( devlog ){//jshint ignore:line
    devlog.channel('iscRoundCheckBox').debug( 'iscRoundCheckBox LOADED');

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
        return attrs.templateUrl || 'svg/isc-rounded-checkbox.html';
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
          devlog.channel('iscRoundCheckBox').debug( 'iscRoundCheckBox.$setViewValue');
          ngModelCtrl.$setViewValue( !ngModelCtrl.$viewValue );
        }
      };
    }

  }//END CLASS



})();
