/**
 * Created by hzou on 6/25/16.
 */

(function() {

  describe( 'isc.table iscTablePopupOpener', function() {
    var suite;

    window.useDefaultModules();

    beforeEach( module( 'isc.table', 'isc.templates', 'foundation' ) );

    var html = "<div isc-table-popup-opener><input></div>";
    beforeEach( inject( function( $rootScope, $compile, keyCode ) {
      suite            = window.createSuite();
      suite.$compile   = $compile;
      suite.keyCode    = keyCode;
      suite.$rootScope = $rootScope;
      suite.$scope     = $rootScope.$new();
      suite.element    = $compile( html )( suite.$scope );
      _.set( suite.$scope, "iscRowCtrl.onCommand", _.noop );
      suite.$scope.$digest();
    } ) );

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.$scope ).toBeDefined();
        expect( suite.$compile ).toBeDefined();
        expect( suite.element ).toBeDefined();
      } );
    } );

    describe( 'iscRowCtrl.inEditMode', function() {

    } );
  } );
})();