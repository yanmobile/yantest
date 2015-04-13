/**
 * Created by douglasgoodman on 3/4/15.
 */
(function(){
  'use strict';

  iscMessagesEmergencyWarning.$inject = [ '$log' ];

  function iscMessagesEmergencyWarning( $log ){

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
        closeWarning: '&',
        showEmergencyWarning: '='
      },

      link: link,
      templateUrl: 'messages/directives/iscMessagesEmergencyWarning.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------
    function link( scope, elem, attr ){
      //$log.debug( 'iscMessagesEmergencyWarning.LINK', scope.showEmergencyWarning )
    }

  }// END CLASS

  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscMessages' )
      .directive( 'iscMessagesEmergencyWarning', iscMessagesEmergencyWarning );

})();

