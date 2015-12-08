/**
 * Created by hzou on 07/28/2015
 *
 */

// this directive is used for care team's health & social care contacts

(function(){
  'use strict';

  iscTablePopupIndicator.$inject = [ '$log', '$state', '$templateCache', '$compile' ];

  function iscTablePopupIndicator($log, $state, $templateCache, $compile){//jshint ignore:line
    //$log.debug( 'iscTablePopupIndicator LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    // ----------------------------
    // class factory
    // ----------------------------
    return {
      restrict    : "A",
      controller  : controller,
      controllerAs: "iscTblIndic"
    };

    // ----------------------------
    // functions
    // ----------------------------
    function controller($scope){
      var self      = this;
      self.inPopup  = true;
      self.commands = (_.find($scope.iscTblCtrl.tableConfig.columns, { type: "commands" }) || {}).commands;
    }
  }// END CLASS

  // ----------------------------
  // injection
  // ----------------------------
  angular.module('isc.table')
    .directive('iscTablePopupIndicator', iscTablePopupIndicator);

})();
