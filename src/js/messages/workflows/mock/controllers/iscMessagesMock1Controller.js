

(function(){

  'use strict';

  iscMessagesMock1Controller.$inject = [ '$log', '$scope' ];

  function iscMessagesMock1Controller( $log, $scope ){


    //$log.debug( 'iscMessagesMock1Controller LOADED');


    // ----------------------------
    // vars
    // ----------------------------

    var self = this;


    if ($scope.$parent.directive.complete == false){

      self.state = false;
    }
    else{

      self.state = true;
    }




    // ----------------------------
    // functions
    // ----------------------------

    self.doStepComplete = function(  ){



      //don't do anything if we are on confirmation page.
      if ($scope.$parent.$parent.isFormComplete){
        return;
      }

      //self.state = !self.state;

      $scope.$parent.$parent.mraCtrl.doStepComplete($scope.$parent,self.state);

    };



  }// END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module('iscMessages')
    .controller('iscMessagesMock1Controller', iscMessagesMock1Controller );

})();
