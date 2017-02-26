/**
 * Created by hzou on 6/18/16.
 */

(function() {


  describe( 'isc.spinner.model', function() {
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
      // suite.element         = $compile( html )( suite.$scope );
      // suite.$scope.$digest();
      // suite.$isolateScope = suite.element.isolateScope();
    } ) );

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.$scope ).toBeDefined();
        // expect( suite.element ).toBeDefined();
        // expect( suite.$isolateScope ).toBeDefined();
        expect( suite.iscSpinnerModel ).toBeDefined();
      } );
    } );

    describe( "addPendingReq", function() {
      it( 'should have 1 pendingReq when added', function() {
        suite.iscSpinnerModel.addPendingReq( "myUrl" );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 1 );
      } );

      it( 'should have 1 pendingReq when added multiple of the same key', function() {
        suite.iscSpinnerModel.addPendingReq( "myUrl" );
        suite.iscSpinnerModel.addPendingReq( "myUrl" );
        suite.iscSpinnerModel.addPendingReq( "myUrl" );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 1 );
      } );

      it( 'should have 0 pendingReq when added and then subtract', function() {
        suite.iscSpinnerModel.addPendingReq( "myUrl" );
        suite.iscSpinnerModel.subtractPendingReq( "myUrl" );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 0 );
      } );

      it( 'should have 0 pendingReq when added subtracting of the same key', function() {
        suite.iscSpinnerModel.addPendingReq( "myUrl" );
        suite.iscSpinnerModel.subtractPendingReq( "myUrl" );
        suite.iscSpinnerModel.subtractPendingReq( "myUrl" );
        suite.iscSpinnerModel.subtractPendingReq( "myUrl" );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 0 );
      } ); 
    } );
  } );
})();