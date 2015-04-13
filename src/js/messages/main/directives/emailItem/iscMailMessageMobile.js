/**
 * Created by douglasgoodman on 12/8/14.
 */
(function(){
  'use strict';

  iscMailMessageMobile.$inject = ['$log'];

  function iscMailMessageMobile( $log ){

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------

    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {
        mail: '=',
        showTo: '=', // if false, it will display the from field
        onToggleMessage: '&'
      },

      controller: 'iscMailMessageController as mmCtrl',
      templateUrl: 'messages/directives/iscMailMessageMobile.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

  }

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscMessages' )
      .directive( 'iscMailMessageMobile', iscMailMessageMobile );

})();

