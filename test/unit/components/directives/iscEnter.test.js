(function() {


  describe( 'isc.directives iscEnter', function() {
    var suite;

    window.useDefaultModules( function( $provide ) {
      $provide.factory( 'myService', function() {
        return {
          test: test
        };

        function test() {
        }
      } );
    } );

    beforeEach( module( 'isc.directives', 'isc.templates', 'foundation' ) );

    var html = "<div isc-enter='myService.test()' scopeify='myService'><input id='testInput' name='testInput'></div>";

    beforeEach( inject( function( $rootScope, $compile, myService, keyCode ) {
      suite            = window.createSuite();
      suite.$rootScope = $rootScope;
      suite.$scope     = $rootScope.$new();

      suite.element = $compile( html )( suite.$scope );
      suite.$scope.$digest();
      suite.$isolateScope = suite.element.isolateScope();

      suite.myService = myService;
      suite.keyCode   = keyCode;
    } ) );

    describe( 'iscEnter', function() {
      it( 'should call myService.test() on Enter', function() {
        spyOn( suite.myService, 'test' ).and.callThrough();

        var event     = jQuery.Event( 'keydown' );
        event.keyCode = suite.keyCode.ENTER;

        suite.element.find( '#testInput' ).trigger( event );

        expect( suite.myService.test ).toHaveBeenCalled();
      } );
    } );
  } );
})();