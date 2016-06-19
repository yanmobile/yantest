/**
 * Created by hzou on 6/18/16.
 */

(function() {


  describe( 'isc.spinner.interceptor', function() {
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
    beforeEach( inject( function( $rootScope, $compile, iscSpinnerModel, httpLoaderInterceptor ) {
      suite                       = {};
      suite.$rootScope            = $rootScope;
      suite.$scope                = $rootScope.$new();
      suite.httpLoaderInterceptor = httpLoaderInterceptor;
      suite.iscSpinnerModel       = iscSpinnerModel;
      // suite.$scope.$digest();
      // suite.$isolateScope = suite.element.isolateScope();
    } ) );

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.$scope ).toBeDefined();
        expect( suite.httpLoaderInterceptor ).toBeDefined();
      } );
    } );

    describe( 'request', function() {
      it( 'should not add pendingReq when showConfig is not passed', function() {
        suite.httpLoaderInterceptor.request( {} );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 0 );
      } );

      it( 'should add pendingReq when showConfig is passed', function() {
        suite.httpLoaderInterceptor.request( { showLoader: true } );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 1 );
      } );
    } );

    describe( 'response', function() {
      it( 'should not remove pendingReq when showConfig is not passed', function() {
        suite.iscSpinnerModel.addPendingReq( "myKey" );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 1 );
        suite.httpLoaderInterceptor.response( { config: { url: "myKey" } } );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 1 );
      } );

      it( 'should remove pendingReq when showConfig is passed', function() {
        suite.iscSpinnerModel.addPendingReq( "myKey" );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 1 );
        suite.httpLoaderInterceptor.response( { config: { url: "myKey", showLoader: true } } );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 0 );
      } );
    } );
    describe( 'responseError', function() {
      it( 'should not remove pendingReq when showConfig is not passed', function() {
        suite.iscSpinnerModel.addPendingReq( "myKey" );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 1 );
        suite.httpLoaderInterceptor.responseError( { config: { url: "myKey" } } );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 1 );
      } );

      it( 'should remove pendingReq when showConfig is passed', function() {
        suite.iscSpinnerModel.addPendingReq( "myKey" );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 1 );
        suite.httpLoaderInterceptor.responseError( { config: { url: "myKey", showLoader: true } } );
        expect( suite.iscSpinnerModel.getPendingReqs() ).toBe( 0 );
      } );
    } );

  } );
})();