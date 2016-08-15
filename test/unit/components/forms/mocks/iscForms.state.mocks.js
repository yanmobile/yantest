var defaultStates = {
  'index.form'         : {
    state      : 'index.form',
    url        : 'forms/:mode/:formKey?formDataId',
    templateUrl: 'forms/iscForms.html',
    controller : 'iscFormsController as formsCtrl',
    roles      : ['*']
  },
  'index.formByVersion': {
    state      : 'index.formByVersion',
    url        : 'forms/:mode/:formKey/:formVersion?formDataId',
    templateUrl: 'forms/iscForms.html',
    controller : 'iscFormsController as formsCtrl',
    roles      : ['*']
  }
};

function mockDefaultFormStates() {
  beforeEach( module( 'isc.forms',
    function( iscStateProvider ) {
      iscStateProvider.state( defaultStates );
    } )
  );
}