(function() {
  'use strict';

  describe( 'iscForm', function() {
    var suiteConfigured,
        suiteMisconfigured,
        suiteWithData,
        suiteSimple1,
        suiteSimple2,
        suiteSimple3;

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

    var goodFormConfig = {
      additionalModelInit: function( additionalModels, stateParams, formModel ) {
        additionalModels.configuredModel = {
          "foo": "bar"
        };
        return additionalModels;
      }
    };

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

    //--------------------
    describe( 'suiteSimple(s)', function() {
      beforeEach( function() {
        suiteSimple1 = createDirective( getMinimalForm( 'simple1' ) );
        suiteSimple2 = createDirective( getMinimalForm( 'simple2' ) );
        suiteSimple3 = createDirective( getMinimalForm( 'simple3' ) );

        suiteMain.$httpBackend.flush();
      } );

      //--------------------
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

      //--------------------
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

      //--------------------
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

      //--------------------
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
    describe( 'suiteConfigured', function() {
      beforeEach( function() {
        suiteConfigured = createDirective( getConfiguredForm(), {
          localFormConfig  : goodFormConfig,
          localButtonConfig: goodButtonConfig
        } );
        suiteMain.$httpBackend.flush();
      } );

      //--------------------
      it( 'should load configuration passed to the directive', function() {
        var suite      = suiteConfigured,
            formConfig = getFormConfig( suite );

        expect( formConfig.additionalModels.configuredModel.foo ).toEqual( "bar" );
        // TODO -- extend
      } );
    } );

    //--------------------
    describe( 'suiteMisconfigured', function() {
      beforeEach( function() {
        suiteMisconfigured = createDirective( getConfiguredForm(), {
          localFormConfig: badFormConfig
        } );
        suiteMain.$httpBackend.flush();
      } );

      //--------------------
      it( 'should fall back to default behaviors for poorly configured forms', function() {
        var suite        = suiteMisconfigured,
            buttonConfig = getButtonConfig( suite );
        expect( _.isFunction( buttonConfig.submit.onClick ) ).toBe( true );
        // TODO -- extend
      } );
    } );

    //--------------------
    describe( 'suiteWithData', function() {
      beforeEach( function() {
        suiteWithData = createDirective( getFormWithData() );
        suiteMain.$httpBackend.flush();
      } );

      //--------------------
      it( 'should parse the form data ID into an int', function() {
        var parsedId = suiteWithData.controller.parsedFormDataId;
        expect( parsedId ).not.toBe( "3" );
        expect( parsedId ).toBe( 3 );
      } );

      //--------------------
      it( 'should load form data from the ID', function() {
        var mockData      = _.find( mockFormStore.formData, { id: 3 } ).data,
            // The embeddedForm types initialize the model with their keys
            expectedModel = angular.copy( suiteWithData.controller.model );

        // Embedded forms fill out the local model,
        // even if they are not in data retrieved from the API.
        expect (mockData.sampleEmbeddedFullFormNoPage).not.toBeDefined();
        expect (mockData.sampleEmbeddedFullFormPage1).not.toBeDefined();
        expect (mockData.sampleEmbeddedFullFormLastPage).not.toBeDefined();
        delete expectedModel.sampleEmbeddedFullFormNoPage;
        delete expectedModel.sampleEmbeddedFullFormPage1;
        delete expectedModel.sampleEmbeddedFullFormLastPage;

        expect( expectedModel ).toEqual( mockData );
      } );
    } );
  } );
})();