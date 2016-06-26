/**
 * Created by hzou on 6/18/16.
 */

(function() {


  describe( 'isc.directives iscScrollTo', function() {
    var suite = window.createSuite();
    window.useDefaultModuleConfig();

    beforeEach( module( 'isc.directives', 'isc.templates', function( $provide ) {
      suite.$uiViewScroll = _.noop;
      spyOn( suite, "$uiViewScroll" );
      $provide.value( '$uiViewScroll', suite.$uiViewScroll );
    } ) );

    beforeEach( inject( function( $rootScope, $compile ) {
      suite.$compile   = $compile;
      suite.$rootScope = $rootScope;
      suite.$scope     = $rootScope.$new();
      suite.html       = "<div name='child' isc-scroll-to='parent'></div>";
    } ) );

    function compileContent() {
      suite.element       = suite.$compile( suite.html )( suite.$scope );
      suite.parentElement = angular.element( "<div name='parent'></div>" ).append( suite.element );
      suite.$scope.$digest();
      suite.$isolateScope = suite.element.isolateScope();
    }

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        compileContent();
        expect( suite.$compile ).toBeDefined();
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.$scope ).toBeDefined();
        expect( suite.element ).toBeDefined();
        expect( suite.$isolateScope ).toBeUndefined();
      } );
    } );

    describe( 'directive link function', function() {

      it( 'should scroll to element when clicked', function() {
        compileContent();
        suite.element.click();
        expect( suite.$uiViewScroll ).toHaveBeenCalledWith( jasmine.objectContaining( { selector: '[name="parent"]' } ) );
      } );
    } );
  } );
})();