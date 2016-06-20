(function() {
  'use strict';

  describe( 'iscForm', function() {
    var suiteConfigured = {},
        suiteMinimal    = {};

    var formConfig = {};

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

    beforeEach( inject( function( $rootScope, $compile, $templateCache, $httpBackend, $timeout, formlyApiCheck ) {
      formlyApiCheck.config.disabled = true;

      createDirective( suiteMinimal, getMinimalForm() );
      suiteMinimal.httpBackend.flush();
      createDirective( suiteConfigured, getConfiguredForm() );
      suiteConfigured.timeout.flush();

      function createDirective( suite, html ) {
        suite.httpBackend = $httpBackend;
        suite.timeout     = $timeout;
        mockFormResponses( suite.httpBackend );

        suite.$rootScope = $rootScope;
        suite.$scope     = $rootScope.$new();
        suite.element    = $compile( html )( suite.$scope );
        suite.$scope.$digest();
        suite.$isolateScope = suite.element.isolateScope();
        suite.controller    = suite.$isolateScope.formCtrl;
      }
    } ) );

    afterEach( function() {
      cleanup( suiteConfigured );
      cleanup( suiteMinimal );
    } );

    describe( 'iscForm', function() {
      it( 'should have base directive configuration', function() {
        testSuite( suiteMinimal );
        testSuite( suiteConfigured );

        function testSuite( suite ) {
          expect( suite.controller.internalFormConfig ).toBeDefined();
        }
      } );
    } );

    describe( 'api.formList', function() {

    } );

    
    function getMinimalForm() {
      return '<isc-form ' +
        'form-key="intake" ' +
        'mode="view"' +
        '></isc-form>'
    }

    function getConfiguredForm() {
      return '<isc-form ' +
        'form-key="intake" ' +
        'form-data-id=""' +
        'form-version=""' +
        'mode="edit"' +
        'form-config="' + JSON.stringify( formConfig ) + '"' +
        '></isc-form>';
    }

  } );

})();