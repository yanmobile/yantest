/**
 * Created by hzou on 6/18/16.
 */

(function() {


  describe( 'isc.directives iscConfirmation', function() {
    var suite;

    window.useDefaultModules();

    beforeEach( module( 'isc.directives', 'isc.templates', 'foundation', function( iscConfirmationServiceProvider ) {
      suite = window.createSuite( {
        iscConfirmationServiceProvider: iscConfirmationServiceProvider
      } );
    } ) );

    var html = "<isc-confirmation></isc-confirmation>";
    beforeEach( inject( function( $rootScope, $compile, iscConfirmationService ) {
      suite                        = window.createSuite();
      suite.$rootScope             = $rootScope;
      suite.$scope                 = $rootScope.$new();
      suite.iscConfirmationService = iscConfirmationService;
      suite.element                = $compile( html )( suite.$scope );
      suite.$scope.$digest();
      suite.$isolateScope = suite.element.isolateScope();
      suite.controller    = suite.$isolateScope.iscConfirmCtrl;
      suite.modalScope    = suite.element.find( '[zf-modal]' ).scope();
    } ) );

    describe( 'set setup', function() {
      it( 'should have right dependencies', function() {
        expect( suite.$rootScope ).toBeDefined();
        expect( suite.$scope ).toBeDefined();
        expect( suite.element ).toBeDefined();
        expect( suite.$isolateScope ).toBeDefined();
        expect( suite.iscConfirmationService ).toBeDefined();
        expect( suite.$isolateScope.iscConfirmCtrl ).toBeDefined();
        expect( suite.modalScope ).toBeDefined();
      } );
    } );

    describe( '$scope.$watch(iscConfirmCtrl.service.isOpen)', function() {
      it( 'should call modalScope.show when service.isOpen === true', function() {
        spyOn( suite.modalScope, "hide" );
        spyOn( suite.modalScope, "show" );
        suite.$isolateScope.iscConfirmCtrl.service.isOpen = true;
        suite.$scope.$digest();

        expect( suite.modalScope.show ).toHaveBeenCalled();
        expect( suite.modalScope.hide ).not.toHaveBeenCalled();

      } );  
      it( 'should call modalScope.show when service.isOpen === false', function() {
        suite.$isolateScope.iscConfirmCtrl.service.isOpen = true; //set to opened
        suite.$scope.$digest();
        
        spyOn( suite.modalScope, "hide" );
        spyOn( suite.modalScope, "show" );
        suite.$isolateScope.iscConfirmCtrl.service.isOpen = false;
        suite.$scope.$digest();

        expect( suite.modalScope.show ).not.toHaveBeenCalled();
        expect( suite.modalScope.hide ).toHaveBeenCalled();

      } );

    } );
  } );
})();