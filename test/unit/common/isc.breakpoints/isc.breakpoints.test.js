/**
 * Created by hzou on 6/17/16.
 */

(function() {
  
  describe( "isc.breakpoints", function() {
    var suite;
    beforeEach( module( 'isc.breakpoints', function( iscBreakpointsServiceProvider ) {
      suite                               = {};
      suite.iscBreakpointsServiceProvider = iscBreakpointsServiceProvider;
      iscBreakpointsServiceProvider.setCssClasses( ["small", "medium", "large"] );
    } ) );

    beforeEach( inject( function( $rootScope, $compile, iscBreakpointsService ) {
      suite.$rootScope            = $rootScope;
      suite.$compile              = $compile;
      suite.$scope                = $rootScope.$new();
      suite.iscBreakpointsService = iscBreakpointsService;
    } ) );

    function compile() {
      suite.element = suite.$compile( html )( suite.$scope );
      suite.$scope.$apply();
    }

    var html = "<breakpoints></breakpoints>";

    describe( 'isc-breakpoints', function() {
      it( 'should not render empty content if no cssClasses are passed', function() {
        suite.iscBreakpointsServiceProvider.setCssClasses( [] );
        compile();
        expect( suite.element.html() ).toBe( "" );
      } );

      it( 'should return ["small", "medium", "large"] back from getCssClasses', function() {
        var expected = ["small", "medium", "large"];
        var actual   = suite.iscBreakpointsService.getCssClasses();
        expect( expected ).toEqual( actual );
      } );

      it( 'should render "small", "medium", "large" elements', function() {
        compile();
        var $small  = suite.element.find( '.small' );
        var $medium = suite.element.find( '.medium' );
        var $large  = suite.element.find( '.large' );
        expect( $small.length ).toBe( 1 );
        expect( $medium.length ).toBe( 1 );
        expect( $large.length ).toBe( 1 );
      } );

      it( 'should return breakpoints with class properties', function() {
        compile();
        var breakpoints = suite.iscBreakpointsService.getBreakpoints();
        expect( breakpoints ).toBeDefined();
        expect( breakpoints.small ).toBeDefined();
        expect( breakpoints.medium ).toBeDefined();
        expect( breakpoints.large ).toBeDefined();
      } );

      it( 'should return getBreakpoint() to return single breakpoint', function() {
        compile();
        var small  = suite.iscBreakpointsService.getBreakpoint( 'small' );
        var medium = suite.iscBreakpointsService.getBreakpoint( 'medium' );
        var large  = suite.iscBreakpointsService.getBreakpoint( 'large' );
        expect( small ).toBeDefined();
        expect( medium ).toBeDefined();
        expect( large ).toBeDefined();
      } );
    } );
  } );

})();
