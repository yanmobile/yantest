/**
 * Created by hzou on 6/18/16.
 */

(function() {


  describe( 'isc.directives iscDynamicHtml', function() {
    var suite;

    window.useDefaultModules();

    beforeEach( module( 'isc.directives', 'isc.templates', 'foundation'));


    beforeEach( inject( function( $rootScope, $compile ) {
      suite                 = window.createSuite();
      suite.$compile        = $compile;
      suite.$rootScope      = $rootScope;
      suite.$scope          = $rootScope.$new();
      suite.$scope.onToggle = _.noop; //used by jasmine spy
      suite.html            = "<isc-dynanmic-html></isc-dynanmic-html>";

    } ) );

    function compileContent() {
      suite.element = suite.$compile( suite.html )( suite.$scope );
      suite.$scope.$digest();
      suite.$isolateScope = suite.element.isolateScope();
    }

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        compileContent();
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.$scope ).toBeDefined();
        expect( suite.element ).toBeDefined();
        expect( suite.$isolateScope ).toBeUndefined();
      } );
    } );

    describe( 'directive link function', function() {

      it( 'should have empty content if no iscDynamicHtml value is passed', function() {
        compileContent();
        expect( suite.element.text() ).toBe( '' );
      } );

      it( 'should compile dynamic html angular expressions', function() {
        suite.$scope.customLabel = "dynamic content";
        suite.html               = "<div isc-dynamic-html='\"<custom>{{customLabel}}</custom>\"'></div>";
        compileContent();
        expect( suite.element.find( 'custom' ).length ).toBe( 1 );
        expect( suite.element.text() ).toBe( "dynamic content" );
      } );

    } );
  } );
})();