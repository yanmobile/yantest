(function() {
  'use strict';

  describe( 'iscForm', function() {
    var suiteConfigured    = {},
        suiteMisconfigured = {},
        suiteWithData      = {},
        suiteSimple1       = {},
        suiteSimple2       = {},
        suiteSimple3       = {};

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

      suiteMain.$window      = $window;
      suiteMain.$compile     = $compile;
      suiteMain.$httpBackend = $httpBackend;
      suiteMain.$timeout     = $timeout;
      suiteMain.$rootScope   = $rootScope;

      suiteMain.formDataApi         = iscFormDataApi;
      suiteMain.notificationService = iscNotificationService;
      suiteMain.validationService   = iscFormsValidationService;
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
    describe( 'suiteConfigured', function() {
      beforeEach( function() {
        createDirective( suiteConfigured, getConfiguredForm(), {
          localFormConfig  : goodFormConfig,
          localButtonConfig: goodButtonConfig
        } );
        suiteMain.$httpBackend.flush();
      } );

      afterEach( function() {
        cleanup( suiteConfigured );
      } );

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
        // TODO -- extend
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
  } );
})();