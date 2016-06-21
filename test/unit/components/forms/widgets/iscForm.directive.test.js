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

    var goodFormConfig = {};

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
                                  formlyApiCheck, formlyConfig, iscFormDataApi ) {
      formlyConfig.disableWarnings   = true;
      formlyApiCheck.config.disabled = true;

      suiteMain.$window = $window;
      suiteMain.$window      = $window;
      suiteMain.$httpBackend = $httpBackend;
      suiteMain.$timeout     = $timeout;

      createDirective( suiteSimple1, getMinimalForm( 'simple1' ) );
      createDirective( suiteSimple2, getMinimalForm( 'simple2' ) );
      createDirective( suiteSimple3, getMinimalForm( 'simple3' ) );
      createDirective( suiteMisconfigured, getConfiguredForm(), {
        localFormConfig: badFormConfig
      } );
      createDirective( suiteConfigured, getConfiguredForm(), {
        localFormConfig  : goodFormConfig,
        localButtonConfig: goodButtonConfig
      } );
      createDirective( suiteWithData, getFormWithData() );

      $timeout.flush();
      $httpBackend.flush();
      $timeout.flush();

      createDirective( suiteInternal, getInternalForm(), {
        formCtrl: suiteConfigured.controller
      } );
      suiteInternal.controller = suiteInternal.$isolateScope.formInternalCtrl;

      $timeout.flush();

      function createDirective( suite, html, scopeConfig ) {
        suite.$window      = $window;
        suite.$httpBackend = $httpBackend;
        suite.$timeout     = $timeout;
        suite.formDataApi  = iscFormDataApi;
        mockFormResponses( suite.$httpBackend );

        suite.$rootScope = $rootScope;
        suite.$scope     = $rootScope.$new();
        angular.extend( suite.$scope, angular.copy( scopeConfig ) );
        suite.element = $compile( html )( suite.$scope );
        suite.$scope.$digest();
        suite.$isolateScope = suite.element.isolateScope();
        suite.controller    = suite.$isolateScope.formCtrl;
      }
    } ) );

    afterEach( function() {
      cleanup( suiteSimple1 );
      cleanup( suiteSimple2 );
      cleanup( suiteSimple3 );
      cleanup( suiteConfigured );
      cleanup( suiteMisconfigured );
      cleanup( suiteWithData );
      cleanup( suiteInternal );
    } );

    describe( 'iscForm', function() {
      it( 'should have base directive configuration', function() {
        testSuite( suiteSimple1 );
        testSuite( suiteSimple2 );
        testSuite( suiteSimple3 );
        testSuite( suiteConfigured );
        testSuite( suiteWithData );

        function testSuite( suite ) {
          var formConfig   = getFormConfig( suite ),
              buttonConfig = getButtonConfig( suite );
          expect( formConfig ).toBeDefined();
          expect( buttonConfig ).toBeDefined();
        }
      } );

      it( 'should parse the form data ID into an int', function() {
        var parsedId = suiteWithData.controller.parsedFormDataId;
        expect( parsedId ).not.toBe( "123" );
        expect( parsedId ).toBe( 123 );
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

      it( 'should run validation when submit is clicked', function() {
        var suite              = suiteConfigured,
            submitButton       = getButton( suite, 'submit' ),
            buttonConfig       = getButtonConfig( suite ),
            submitButtonConfig = buttonConfig.submit;

        spyOn( submitButtonConfig, 'onClick' ).and.callThrough();
        spyOn( submitButtonConfig, 'afterClick' ).and.callThrough();
        spyOn( suite.formDataApi, 'post' ).and.callThrough();
        spyOn( suite.formDataApi, 'put' ).and.callThrough();
        spyOn( suite.controller, 'validateFormApi' ).and.callThrough();

        submitButton.click();

        expect( submitButtonConfig.onClick ).not.toHaveBeenCalled();
        expect( suite.controller.validateFormApi ).toHaveBeenCalled();
      } );

      it( 'should save when submit is clicked', function() {
        var suite              = suiteSimple1,
            submitButton       = getButton( suite, 'submit' ),
            buttonConfig       = getButtonConfig( suite ),
            submitButtonConfig = buttonConfig.submit;

        spyOn( submitButtonConfig, 'onClick' ).and.callThrough();
        spyOn( submitButtonConfig, 'afterClick' ).and.callThrough();
        spyOn( suite.formDataApi, 'post' ).and.callThrough();
        spyOn( suite.formDataApi, 'put' ).and.callThrough();

        // POST form
        submitButton.click();
        suite.$httpBackend.flush();

        expect( submitButtonConfig.onClick ).toHaveBeenCalled();
        expect( submitButtonConfig.afterClick ).toHaveBeenCalled();
        expect( suite.formDataApi.post ).toHaveBeenCalled();

        // PUT form
        submitButton.click();
        suite.$httpBackend.flush();
        expect( suite.formDataApi.put ).toHaveBeenCalled();
      } );

      it( 'should go back when cancel is clicked', function() {
        var suite              = suiteSimple1,
            cancelButtonConfig = getButtonConfig( suite ).cancel;

        spyOn( cancelButtonConfig, 'onClick' ).and.callThrough();
        spyOn( cancelButtonConfig, 'afterClick' ).and.callThrough();
        spyOn( suite.$window.history, 'back' ).and.callThrough();

        getButton( suite, 'cancel' ).click();

        expect( suite.$window.history.back ).toHaveBeenCalled();
      } );

      it( 'should change page when the selector is changed', function() {
        console.log( suiteInternal.controller );
        var suite         = suiteInternal,
            subformConfig = suite.controller.multiConfig;

        spyOn( subformConfig, 'selectPage' ).and.callThrough();

        subformConfig.selectPage( 1 );
      } );
    } );


    function getFormConfig( suite ) {
      return _.get( suite, 'controller.internalFormConfig' );
    }

    function getButtonConfig( suite ) {
      return suite.controller.internalButtonConfig;
    }

    function getButton( suite, buttonName ) {
      return suite.element.find( '#' + buttonName + 'Button' );
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
        'form-config="localFormConfig"' +
        'button-config="localButtonConfig"' +
        '></isc-form>';
    }

    function getFormWithData() {
      return '<isc-form ' +
        'form-key="intake" ' +
        'form-data-id="123"' +
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