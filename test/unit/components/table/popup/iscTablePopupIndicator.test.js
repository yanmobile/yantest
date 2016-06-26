/**
 * Created by hzou on 6/25/16.
 */

(function() {

  describe( 'isc.table iscTablePopupIndicator', function() {
    var suite;

    window.useDefaultModuleConfig();

    beforeEach( module( 'isc.table', 'isc.templates', 'foundation' ) );

    var html = "<div isc-table-popup-indicator></div>";
    beforeEach( inject( function( $rootScope, $compile, keyCode ) {
      suite            = window.createSuite();
      suite.$compile   = $compile;
      suite.keyCode    = keyCode;
      suite.$rootScope = $rootScope;
      suite.$scope     = $rootScope.$new();
      _.set( suite.$scope, "iscTblCtrl.tableConfig.columns", [{ type: "command" }] );

      suite.element = $compile( html )( suite.$scope );
      suite.$scope.$digest();
    } ) );

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.$scope ).toBeDefined();
        expect( suite.$compile ).toBeDefined();
        expect( suite.element ).toBeDefined();
        expect( suite.$scope.iscTblIndic ).toBeDefined();
      } );
    } );

    describe( 'element\s controller', function() {

      it( 'should have access to iscTblIndic and its properties', function() {
        var elementScope = suite.element.scope();
        expect( elementScope ).toBe( suite.$scope );

        expect( suite.$scope.iscTblIndic.inPopup ).toEqual( true );


      } );

    } );
  } );
})();