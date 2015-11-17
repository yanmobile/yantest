/**
 * Created by douglas goodman on 2/26/15.
 */

 // ******* NOTE: The ng-model you put on this element has to reference a property of a property on scope, not a property on scope **********

(function(){
  'use strict';

  iscCheckBox.$inject = [ '$log'];

  function iscCheckBox( $log ){//jshint ignore:line
//    //$log.debug( 'iscCheckBox LOADED');

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
      templateUrl: 'svg/isc-checkbox.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

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
          //$log.debug( 'iscCheckBox.$setViewValue');
          ngModelCtrl.$setViewValue( !ngModelCtrl.$viewValue );
        }
      };
    }

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.common' )
      .directive( 'iscCheckBox', iscCheckBox );

})();
