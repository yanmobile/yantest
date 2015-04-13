/**
 * Created by douglasgoodman on 12/8/14.
 */
(function(){
  'use strict';

  iscMailMessage.$inject = [ '$log' ];

  function iscMailMessage( $log ){

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
      templateUrl: 'messages/directives/iscMailMessage.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------


  } // END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscMessages' )
      .directive( 'iscMailMessage', iscMailMessage );

})();

