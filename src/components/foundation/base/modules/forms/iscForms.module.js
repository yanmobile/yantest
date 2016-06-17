( function() {
  'use strict';
  angular.module( 'isc.forms', ['ui.router', 'isc.states'] )
    .config( function( iscStateProvider ) {
      iscStateProvider.state( getTopNavTabs() );
    } )

    .run( function( iscFormlyFoundationTemplates ) {
      iscFormlyFoundationTemplates.init();
    } );

  function getTopNavTabs() {
    return {
      'index.form'               : {
        state      : 'index.form',
        url        : 'forms/:mode/:formKey?formDataId',
        templateUrl: 'forms/iscForms.html',
        controller : 'iscFormsController as formsCtrl',
        roles      : ['*']
      },
      'index.formByVersion'      : {
        state      : 'index.formByVersion',
        url        : 'forms/:mode/:formKey/:formVersion?formDataId',
        templateUrl: 'forms/iscForms.html',
        controller : 'iscFormsController as formsCtrl',
        roles      : ['*']
      }
    };
  }
} )();
