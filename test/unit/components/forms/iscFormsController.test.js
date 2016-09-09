(function() {
  'use strict';

  describe( 'iscFormsController', function() {
    var suite = {};

    useDefaultFormsModules();

    mockDefaultFormStates();
    
    // this loads all the external templates used in directives etc
    // eg, everything in **/partials/*.html
    beforeEach( module( 'isc.templates' ) );

    beforeEach( inject( function( $rootScope, $controller, $state, $stateParams, iscSessionModel ) {
      suite = window.createSuite();

      var scope = $rootScope.$new();

      suite.controller = $controller( 'iscFormsController as formsCtrl',
        {
          '$scope'      : scope,
          '$stateParams': $stateParams
        } );

      suite.self = scope.formsCtrl;
    } ) );

    // -------------------------
    describe( 'iscFormsController', function() {
      it( 'should load the state params', function() {
        expect( suite.self.params ).toEqual( {} );
        expect( suite.self.formConfig ).toEqual( {} );
      } );

    } );

  } );
})();

