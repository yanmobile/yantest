/**
 * Created by hzou on 6/18/16.
 */

(function() {

  describe( 'isc.tooltip directive', function() {
    var suite;

    // show $log statements
    beforeEach( module( function( $provide ) {
      $provide.value( '$log', mock$log );
    } ) );

    // setup devlog
    beforeEach( module( 'isc.core', function( devlogProvider ) {
      devlogProvider.loadConfig( customConfig );
    } ) );

    beforeEach( module( 'isc.directives', 'isc.templates' ) );

    beforeEach( inject( function( $rootScope, $compile ) {
      suite              = {};
      suite.$rootScope   = $rootScope;
      suite.$scope       = $rootScope.$new();
      suite.$compile     = $compile;
    } ) );

    function compile( html ) {
      var template  = html || "<div isc-tooltip title='my custom tooltip'></div>";
      suite.element = suite.$compile( template )( suite.$scope );
      suite.$scope.$apply();
      suite.$isolateScope = suite.element.isolateScope();
    }

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        compile();
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.$scope ).toBeDefined();
        expect( suite.element ).toBeDefined();
        expect( suite.$isolateScope ).toBeUndefined();
      } );
    } );

    describe( 'DOM', function() {
      it( 'should have "my custom tooltip" in the data', function() {
        compile();
        expect( suite.element.data( 'tooltipsterInitialTitle' ) ).toBe( 'my custom tooltip' );
      } );
      
    } );
  } );
})();