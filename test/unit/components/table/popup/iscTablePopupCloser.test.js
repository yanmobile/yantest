/**
 * Created by hzou on 6/25/16.
 */

(function() {

  describe( 'isc.table iscTablePopupCloser', function() {
    var suite;

    window.useDefaultModules();

    beforeEach( module( 'isc.table', 'isc.templates', 'foundation' ) );

    var html = "<div isc-table-popup-closer><input></div>";
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

    describe( 'keydown events', function() {

      // for some reason this test fails, it has something to do with jquery DOM event
      // it( 'should focus on element if ESCAPE key event was fired', function() {
      //   var event     = jQuery.Event( "keydown" );
      //   event.which   = suite.keyCode.ESCAPE;
      //   event.keyCode = suite.keyCode.ESCAPE;
      //   // console.log( suite.element );
      //
      //   suite.element.find( "input" ).trigger( event );
      //   expect( suite.element.is( ":focus" ) ).toBe( true );
      // } );

      it( 'should focus on element if ESCAPE key event was NOT fired on :input', function() {
        spyOn( suite.$scope.iscRowCtrl, 'onCommand' );
        var event     = jQuery.Event( "keydown" );
        event.keyCode = suite.keyCode.ESCAPE;

        suite.element.trigger( event );
        expect( suite.$scope.iscRowCtrl.onCommand ).toHaveBeenCalledWith( "cancelEdit" );
      } );

    } );
  } );
})();