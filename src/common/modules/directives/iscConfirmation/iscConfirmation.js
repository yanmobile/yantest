/**
 * Created by hzou on 9/16/15.
 */

(function(){
  'use strict';
  // ----------------------------
  // injection
  // ----------------------------

  angular.module('isc.directives')
    .directive('iscConfirmation', iscConfirmation);

  /* @ngInject */
  function iscConfirmation(){//jshint ignore:line

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict    : 'E',
      templateUrl : 'directives/iscConfirmation/iscConfirmation.html',
      link        : link,
      controller  : controller,
      controllerAs: 'iscConfirmCtrl'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function link($scope, elem, attrs, iscConfirmCtrl){
      var modalScope = elem.find('[zf-modal]').scope();
      $scope.$watch('iscConfirmCtrl.service.isOpen', function(newVal, oldVal){
        if( newVal !== oldVal ){
          if(newVal === true){
            modalScope.show();
          } else {
            modalScope.hide();
          }
        }
      });
    }
    /* @ngInject */
    function controller(iscConfirmationService){
      var self     = this;
      self.service = iscConfirmationService;
    }

  }//END CLASS



})();
