/**
 * Created by douglasgoodman on 11/18/14.
 */

(function(){
  'use strict';

  iscHomeModel.$inject = [ '$log' ];

  function iscHomeModel( $log ){
//    //$log.debug( 'iscHomeModel LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    var patientData = null;
    var panelData = null;

    // ----------------------------
    // class factory
    // ----------------------------

    var model = {
      getPatientData: getPatientData,
      setPatientData: setPatientData,
      getPanelData: getPanelData,
      setPanelData: setPanelData
    };

    return model;

    // ----------------------------
    // functions
    // ----------------------------

    function getPatientData(){
      return patientData;
    }

    function setPatientData( val ){
      //$log.debug( 'iscHomeModel.setPatientData' );
      //$log.debug( '...val ' + JSON.stringify( val ) );
      patientData = val;
    }

    function setPanelData(val){
      panelData = val;
    }

    function getPanelData(){
      return panelData ;
    }

} // END CLASS
  // ----------------------------
  // inject
  // ----------------------------

  angular.module( 'iscHome' )
      .factory( 'iscHomeModel', iscHomeModel );

})();
