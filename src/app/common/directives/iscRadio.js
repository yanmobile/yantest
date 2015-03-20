/**
 * Created by douglas goodman on 2/26/15.
 */

(function(){
  'use strict';

  iscRadio.$inject = [ '$log'];

  function iscRadio( $log ){
//    //$log.debug( 'iscRadio LOADED');

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
      templateUrl: 'shared/svg/isc-radio.html'
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

      scope.toggle = function(){
        scope.selected = !scope.selected;
        scope.onToggle( {selected: scope.selected} );

        if( ngModelCtrl ){
          //$log.debug( 'iscRadio.$setViewValue');
          ngModelCtrl.$setViewValue( !ngModelCtrl.$viewValue );
        }
      };
    }

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.common' )
      .directive( 'iscRadio', iscRadio );

})();
