/**
 * Created by douglas goodman on 2/26/15.
 *
 *  @params
 *  radioGroup Array - a list of objects that form the group of radio buttons
 *  radioItem Object - the selected item from the radioGroup
 *                    (MUST be a member of the radioGroup array to work properly)
 *
 *  SAMPLE HTML USAGE*
 * <isc-radio radio-item="scope.selectedItem" radio-group="myRadioGroup" ng-click="onRadioSelect( scope.selectedItem )><isc-radio>
 */

(function(){
  'use strict';

  /* @ngInject */
  function iscRadio( devlog, iscRadioGroupHelper ){
    devlog.channel('iscRadio').debug( 'iscRadio LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      transclude: false,
      scope: {
        radioGroup: '=',
        radioItem: '='
      },
      link: link,
      templateUrl: function (elem, attrs) {
        return attrs.templateUrl || 'svg/isc-radio.html';
      }
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){//jshint ignore:line

      scope.toggle = function(){
        iscRadioGroupHelper.radioSelect( scope.radioItem, scope.radioGroup );
      };
    }

  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'isc.directives' )
      .directive( 'iscRadio', iscRadio );

})();
