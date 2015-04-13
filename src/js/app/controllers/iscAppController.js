/**
 * Created by douglasgoodman on 3/17/15.
 */

(function(){

  'use strict';

  iscAppController.$inject = [ '$log', '$rootScope', '$scope', 'MODAL_EVENTS' ];

  function iscAppController( $log, $rootScope, $scope, MODAL_EVENTS ){
//    //$log.debug( 'iscAppController LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;

    self.showPopup = false;
    self.popupTitle;
    self.popupListItems;
    self.popupSelectCallback;

    // ----------------------------
    // functions
    // ----------------------------

    self.optionsPopupSelect = function( selection ){
      //$log.debug( 'iscAppController.optionsPopupSelect', selection );

      self.popupSelectCallback( selection );
      self.hideOptionsPopup();
    };

    self.showOptionsPopup = function( popupData ){
      //$log.debug( 'iscAppController.showOptionsPopup', popupData );
      self.popupTitle = popupData.popupTitle;
      self.popupListItems = popupData.popupListItems;
      self.popupSelectCallback = popupData.callback;
      self.showPopup = true;
    };

    self.hideOptionsPopup = function(){
      //$log.debug( 'iscAppController.hideOptionsPopup' );
      self.showPopup = false;
    };

    // ----------------------------
    // listeners
    // ----------------------------

    $scope.$on( MODAL_EVENTS.showOptionsPopup, function( evt, data){
      //$log.debug( 'iscAppController.showAppointmentTypes', data );

      self.showOptionsPopup( data );
    })

  }// END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module('iscHsCommunityAngular')
      .controller('iscAppController', iscAppController );

})();
