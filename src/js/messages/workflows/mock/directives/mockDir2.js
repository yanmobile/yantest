
(function(){
  'use strict';

  mockDir2.$inject = [ '$log' ];

  function mockDir2( $log ){

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {myState: '@'},
      templateUrl: 'mockHtml/mock2.html',
      controller: 'iscMessagesMock2Controller as mmCtrl'
    };

    return directive;

  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscMessages' )
    .directive( 'mockDir2', mockDir2 );

})();

