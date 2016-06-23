(function() {
  'use strict';

  //--------------------
  describe( 'iscSubform', function() {
    var suiteForm,
        suiteInternal,
        suiteSubform;

    beforeEach( module(
      'formly', 'foundation',
      'isc.http', 'isc.forms', 'iscNavContainer', 'isc.authorization', 'isc.notification', 'isc.directives',
      'isc.templates',
      function( $provide, devlogProvider ) {
        $provide.value( '$log', console );
        $provide.value( 'apiHelper', mockApiHelper );
        $provide.value( 'iscCustomConfigService', mockCustomConfigService );
        devlogProvider.loadConfig( mockCustomConfigService.getConfig() );
      } )
    );

    beforeEach( inject( function( $rootScope, $compile, $window, $httpBackend, $timeout,
                                  formlyApiCheck, formlyConfig,
                                  iscFormDataApi, iscNotificationService, iscFormsValidationService ) {
      formlyConfig.disableWarnings   = true;
      formlyApiCheck.config.disabled = true;

      suiteMain = window.createSuite( {
        $window     : $window,
        $compile    : $compile,
        $httpBackend: $httpBackend,
        $timeout    : $timeout,
        $rootScope  : $rootScope,

        formDataApi        : iscFormDataApi,
        notificationService: iscNotificationService,
        validationService  : iscFormsValidationService
      } );
      mockFormResponses( suiteMain.$httpBackend );

      // Create an isc-form to get what would normally be passed to isc-form-internal
      suiteForm = createDirective( getConfiguredForm(), {
        localFormConfig  : {},
        localButtonConfig: {}
      } );
      suiteMain.$httpBackend.flush();

      suiteInternal = createDirective( getInternalForm(), {
        formCtrl: suiteForm.controller
      } );

      suiteInternal.controller = suiteInternal.$isolateScope.formInternalCtrl;

      suiteSubform = createDirective( getSubform(), {
        formInternalCtrl: suiteInternal.controller
      } );

      suiteSubform.controller = suiteSubform.$isolateScope.subformCtrl;
    } ) );

    //--------------------
    it( 'should close a subform when cancel is clicked - Modal and Inline', function() {
      // Open a subform of each editAs type, enter a field, and click cancel
      test( 'testSubformPage', true );
      test( 'testSubformInline' );
      test( 'testSubformModal' );

      function test( subformName, isFullPage ) {
        var suite     = suiteSubform,
            subform   = getControlByName( suite, subformName ).filter( '.subform' ),
            addButton = subform.find( 'button.embedded-form-add' );

        expect( addButton.length ).toBe( 1 );
        expect( subform.length ).toBe( 1 );

        // Open the subform
        addButton.click();
        digest( suite );

        var cancelButton = suite.element.find( '.embedded-form-cancel' ),
            shownForm    = subform.find( '.formly' ),
            inputField   = getControlByName( suite, 'aField' );

        // Verify it opened, change a field
        if ( isFullPage ) {
          spyOn( suite.controller.childConfig, 'onCancel' ).and.callThrough();
        }
        else {
          expect( shownForm.length ).toBe( 1 );
        }
        expect( cancelButton.length ).toBe( 1 );
        expect( inputField.length ).toBe( 1 );

        inputField.val( 'some value' ).trigger( 'change' );
        cancelButton.click();
        digest( suite );

        // Click cancel to close it
        cancelButton = suite.element.find( '.embedded-form-cancel' );
        shownForm    = subform.find( '.formly' );
        inputField   = getControlByName( suite, 'aField' );

        expect( cancelButton.length ).toBe( 0 );
        expect( inputField.length ).toBe( 0 );

        if ( isFullPage ) {
          expect( suite.controller.childConfig.onCancel ).toHaveBeenCalled();
        }
        else {
          expect( shownForm.length ).toBe( 0 );
        }
      }
    } );

    //--------------------
    it( 'should allow editing of data in a subform', function() {
      // TODO
    } );
  } );
})();