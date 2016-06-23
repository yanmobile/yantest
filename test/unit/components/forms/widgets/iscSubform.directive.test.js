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
      'isc.templates', 'isc.fauxTable', 'isc.filters',
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
    } ) );

    describe( 'iscSubform - new', function() {
      beforeEach( function() {
        createDirectives( getConfiguredForm() );
      } );

      //--------------------
      it( 'should close a subform when cancel is clicked', function() {
        // Open a subform of each editAs type, enter a field, and click cancel
        test( 'test.SubformPage', true );
        test( 'test.SubformInline' );
        test( 'test.SubformModal' );

        function test( subformName, isFullPage ) {
          var suite        = suiteSubform,
              subform      = getControlByName( suite, subformName ).filter( '.subform' ),
              addButton    = subform.find( 'button.embedded-form-add' ),
              model        = _.get( suite.controller.model, subformName ),
              cancelButton = null,
              shownForm    = null,
              inputField   = null;

          expect( addButton.length ).toBe( 1 );
          expect( subform.length ).toBe( 1 );
          expect( model ).toBeUndefined(); // no mock data exists

          // Open the subform
          addButton.click();
          digest( suite );

          selectElements();

          // Verify it opened, change a field
          if ( isFullPage ) {
            spyOn( suite.controller.childConfig, 'onCancel' ).and.callThrough();
          }
          else {
            expect( shownForm.length ).toBe( 1 );
          }
          expect( cancelButton.length ).toBe( 1 );
          expect( inputField.length ).toBe( 1 );

          // Change a field and click cancel to close it
          inputField.val( 'some value' ).trigger( 'change' );
          cancelButton.click();
          digest( suite );
          selectElements();

          expect( cancelButton.length ).toBe( 0 );
          expect( inputField.length ).toBe( 0 );
          expect( model ).toBeUndefined(); // still no mock data

          if ( isFullPage ) {
            expect( suite.controller.childConfig.onCancel ).toHaveBeenCalled();
          }
          else {
            expect( shownForm.length ).toBe( 0 );
          }

          function selectElements() {
            cancelButton = suite.element.find( '.embedded-form-cancel' );
            shownForm    = subform.find( '.formly' );
            inputField   = getControlByName( suite, 'aField' );
          }
        }
      } );
    } );


    //--------------------
    describe( 'iscSubform - edit', function() {
      beforeEach( function() {
        createDirectives( getFormWithData() );
      } );

      //--------------------
      it( 'should allow entering of data in a subform', function() {
        // Open a subform of each editAs type, enter a field, save, then edit
        test( 'test.SubformPage', true );
        test( 'test.SubformInline' );
        test( 'test.SubformModal' );

        function test( subformName, isFullPage ) {
          var suite      = suiteSubform,
              subform    = getControlByName( suite, subformName ).filter( '.subform' ),
              addButton  = subform.find( 'button.embedded-form-add' ),
              model      = _.get( suite.controller.model, subformName ),
              saveButton = null,
              shownForm  = null,
              inputField = null;

          expect( addButton.length ).toBe( 1 );
          expect( subform.length ).toBe( 1 );
          expect( model.length ).toBe( 1 ); // 1 mock record exists

          // Open the subform
          addButton.click();
          digest( suite );
          selectElements();

          // Verify it opened, change a field
          if ( isFullPage ) {
            spyOn( suite.controller.childConfig, 'onSubmit' ).and.callThrough();
          }
          else {
            expect( shownForm.length ).toBe( 1 );
          }
          expect( saveButton.length ).toBe( 1 );
          expect( inputField.length ).toBe( 1 );

          // Change a field and click submit to save it
          inputField.val( 'some value' ).trigger( 'change' );
          saveButton.click();
          digest( suite );
          selectElements();

          expect( saveButton.length ).toBe( 0 );
          expect( inputField.length ).toBe( 0 );

          if ( isFullPage ) {
            expect( suite.controller.childConfig.onSubmit ).toHaveBeenCalled();
          }
          else {
            expect( shownForm.length ).toBe( 0 );
          }
          expect( model.length ).toBe( 2 ); // should now be 2 mock records

          function selectElements() {
            saveButton = suite.element.find( '.embedded-form-save' );
            shownForm  = subform.find( '.formly' );
            inputField = getControlByName( suite, 'aField' );
          }
        }
      } );

      //--------------------
      it( 'should allow editing of data in a subform', function() {
        // Open a subform of each editAs type, enter a field, save, then edit
        test( 'test.SubformPage', true );
        test( 'test.SubformInline' );
        test( 'test.SubformModal' );

        function test( subformName, isFullPage ) {
          // suiteMain.$rootScope.$digest();
          var suite      = suiteSubform,
              subform    = getControlByName( suite, subformName ).filter( '.subform' ),
              editButton = subform.find( 'button.embedded-form-edit' ),
              model      = _.get( suite.controller.model, subformName ),
              saveButton = null,
              shownForm  = null,
              inputField = null;

          expect( editButton.length ).toBe( 1 );
          expect( subform.length ).toBe( 1 );
          expect( model.length ).toBe( 1 ); // 1 mock record exists

          // Open the subform
          editButton.click();
          digest( suite );
          selectElements();

          // Verify it opened, change a field
          if ( isFullPage ) {
            spyOn( suite.controller.childConfig, 'onSubmit' ).and.callThrough();
          }
          else {
            expect( shownForm.length ).toBe( 1 );
          }
          expect( saveButton.length ).toBe( 1 );
          expect( inputField.length ).toBe( 1 );

          // Change a field and click submit to save it
          inputField.val( 'some different value' ).trigger( 'change' );
          saveButton.click();
          digest( suite );
          selectElements();

          expect( saveButton.length ).toBe( 0 );
          expect( inputField.length ).toBe( 0 );

          if ( isFullPage ) {
            expect( suite.controller.childConfig.onSubmit ).toHaveBeenCalled();
          }
          else {
            expect( shownForm.length ).toBe( 0 );
          }
          expect( model.length ).toBe( 1 ); // still the 1 mock record

          function selectElements() {
            saveButton = suite.element.find( '.embedded-form-save' );
            shownForm  = subform.find( '.formly' );
            inputField = getControlByName( suite, 'aField' );
          }
        }
      } );

      //--------------------
      it( 'should allow deletion of data in a subform', function() {
        // Open a subform of each editAs type, enter a field, save, then edit
        test( 'test.SubformPage' );
        test( 'test.SubformInline' );
        test( 'test.SubformModal' );

        function test( subformName ) {
          var suite        = suiteSubform,
              subform      = getControlByName( suite, subformName ).filter( '.subform' ),
              deleteButton = subform.find( 'button.embedded-form-delete' ),
              model        = _.get( suite.controller.model, subformName ),
              saveButton   = null,
              shownForm    = null,
              inputField   = null;

          expect( deleteButton.length ).toBe( 1 );
          expect( subform.length ).toBe( 1 );
          expect( model.length ).toBe( 1 ); // 1 mock record exists

          // Delete the record
          deleteButton.click();
          digest( suite );
          selectElements();

          expect( model.length ).toBe( 0 ); // model should be empty now

          function selectElements() {
            saveButton = suite.element.find( '.embedded-form-save' );
            shownForm  = subform.find( '.formly' );
            inputField = getControlByName( suite, 'aField' );
          }
        }
      } );
    } );

    function createDirectives( rootForm ) {
      // Create an isc-form to get what would normally be passed to isc-form-internal
      suiteForm = createDirective( rootForm, {
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
    }

  } );
})();