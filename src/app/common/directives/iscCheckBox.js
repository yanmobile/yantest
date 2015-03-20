/**
 * Created by douglas goodman on 2/26/15.
 */

(function(){
  'use strict';

  iscCheckBox.$inject = [ '$log'];

  function iscCheckBox( $log ){
//    //$log.debug( 'iscCheckBox LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      transclude: true,
      require: '?ngModel',
      scope: {
        onToggle: '&'
      },
      link: link,
      templateUrl: 'shared/svg/isc-checkbox.html'
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
