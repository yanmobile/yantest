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

      suiteMain.$window      = $window;
      suiteMain.$compile     = $compile;
      suiteMain.$httpBackend = $httpBackend;
      suiteMain.$timeout     = $timeout;
      suiteMain.formDataApi  = iscFormDataApi;
      suiteMain.$rootScope   = $rootScope;
      mockFormResponses( suiteMain.$httpBackend );
    } ) );

    afterEach( function() {
      cleanup( suiteMain );
    } );

    describe( 'iscForm suiteSimple(s)', function() {
      beforeEach( function() {
        createDirective( suiteSimple1, getMinimalForm( 'simple1' ) );
        createDirective( suiteSimple2, getMinimalForm( 'simple2' ) );
        createDirective( suiteSimple3, getMinimalForm( 'simple3' ) );
        suiteMain.$timeout.flush();
        suiteMain.$httpBackend.flush();
        suiteMain.$timeout.flush();
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
        // testSuite( suiteConfigured );
        // testSuite( suiteWithData );

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

    describe( 'iscForm suiteConfigured', function() {
      beforeEach( function() {
        createDirective( suiteConfigured, getConfiguredForm(), {
          localFormConfig  : goodFormConfig,
          localButtonConfig: goodButtonConfig
        } );

        suiteMain.$timeout.flush();
        suiteMain.$httpBackend.flush();
        suiteMain.$timeout.flush();
      } );

      afterEach( function() {
        cleanup( suiteConfigured );
      } );

      it( 'should run validation when submit is clicked', function() {
        var suite              = suiteConfigured,
            submitButton       = getButton( suite, 'submit' ),
            buttonConfig       = getButtonConfig( suite ),
            submitButtonConfig = buttonConfig.submit;

        spyOn( submitButtonConfig, 'onClick' ).and.callThrough();
        spyOn( submitButtonConfig, 'afterClick' ).and.callThrough();
        spyOn( suiteMain.formDataApi, 'post' ).and.callThrough();
        spyOn( suiteMain.formDataApi, 'put' ).and.callThrough();
        spyOn( suite.controller, 'validateFormApi' ).and.callThrough();

        submitButton.click();

        expect( submitButtonConfig.onClick ).not.toHaveBeenCalled();
        expect( suite.controller.validateFormApi ).toHaveBeenCalled();
      } );

    } );

    describe( 'iscForm suiteMisconfigured', function() {
      beforeEach( function() {
        createDirective( suiteMisconfigured, getConfiguredForm(), {
          localFormConfig: badFormConfig
        } );

        suiteMain.$timeout.flush();
        suiteMain.$httpBackend.flush();
        suiteMain.$timeout.flush();
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

    describe( 'iscForm suiteWithData', function() {
      beforeEach( function() {
        createDirective( suiteWithData, getFormWithData() );
        suiteMain.$timeout.flush();
        suiteMain.$httpBackend.flush();
        suiteMain.$timeout.flush();
      } );

      it( 'should parse the form data ID into an int', function() {
        var parsedId = suiteWithData.controller.parsedFormDataId;
        expect( parsedId ).not.toBe( "2" );
        expect( parsedId ).toBe( 2 );
      } );

      it ('should load form data from the ID', function () {
        var mockData = _.find(mockFormStore.formData, { id : 2 }).data;
        console.log (mockData);
        expect( suiteWithData.controller.model ).not.toEqual( {} );
        expect (suiteWithData.controller.model).toEqual (mockData);
      });
    } );

    describe( 'iscForm suiteInternal', function() {
      beforeEach( function() {
        createDirective( suiteConfigured, getConfiguredForm(), {
          localFormConfig  : goodFormConfig,
          localButtonConfig: goodButtonConfig
        } );
        suiteMain.$timeout.flush();
        suiteMain.$httpBackend.flush();
        suiteMain.$timeout.flush();

        createDirective( suiteInternal, getInternalForm(), {
          formCtrl: suiteConfigured.controller
        } );
        suiteInternal.controller = suiteInternal.$isolateScope.formInternalCtrl;
        suiteMain.$timeout.flush();
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
            lastPage      = subformConfig.pages[4];

        expect( model.RequiredInput ).toBeUndefined();
        expect( lastPage._isHidden ).toBe( true );

        model.RequiredInput = "something";
        suite.$scope.$digest();
        suiteMain.$timeout.flush();
        expect( model.RequiredInput ).toEqual( 'something' );
        expect( lastPage._isHidden ).toBe( false );
      } );
    } );


    // Utility functions
    function createDirective( suite, html, scopeConfig ) {
      suite.$scope = suiteMain.$rootScope.$new();
      angular.extend( suite.$scope, angular.copy( scopeConfig ) );
      suite.element = suiteMain.$compile( html )( suite.$scope );
      suite.$scope.$digest();
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