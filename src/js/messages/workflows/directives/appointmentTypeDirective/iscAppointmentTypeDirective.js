/**
 * Created by douglas goodman on 3/13/15.
 */

(function(){
  'use strict';

  iscAppointmentTypeDirective.$inject = [ '$log', '$rootScope', 'MODAL_EVENTS'];

  function iscAppointmentTypeDirective( $log, $rootScope, MODAL_EVENTS ){
    //$log.debug( 'iscAppointmentTypeDirective.LOADED');

    // ----------------------------
    // vars
    // ----------------------------

    /**
     * private
     */

    var primaryCareTypes = [
      {id: 'p1', label: 'ISC_ANNUAL_PHYSICAL', reason: '', reasonRequired: false},
      {id: 'p2', label: 'ISC_NEW_CONCERN', reason: '', reasonRequired: true},
      {id: 'p3', label: 'ISC_FOLLOW_UP', reason: '', reasonRequired: true},
      {id: 'p4', label: 'ISC_OTHER', reason: '', reasonRequired: true}
    ];

    var specialistTypes = [
      {id: 's1', label: 'ISC_NEW_CONCERN', reason: '', reasonRequired: true},
      {id: 's2', label: 'ISC_FOLLOW_UP', reason: '', reasonRequired: true},
      {id: 's3', label: 'ISC_OTHER', reason: '', reasonRequired: true}
    ];

    var labworkTypes = [
      {id: 'l1', label: 'ISC_REFERRAL', reason: '', reasonRequired: true},
      {id: 'l2', label: 'ISC_FOLLOW_UP', reason: '', reasonRequired: true},
      {id: 'l3', label: 'ISC_OTHER', reason: '', reasonRequired: true}
    ];

    var appointmentTypes = [
      {
        id: 'a1',
        label: 'ISC_PRIMARY_CARE',
        allTypes: primaryCareTypes,
        selectedType: {}
      },
      {
        id: 'a2',
        label: 'ISC_SPECIALIST',
        allTypes: specialistTypes,
        selectedType:{}
      },
      {
        id: 'a3',
        label: 'ISC_LABWORK',
        allTypes: labworkTypes,
        selectedType: {}
      }
    ];


    // ----------------------------
    // class factory
    // ----------------------------
    var directive = {
      restrict: 'EA',
      replace: true,
      scope: {
        modelData: '=',
        onChange: '&',
        select: '&'
      },
      link: link,
      templateUrl: 'messages/workflows/directives/appointmentType/iscAppointmentTypeDirective.html'
    };

    return directive;

    // ----------------------------
    // functions
    // ----------------------------

    function link( scope, elem, attr ){
      //$log.debug('iscAppointmentTypeDirective.link', scope.modelData );

      // ------------
      // vars
      // ------------

      scope.showRadioButtons = false;

      // ------------
      // functions
      // ------------

      scope.showAppointmentTypes = function(){
        //$log.debug('iscAppointmentTypeDirective.showAppointmentTypes');
        $rootScope.$broadcast( MODAL_EVENTS.showOptionsPopup, eventData )
      };

      scope.onSelect = function( selectedItem ){
        //$log.debug('iscAppointmentTypeDirective.onSelect', selectedItem);
        scope.modelData.appointmentType = selectedItem;

        scope.showRadioButtons = ( scope.modelData.appointmentType.allTypes.length > 1 );

        scope.doValidation();
      };

      scope.doValidation = function(){
        scope.onChange( {valid:scope.isValid() }) ;
      };

      scope.isValid = function(){
        var selectedType = scope.modelData.appointmentType.selectedType;

        //$log.debug('iscAppointmentTypeDirective.isValid, selectedType',selectedType);

        if( !selectedType ){
          return false;
        }

        if( selectedType.reasonRequired && !selectedType.reason ){
          return false;
        }

        return true;
      };

      /**
       * private
       * @type object
       */
      var eventData = {
        popupTitle: 'ISC_SELECT_APPOINTMENT_TYPE',
        popupListItems: appointmentTypes,
        callback: scope.onSelect
      };
    }


  }//END CLASS


  // ----------------------------
  // injection
  // ----------------------------

  angular.module( 'iscMessages' )
      .directive( 'iscAppointmentTypeDirective', iscAppointmentTypeDirective );

})();
