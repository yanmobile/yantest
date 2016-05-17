( function() {
  'use strict';

  angular
    .module( 'isc.forms' )
    .constant( 'FORMS_EVENTS', {
      resetFormModel: 'iscFormsResetFormModel',
      setFormModel  : 'iscFormsSetFormModel',
      showSubform   : 'iscFormsShowSubform',
      hideSubform   : 'iscFormsHideSubform'
    } );

} )();
