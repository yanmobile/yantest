(function() {
  'use strict';

  describe( 'iscForm', function() {
    var suiteMain          = {},
        suiteConfigured    = {},
        suiteMisconfigured = {},
        suiteWithData      = {},
        suiteSimple1       = {},
        suiteSimple2       = {},
        suiteSimple3       = {},
        suiteInternal      = {};

    // Some intentional mis-configurations to exercise safety nets
    var badFormConfig = {
      formDataApi   : {
        // this should normally call the save data API, if the default option is not to be used
        save  : null,
        // this should normally return the data to be saved wrapped with metadata
        wrap  : null,
        // this should normally unwrap the metadata from a saved form
        unwrap: function( formData ) {
          return null;
        }
      },
      annotationsApi: {
        getFormAnnotations: "this should normally be a function"
      }
    };

    var goodFormConfig = null;

    var goodButtonConfig = {};

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
                                  formlyApiCheck, formlyConfig, iscFormDataApi, iscNotificationService ) {
      formlyConfig.disableWarnings   = true;
      formlyApiCheck.config.disabled = true;

      suiteMain.$window      = $window;
      suiteMain.$compile     = $compile;
      suiteMain.$httpBackend = $httpBackend;
      suiteMain.$timeout     = $timeout;
      suiteMain.$rootScope   = $rootScope;

      suiteMain.formDataApi         = iscFormDataApi;
      suiteMain.notificationService = iscNotificationService;
      mockFormResponses( suiteMain.$httpBackend );
    } ) );

    afterEach( function() {
      cleanup( suiteMain );
    } );

    //--------------------
    describe( 'suiteSimple(s)', function() {
      beforeEach( function() {
        createDirective( suiteSimple1, getMinimalForm( 'simple1' ) );
        createDirective( suiteSimple2, getMinimalForm( 'simple2' ) );
        createDirective( suiteSimple3, getMinimalForm( 'simple3' ) );
        suiteMain.$httpBackend.flush();
      } );

      afterEach( function() {
        cleanup( suiteSimple1 );
        cleanup( suiteSimple2 );
        cleanup( suiteSimple3 );
      } );

      it( 'should have basic directive configuration', function() {
        testSuite( suiteSimple1 );
        testSuite( suiteSimple2 );
        testSuite( suiteSimple3 );

        function testSuite( suite ) {
          var formConfig   = getFormConfig( suite ),
              buttonConfig = getButtonConfig( suite );
          expect( formConfig ).toBeDefined();
          expect( buttonConfig ).toBeDefined();
        }
      } );

      it( 'should populate a minimally specified form with defaults', function() {
        testSuite( suiteSimple1 );
        testSuite( suiteSimple2 );
        testSuite( suiteSimple3 );

        function testSuite( suite ) {
          var annotationsApi = getFormConfig( suite ).annotationsApi,
              buttonConfig   = getButtonConfig( suite );
          expect( _.isFunction( annotationsApi.getFormAnnotations ) ).toBe( true );
          expect( _.isFunction( buttonConfig.submit.onClick ) ).toBe( true );
        }
      } );

      it( 'should save when submit is clicked', function() {
        var suite              = suiteSimple1,
            submitButton       = getButton( suite, 'submit' ),
            buttonConfig       = getButtonConfig( suite ),
            submitButtonConfig = buttonConfig.submit;

        spyOn( submitButtonConfig, 'onClick' ).and.callThrough();
        spyOn( submitButtonConfig, 'afterClick' ).and.callThrough();
        spyOn( suiteMain.formDataApi, 'post' ).and.callThrough();
        spyOn( suiteMain.formDataApi, 'put' ).and.callThrough();

        // POST form
        submitButton.click();
        suiteMain.$httpBackend.flush();

        expect( submitButtonConfig.onClick ).toHaveBeenCalled();
        expect( submitButtonConfig.afterClick ).toHaveBeenCalled();
        expect( suiteMain.formDataApi.post ).toHaveBeenCalled();

        // PUT form
        submitButton.click();
        suiteMain.$httpBackend.flush();
        expect( suiteMain.formDataApi.put ).toHaveBeenCalled();
      } );

      it( 'should go back when cancel is clicked', function() {
        var suite              = suiteSimple1,
            cancelButtonConfig = getButtonConfig( suite ).cancel;

        spyOn( cancelButtonConfig, 'onClick' ).and.callThrough();
        spyOn( cancelButtonConfig, 'afterClick' ).and.callThrough();
        spyOn( suiteMain.$window.history, 'back' ).and.callThrough();

        getButton( suite, 'cancel' ).click();

        expect( suiteMain.$window.history.back ).toHaveBeenCalled();
      } );
    } );

    //--------------------
    // describe( 'suiteConfigured', function() {
    //   beforeEach( function() {
    //     createDirective( suiteConfigured, getConfiguredForm(), {
    //       localFormConfig  : goodFormConfig,
    //       localButtonConfig: goodButtonConfig
    //     } );
    //     suiteMain.$httpBackend.flush();
    //   } );
    //
    //   afterEach( function() {
    //     cleanup( suiteConfigured );
    //   } );
    //
    // } );

    //--------------------
    describe( 'suiteMisconfigured', function() {
      beforeEach( function() {
        createDirective( suiteMisconfigured, getConfiguredForm(), {
          localFormConfig: badFormConfig
        } );
        suiteMain.$httpBackend.flush();
      } );

      afterEach( function() {
        cleanup( suiteMisconfigured );
      } );

      it( 'should fall back to default behaviors for poorly configured forms', function() {
        var suite        = suiteMisconfigured,
            buttonConfig = getButtonConfig( suite );
        expect( _.isFunction( buttonConfig.submit.onClick ) ).toBe( true );
      } );
    } );

    //--------------------
    describe( 'suiteWithData', function() {
      beforeEach( function() {
        createDirective( suiteWithData, getFormWithData() );
        suiteMain.$httpBackend.flush();
      } );

      it( 'should parse the form data ID into an int', function() {
        var parsedId = suiteWithData.controller.parsedFormDataId;
        expect( parsedId ).not.toBe( "2" );
        expect( parsedId ).toBe( 2 );
      } );

      it( 'should load form data from the ID', function() {
        var mockData      = _.find( mockFormStore.formData, { id: 2 } ).data,
            // The embeddedForm types initialize the model with their keys
            expectedModel = _.extend( {
              sampleEmbeddedFullFormNoPage  : {},
              sampleEmbeddedFullFormPage1   : {},
              sampleEmbeddedFullFormLastPage: {}
            }, mockData );
        expect( suiteWithData.controller.model ).toEqual( expectedModel );
      } );
    } );

    //--------------------
    describe( 'suiteInternal', function() {
      beforeEach( function() {
        createDirective( suiteConfigured, getConfiguredForm(), {
          localFormConfig  : goodFormConfig,
          localButtonConfig: goodButtonConfig
        } );
        suiteMain.$httpBackend.flush();

        createDirective( suiteInternal, getInternalForm(), {
          formCtrl: suiteConfigured.controller
        } );
        suiteInternal.controller = suiteInternal.$isolateScope.formInternalCtrl;
      } );

      afterEach( function() {
        cleanup( suiteConfigured );
        cleanup( suiteInternal );
      } );

      it( 'should change page when the selector is changed', function() {
        var suite         = suiteInternal,
            subformConfig = suite.controller.multiConfig;

        spyOn( subformConfig, 'selectPage' ).and.callThrough();

        expect( getPageIndex() ).toEqual( 0 );
        subformConfig.selectPage( 1 );
        expect( getPageIndex() ).toEqual( 1 );

        function getPageIndex() {
          return _.indexOf( subformConfig.selectablePages, subformConfig.currentPage );
        }
      } );

      it( 'should show page 5 once the model is updated', function() {
        var suite         = suiteInternal,
            subformConfig = suite.controller.multiConfig,
            model         = suite.controller.model,
            lastPage      = subformConfig.pages[4],
            value         = 'something';

        spyOn( suiteMain.formDataApi, 'post' ).and.callThrough();

        expect( model.RequiredInput ).toBeUndefined();
        expect( lastPage._isHidden ).toBe( true );

        // Enter a value for RequiredInput
        getControl( suite, 'RequiredInput' )
          .val( value )
          .trigger( 'change' );
        digest( suite );

        expect( model.RequiredInput ).toEqual( value );
        expect( lastPage._isHidden ).toBe( false );
        // This form is configured to autosave on page change
        expect( suiteMain.formDataApi.post ).not.toHaveBeenCalled();

        // Change page to trigger saving and cover page watches
        subformConfig.selectPage( 2 );
        digest( suite );
        expect( suiteMain.formDataApi.post ).toHaveBeenCalled();
      } );

      it( 'should run validation when submit is clicked', function() {
        var suite              = suiteConfigured,
            submitButton       = getButton( suite, 'submit' ),
            buttonConfig       = getButtonConfig( suite ),
            submitButtonConfig = buttonConfig.submit,
            model              = suite.controller.model,
            subformRecord1     = {},
            subformRecord2     = {},
            subformRecordData  = {
              RequiredInputInASubform : "some data",
              RequiredInputInASubform2: "some other data"
            };

        spyOn( submitButtonConfig, 'onClick' ).and.callThrough();
        spyOn( submitButtonConfig, 'afterClick' ).and.callThrough();
        spyOn( suiteMain.formDataApi, 'post' ).and.callThrough();
        spyOn( suite.controller, 'validateFormApi' ).and.callThrough();
        spyOn( suiteMain.notificationService, 'showAlert' ).and.callThrough();

        submitButton.click();

        // Validation should fail
        // The submit.onClick function is only called once the validation in iscFormInternal succeeds
        expect( submitButtonConfig.onClick ).not.toHaveBeenCalled();
        expect( suite.controller.validateFormApi ).toHaveBeenCalled();
        expect( suiteMain.notificationService.showAlert ).toHaveBeenCalled();

        // Set the RequiredInput and add two empty records to the RequiredSubform
        getControl( suite, 'RequiredInput' )
          .val( 'some value' )
          .trigger( 'change' );

        // Adding objects directly to subform model, to bypass validation
        // This normally cannot be done through the UI but could be done through a script or event
        model.RequiredSubform = [];
        model.RequiredSubform.push( subformRecord1 );
        model.RequiredSubform.push( subformRecord2 );

        digest( suite );
        submitButton.click();

        // Validation should still fail due to the required fields in the RequiredSubform fields
        // This exercises the validation for subform records that are invalidated without being shown in the UI
        expect( submitButtonConfig.onClick ).not.toHaveBeenCalled();
        expect( suite.controller.validateFormApi ).toHaveBeenCalled();
        expect( suiteMain.notificationService.showAlert ).toHaveBeenCalled();

        _.extend( subformRecord1, subformRecordData );
        digest( suite );
        submitButton.click();

        // Validation should still fail due to subformRecord2 missing required fields
        expect( submitButtonConfig.onClick ).not.toHaveBeenCalled();
        expect( suite.controller.validateFormApi ).toHaveBeenCalled();
        expect( suiteMain.notificationService.showAlert ).toHaveBeenCalled();

        _.extend( subformRecord2, subformRecordData );
        digest( suite );
        submitButton.click();

        // TODO - open subform, update controls, submit subform

        // Validation should now succeed
        expect( submitButtonConfig.onClick ).toHaveBeenCalled();
        expect( suite.controller.validateFormApi ).toHaveBeenCalled();
        suiteMain.$httpBackend.flush();
        expect( submitButtonConfig.afterClick ).toHaveBeenCalled();
        expect( suiteMain.formDataApi.post ).toHaveBeenCalled();
      } );

    } );


    //--------------------
    // Utility functions
    function createDirective( suite, html, scopeConfig ) {
      suite.$scope = suiteMain.$rootScope.$new();
      angular.extend( suite.$scope, angular.copy( scopeConfig ) );
      suite.element = suiteMain.$compile( html )( suite.$scope );
      digest( suite );
      suite.$isolateScope = suite.element.isolateScope();
      suite.controller    = suite.$isolateScope.formCtrl;
    }

    function getFormConfig( suite ) {
      return suite.controller.internalFormConfig;
    }

    function getButtonConfig( suite ) {
      return suite.controller.internalButtonConfig;
    }

    function getButton( suite, buttonName ) {
      return suite.element.find( '#' + buttonName + 'Button' );
    }

    function getControl( suite, controlKey ) {
      return suite.element.find( '[name*="' + controlKey + '"]' )
    }

    function digest( suite ) {
      suite.$scope.$digest();
      suiteMain.$timeout.flush();
    }

    // Form template generators
    function getMinimalForm( formKey ) {
      return '<isc-form ' + 'form-key="' + formKey + '" ' + '></isc-form>'
    }

    function getConfiguredForm() {
      return '<isc-form ' +
        'form-key="intake" ' +
        'form-data-id=""' +
        'form-version=""' +
        'mode="edit"' +
        'model="localModel"' +
        'form-config="localFormConfig"' +
        'button-config="localButtonConfig"' +
        '></isc-form>';
    }

    function getFormWithData() {
      return '<isc-form ' +
        'form-key="intake" ' +
        'form-data-id="2"' +
        'mode="view"' +
        '></isc-form>';
    }

    function getInternalForm() {
      return '<isc-form-internal ' +
        'form-definition="formCtrl.formDefinition"' +
        'model="formCtrl.model"' +
        'options="formCtrl.options"' +
        'button-config="formCtrl.internalButtonConfig"' +
        'form-config="formCtrl.internalFormConfig"' +
        'validate-form-api="formCtrl.validateFormApi"' +
        '></isc-form-internal>';
    }

  } );

})();