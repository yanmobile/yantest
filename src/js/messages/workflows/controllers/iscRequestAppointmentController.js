/**
 * Created by douglasgoodman on 3/13/15.
 */

(function(){

  'use strict';

  iscRequestAppointmentController.$inject = [ '$log', '$scope' ];

  function iscRequestAppointmentController( $log, $scope ){
//    //$log.debug( 'iscRequestAppointmentController LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var self = this;

    self.selectedProvider = {label:"ISC_NO_PROVIDER_SELECTED", data: 0};
    self.favoritesList = [
      {label: 'Dr One', id: 1},
      {label: 'Dr Two', id: 2},
      {label: 'Dr Three', id: 3},
      {label: 'Dr Four', id: 4}
    ];

    self.lookupProviderDataModel = {
      favoritesList: self.favoritesList,
      selectedProvider: self.selectedProvider,
      isComplete: false
    };

    self.defaultAppointmentType = {
      label: 'ISC_SELECT_APPOINTMENT_TYPE',
      allTypes: [],
      selectedType: null
    };

    self.appointmentTypeData = {
      appointmentType: self.defaultAppointmentType
    };

    self.selectFavorite = function( item ){
      //$log.debug( 'iscRequestAppointmentController.selectFavorite ', item );
      self.selectedProvider = item;
    };

    self.isStep4Complete = function( valid ){
      //$log.debug( 'iscRequestAppointmentController.step4Complete ', valid );
    };


    // ----------------------------
    // functions
    // ----------------------------

    // ----------------------------
    // listeners
    // ----------------------------

    //$scope.$on( 'iscShowAppointmentTypes', function( evt, data){
    //  //$log.debug( 'iscRequestAppointment.showAppointmentTypes', data );
    //
    //  data.callback();
    //})

  }// END CLASS


  // ----------------------------
  // injection
  // ----------------------------
  angular.module('iscMessages')
      .controller('iscRequestAppointmentController', iscRequestAppointmentController );

})();
