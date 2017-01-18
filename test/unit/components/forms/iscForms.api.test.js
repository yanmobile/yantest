(function() {
  'use strict';

  describe( 'iscFormsApi', function() {
    var suite;

    useDefaultFormsModules();

    mockDefaultFormStates();

    beforeEach( inject( function( iscFormsApi, iscFormsModel, $httpBackend ) {
      suite = window.createSuite( {
        api        : iscFormsApi,
        model      : iscFormsModel,
        httpBackend: $httpBackend
      } );

      mockFormResponses( suite.httpBackend );
    } ) );


    describe( 'iscFormApi', function() {
      it( 'should have revealed functions', function() {
        expect( _.isFunction( suite.api.getFdnAsset ) ).toBe( true );
        expect( _.isFunction( suite.api.getFormDefinition ) ).toBe( true );
        expect( _.isFunction( suite.api.getTemplate ) ).toBe( true );
        expect( _.isFunction( suite.api.getUserScript ) ).toBe( true );
        expect( _.isFunction( suite.api.listForms ) ).toBe( true );
      } );
    } );

    describe( 'api.formList', function() {
      it( 'should get the list of forms', function() {
        suite.api.listForms().then( function( forms ) {
          expect( forms ).toEqual( mockFormStore.formStatus );
        } );
        suite.httpBackend.flush();
      } );
    } );

    describe( 'api.getFdnAsset', function() {
      it( 'should get the form definition from local assets', function() {
        var fdnName = 'localFdnTest';

        suite.api.getFdnAsset(fdnName).then(function (response) {
          var formDefinition = suite.model.unwrapFormDefinitionResponse( response );

          expect( _.isObject( formDefinition ) ).toBe( true );
          expect( formDefinition.name ).toEqual( 'Asset Form' );
        });
        suite.httpBackend.flush();
      } );
    } );

    describe( 'api.getFormDefinition', function() {
      it( 'should get the form definition from the API', function() {
        var formKey = 'comprehensive';

        suite.api.getFormDefinition( formKey ).then( function( response ) {
          var formDefinition = suite.model.unwrapFormDefinitionResponse( response );

          // Full forms are objects
          expect( _.isObject( formDefinition ) ).toBe( true );
          // with names
          expect( formDefinition.name ).toEqual( 'Sample Comprehensive Form' );
        } );
        suite.httpBackend.flush();

        formKey = 'embeddableSubform';
        suite.api.getFormDefinition( formKey ).then( function( response ) {
          var formDefinition = suite.model.unwrapFormDefinitionResponse( response );

          // Embedded forms are arrays
          expect( _.isArray( formDefinition ) ).toBe( true );
        } );
        suite.httpBackend.flush();
      } );
    } );

    describe( 'api.getUserScript', function() {
      it( 'should get a user script from the API', function() {
        var scriptName = 'loadPatient';

        suite.api.getUserScript( scriptName ).then( function( response ) {
          expect( response ).not.toBe( '' );
        } );
        suite.httpBackend.flush();
      } );
    } );

    describe( 'api.getTemplate', function() {
      it( 'should get a custom template from the API', function() {
        var templateName = 'customTemplate',
            htmlName     = 'customTemplate.input.html';

        // html template
        suite.api.getTemplate( ['html', templateName, htmlName].join( '/' ) ).then( function( response ) {
          expect( response ).not.toBe( '' );
        } );
        suite.httpBackend.flush();

        // js script
        suite.api.getTemplate( ['js', templateName].join( '/' ) ).then( function( response ) {
          expect( response ).not.toBe( '' );
        } );
        suite.httpBackend.flush();

        // css stylesheet
        suite.api.getTemplate( ['css', templateName].join( '/' ) ).then( function( response ) {
          expect( response ).not.toBe( '' );
        } );
        suite.httpBackend.flush();
      } );
    } );
  } );
})();