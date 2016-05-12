( function () {
  'use strict';
  angular.module( 'isc.forms', ['ui.router', 'isc.states'] )
    .config( function ( iscStateProvider ) {
      iscStateProvider.state( getTopNavTabs() );
    } )

    .run( function ( iscFormlyFoundationTemplates ) {
      iscFormlyFoundationTemplates.init();
    } );

  function getTopNavTabs() {
    return {
      'index.activeForm': {
        state      : 'index.activeForm',
        url        : 'forms/:mode/:formType?id&dataModelType&dataModelKey&dataModelId&useOriginalFormKey',
        templateUrl: 'forms/iscForms.html',
        controller : 'iscFormsController as formsCtrl',
        roles      : ['*']
      },
      'index.form'      : {
        state      : 'index.form',
        url        : 'forms/:mode/:formType/:formKey?id&dataModelType&dataModelKey&dataModelId&useOriginalFormKey',
        templateUrl: 'forms/iscForms.html',
        controller : 'iscFormsController as formsCtrl',
        roles      : ['*']
      }
    };
  }
} )();
