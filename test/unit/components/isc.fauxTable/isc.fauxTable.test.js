/**
 * Created by hzou on 6/18/16.
 */

(function() {


  describe( 'isc.fauxTable directive', function() {
    var suite;

    // show $log statements
    beforeEach( module( function( $provide ) {
      $provide.value( '$log', mock$log );
    } ) );

    // setup devlog
    beforeEach( module( 'isc.core', function( devlogProvider ) {
      devlogProvider.loadConfig( customConfig );
    } ) );

    beforeEach( module( 'isc.fauxTable', 'isc.templates' ) );

    var html = "<faux-table config='' data=''></faux-table>";
    beforeEach( inject( function( $rootScope, $compile ) {
      suite            = {};
      suite.$rootScope = $rootScope;
      suite.$scope     = $rootScope.$new();
      suite.element    = $compile( html )( suite.$scope );
      suite.$scope.$digest();
      suite.$isolateScope = suite.element.isolateScope();
      suite.controller    = suite.$isolateScope.fauxTblCtrl;
    } ) );

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.$scope ).toBeDefined();
        expect( suite.element ).toBeDefined();
        expect( suite.$isolateScope ).toBeDefined();
        expect( suite.controller ).toBeDefined();
      } );
    } );

    describe( 'table sort', function() {
      it( 'should first sort ASC', function() {
        var column = { model: "John Smith" };
        suite.controller.sort( column );
        expect( suite.controller.sortBy ).toBe( column.model );
        expect( suite.controller.sortDirection ).toBe( false );
      } );

      it( 'should change sort to DESC sorting an pre-sorted column', function() {
        var column                     = { model: "John Smith" };
        suite.controller.sortBy        = column.model;
        suite.controller.sortDirection = false;
        suite.controller.sort( column );
        expect( suite.controller.sortBy ).toBe( column.model );
        expect( suite.controller.sortDirection ).toBe( true );
      } );

      it( 'should change to ASC when column is sorted by DESC', function() {
        var column                     = { model: "John Smith" };
        suite.controller.sortBy        = column.model;
        suite.controller.sortDirection = true;
        suite.controller.sort( column );
        expect( suite.controller.sortBy ).toBe( column.model );
        expect( suite.controller.sortDirection ).toBe( false );
      } );

    } );


    describe( 'table getSort', function() {
      it( 'should return null if column is not sorted', function() {
        var column                     = { model: "John Smith" };
        suite.controller.sortBy        = "Jane Doe";
        suite.controller.sortDirection = true;
        var actual                     = suite.controller.getSort( column );
        expect( actual ).toBe( null );
      } );

      it( 'should return "asc" if column is sorted asc', function() {
        var column                     = { model: "John Smith" };
        suite.controller.sortBy        = "John Smith";
        suite.controller.sortDirection = true;
        var actual                     = suite.controller.getSort( column );
        expect( actual ).toBe( 'asc' );
      } );

      it( 'should return "desc" if column is sorted asc', function() {
        var column                     = { model: "John Smith" };
        suite.controller.sortBy        = "John Smith";
        suite.controller.sortDirection = false;
        var actual                     = suite.controller.getSort( column );
        expect( actual ).toBe( 'desc' );
      } );

    } );

  } );
})();