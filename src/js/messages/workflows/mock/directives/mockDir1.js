
(function(){
  'use strict';

  mockDir1.$inject = [ '$log','$rootScope' ];

  function mockDir1( $log, $rootScope ){

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {},
      templateUrl: 'mockHtml/mock1.html',
      controller: 'iscMessagesMock1Controller as mmCtrl'
    };

    return directive;

  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscMessages' )
    .directive( 'mockDir1', mockDir1 );

})();

