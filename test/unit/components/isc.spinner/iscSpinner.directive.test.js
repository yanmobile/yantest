/**
 * Created by hzou on 6/18/16.
 */

(function() {


  describe( 'isc.spinner directive', function() {
    var suite;

    // show $log statements
    beforeEach( module( function( $provide ) {
      $provide.value( '$log', mock$log );
    } ) );

    // setup devlog
    beforeEach( module( 'isc.core', function( devlogProvider ) {
      devlogProvider.loadConfig( customConfig );
    } ) );

    beforeEach( module( 'isc.spinner', 'isc.templates' ) );

    var html = "<isc-spinner></isc-spinner>";
    beforeEach( inject( function( $rootScope, $compile, iscSpinnerModel ) {
      suite                 = {};
      suite.$rootScope      = $rootScope;
      suite.$scope          = $rootScope.$new();
      suite.iscSpinnerModel = iscSpinnerModel;
      suite.element         = $compile( html )( suite.$scope );
      suite.$scope.$digest();
      suite.$isolateScope = suite.element.isolateScope();
      suite.controller    = suite.$isolateScope.spinnerCtrl;
    } ) );

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.$scope ).toBeDefined();
        expect( suite.element ).toBeDefined();
        expect( suite.$isolateScope ).toBeDefined();
        expect( suite.iscSpinnerModel ).toBeDefined();
      } );
    } );

    describe( 'controller', function() {
      it( 'should have isLoading == false when pendingReqs.length === 0', function() {
        var length = suite.iscSpinnerModel.getPendingReqs();
        expect( length ).toBe( 0 );
        expect( suite.controller.isLoading() ).toBe( false );
      } );

      it( 'should have isLoading == true when pendingReqs.length > 0', function() {
        suite.iscSpinnerModel.addPendingReq( "/myUrl" );
        var length = suite.iscSpinnerModel.getPendingReqs();
        expect( length ).toBe( 1 );
        expect( suite.controller.isLoading() ).toBe( true );
      } );
    } );
  } );
})();