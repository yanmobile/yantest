/**
 * Created by hzou on 6/18/16.
 */

(function() {


  describe( 'isc.directives iscRoundCheckBox', function() {
    var suite;

    window.useDefaultModules();

    beforeEach( module( 'isc.directives', 'isc.templates', 'foundation') );

    var html = "<isc-round-check-box ng-model='isChecked' on-toggle='onToggle()'></isc-round-check-box>";
    beforeEach( inject( function( $rootScope, $compile ) {
      suite                 = window.createSuite();
      suite.$rootScope      = $rootScope;
      suite.$scope          = $rootScope.$new();
      suite.$scope.onToggle = _.noop; //used by jasmine spy

      suite.element = $compile( html )( suite.$scope );
      suite.$scope.$digest();
      suite.$isolateScope = suite.element.isolateScope();
    } ) );

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.$scope ).toBeDefined();
        expect( suite.element ).toBeDefined();
        expect( suite.$isolateScope ).toBeDefined();
        expect( suite.$isolateScope.toggleCheckBox ).toBeDefined();
      } );
    } );

    describe( 'directive link function', function() {
      it( 'should default scope.selected to false', function() {
        expect( suite.$isolateScope.selected ).toBe( false );
      } );
    } );

    describe( 'toggleCheckBox', function() {
      it( 'should revert the scope.selected state', function() {
        expect( suite.$isolateScope.selected ).toBe( false );
        suite.$isolateScope.toggleCheckBox();
        expect( suite.$isolateScope.selected ).toBe( true );
      } );

      it( 'should invoke onToggle parameter function', function() {
        expect( suite.$isolateScope.selected ).toBe( false );
        spyOn( suite.$scope, 'onToggle' );

        suite.$isolateScope.toggleCheckBox();

        expect( suite.$scope.onToggle ).toHaveBeenCalled();
      } );
    } );
  } );
})();