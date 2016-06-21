(function() {
  'use strict';

  describe( 'iscForm', function() {
    var suiteConfigured = {},
        suiteWithData   = {},
        suiteSimple1    = {},
        suiteSimple2    = {},
        suiteSimple3    = {};

    // Some intentional mis-configurations to exercise safety nets
    var formConfig = {
      formDataApi   : {
        save  : function( formData ) {
          // this should call the save data API
          return true;
        },
        wrap  : function( formData ) {
          // this should normally return the data wrapped with metadata
          return null;
        },
        unwrap: function( formData ) {
          // this should normally return the unwrapped form
          return null;
        }
      },
      annotationsApi: {
        getFormAnnotations: "this should normally be a function"
      }
    };

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
                                  formlyApiCheck, iscFormDataApi ) {
      formlyApiCheck.config.disabled = true;

      createDirective( suiteSimple1, getMinimalForm( 'simple1' ) );
      suiteSimple1.$httpBackend.flush();

      createDirective( suiteSimple2, getMinimalForm( 'simple2' ) );
      suiteSimple2.$timeout.flush();

      createDirective( suiteSimple3, getMinimalForm( 'simple3' ) );
      suiteSimple3.$timeout.flush();

      createDirective( suiteConfigured, getConfiguredForm(), formConfig );
      suiteConfigured.$timeout.flush();

      createDirective( suiteWithData, getFormWithData() );
      suiteWithData.$timeout.flush();

      function createDirective( suite, html, formConfig ) {
        suite.$window      = $window;
        suite.$httpBackend = $httpBackend;
        suite.$timeout     = $timeout;
        suite.formDataApi  = iscFormDataApi;
        mockFormResponses( suite.$httpBackend );

        suite.$rootScope             = $rootScope;
        suite.$scope                 = $rootScope.$new();
        suite.$scope.localFormConfig = formConfig;
        suite.element                = $compile( html )( suite.$scope );
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
      cleanup( suiteWithData );
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

      it( 'should save when submit is clicked', function() {
        var suite = suiteSimple1;

        var submitButtonConfig = getButtonConfig( suite ).submit;
        spyOn( submitButtonConfig, 'onClick' ).and.callThrough();
        spyOn( submitButtonConfig, 'afterClick' ).and.callThrough();
        spyOn( suite.formDataApi, 'post' ).and.callThrough();
        spyOn( suite.formDataApi, 'put' ).and.callThrough();

        // POST form
        var button = suite.element.find( '#submitButton' );
        button.click();
        suite.$httpBackend.flush();

        expect( submitButtonConfig.onClick ).toHaveBeenCalled();
        expect( submitButtonConfig.afterClick ).toHaveBeenCalled();
        expect( suite.formDataApi.post ).toHaveBeenCalled();

        // PUT form
        button.click();
        suite.$httpBackend.flush();
        expect( suite.formDataApi.put ).toHaveBeenCalled();
      } );

      it( 'should go back when cancel is clicked', function() {
        var suite = suiteSimple1;

        var cancelButtonConfig = getButtonConfig( suite ).cancel;
        spyOn( cancelButtonConfig, 'onClick' ).and.callThrough();
        spyOn( cancelButtonConfig, 'afterClick' ).and.callThrough();
        spyOn( suite.$window.history, 'back' ).and.callThrough();

        var button = suite.element.find( '#cancelButton' );
        button.click();

        expect( suite.$window.history.back ).toHaveBeenCalled();
      } );
    } );


    function getFormConfig( suite ) {
      return _.get( suite, 'controller.internalFormConfig' );
    }

    function getButtonConfig( suite ) {
      return _.get( suite, 'controller.internalButtonConfig' );
    }

    function getMinimalForm( formKey ) {
      return '<isc-form ' + 'form-key="' + formKey + '" ' + '></isc-form>'
    }

    function getConfiguredForm() {
      return '<isc-form ' +
        'form-key="intake" ' +
        'form-data-id=""' +
        'form-version=""' +
        'mode="edit"' +
        // 'form-config="' + JSON.stringify( formConfig ) + '"' +
        'form-config="localFormConfig"' +
        '></isc-form>';
    }

    function getFormWithData() {
      return '<isc-form ' +
        'form-key="intake" ' +
        'form-data-id="123"' +
        'mode="view"' +
        '></isc-form>';
    }

  } );

})();