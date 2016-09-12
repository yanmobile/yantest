(function() {
  'use strict';

  describe( 'iscFormsModel', function() {
    var suite;

    useDefaultFormsModules();

    mockDefaultFormStates();

    beforeEach( inject( function( iscFormsModel, iscFormsApi, iscFormDataApi,
      $httpBackend, $timeout ) {
      suite = window.createSuite( {
        model      : iscFormsModel,
        api        : iscFormsApi,
        dataApi    : iscFormDataApi,
        httpBackend: $httpBackend,
        timeout    : $timeout
      } );

      mockFormResponses( suite.httpBackend );
    } ) );


    describe( 'iscFormsModel', function() {
      it( 'should have revealed functions', function() {
        expect( _.isFunction( suite.model.getForms ) ).toBe( true );
        expect( _.isFunction( suite.model.getActiveForm ) ).toBe( true );
        expect( _.isFunction( suite.model.getActiveForms ) ).toBe( true );
        expect( _.isFunction( suite.model.setFormStatus ) ).toBe( true );
        expect( _.isFunction( suite.model.getFormDefinition ) ).toBe( true );
        expect( _.isFunction( suite.model.getValidationDefinition ) ).toBe( true );
        expect( _.isFunction( suite.model.invalidateCache ) ).toBe( true );
      } );
    } );

    describe( 'model.getForms', function() {
      it( 'should get the list of forms', function() {
        var formType = 'initial';

        // test API
        test();
        suite.httpBackend.flush();

        // test local cache
        test();
        suite.timeout.flush();

        function test() {
          suite.model.getForms( formType ).then( function( response ) {
            expect( _.isArray( response ) ).toBe( true );
            expect( response ).toEqual( getFormStatuses( formType ) );
          } );
        }
      } );
    } );

    describe( 'model.getActiveForm', function() {
      it( 'should get the current active form, for a formType with a singleton active member', function() {
        var formType = 'closeout';

        // Returns an object
        suite.model.getActiveForm( formType ).then( function( response ) {
          expect( _.isObject( response ) ).toBe( true );
          expect( response ).toEqual( getFormStatuses( formType, true )[0] );
        } );
        suite.httpBackend.flush();
      } );
    } );

    describe( 'model.getActiveForms', function() {
      it( 'should get the current active forms, for a formType with multiple active members', function() {
        var formType = 'treatment';

        suite.model.getActiveForms( formType ).then( function( response ) {
          expect( _.isArray( response ) ).toBe( true );
          expect( response.length ).toBeGreaterThan( 1 );
          expect( response ).toEqual( getFormStatuses( formType, true ) );
        } );
        suite.httpBackend.flush();
      } );
    } );

    describe( 'model.setFormStatus', function() {
      it( 'should set the status of the given formType', function() {
        var formType            = 'initial',
            currentlyActiveForm = 'comprehensive',
            formToActivate      = {
              formKey: 'sample',
              status : 'Active'
            },
            formList;

        // Retrieve form list
        suite.model.getForms( formType ).then( function( response ) {
          formList = response;
          expect( formList[0].formKey ).toEqual( currentlyActiveForm );
          expect( response[0].status ).toEqual( 'Active' );

          // Activate a different form
          suite.model.setFormStatus( formType, formToActivate, formList ).then( function() {
            // Expect the original form to be inactive now
            suite.model.getForms( formType ).then( function( response ) {
              expect( response[0].formKey ).toEqual( currentlyActiveForm );
              expect( response[0].status ).toEqual( 'Inactive' );
            } );
          } );
        } );
        suite.httpBackend.flush();
      } );
    } );

    describe( 'model.getFormDefinition', function() {
      it( 'should get the form definition', function() {
        var formKey    = 'comprehensive',
            subformKey = 'embeddableSubform';
        spyOn( suite.api, 'getFormDefinition' ).and.callThrough();
        spyOn( suite.api, 'getUserScript' ).and.callThrough();
        spyOn( suite.api, 'getTemplate' ).and.callThrough();

        test( 'edit' );
        suite.httpBackend.flush();

        // definition is now cached
        test( 'view' );
        suite.timeout.flush();

        function test( mode ) {
          suite.model.getFormDefinition( {
            formKey: formKey,
            mode   : mode
          } )
            .then( function( response ) {
              expect( suite.api.getFormDefinition ).toHaveBeenCalled();
              expect( suite.api.getUserScript ).toHaveBeenCalledWith( "loadPatient" );
              expect( suite.api.getTemplate ).toHaveBeenCalledWith( "js/customTemplate" );
              expect( suite.api.getTemplate ).toHaveBeenCalledWith( "html/customTemplate/customTemplate.input.html" );
              expect( suite.api.getTemplate ).toHaveBeenCalledWith( "css/customTemplate" );
              expect( suite.api.getTemplate ).toHaveBeenCalledWith( "wrappers/customWrapper" );
              expect( suite.api.getTemplate ).toHaveBeenCalledWith( "wrappers/customWrapperForBuiltIn" );

              var form     = response.form,
                  subforms = response.subforms;

              expect( _.isObject( form ) ).toBe( true );
              expect( form.name ).toEqual( 'Sample Comprehensive Form' );

              expect( subforms[subformKey] ).toBeDefined();
            } );
        }
      } );
    } );

    describe( 'model.getFormDefinition', function() {
      it( 'should exercise view mode outside the cache', function() {
        var formKey = 'comprehensive';

        test( 'view' );
        suite.httpBackend.flush();

        function test( mode ) {
          suite.model.getFormDefinition( {
            formKey: formKey,
            mode   : mode
          } );
        }
      } );
    } );

    describe( 'model.invalidateCache', function() {
      it( 'should force the API to request the form definition from the server next time', function() {
        var formKey1  = 'simple1',
            formKey2  = 'simple2',
            callCount = 0,
            getApi    = suite.api.getFormDefinition;

        spyOn( suite.model, 'invalidateCache' ).and.callThrough();
        spyOn( suite.api, 'getFormDefinition' ).and.callFake( function( formKey ) {
          callCount++;
          return getApi( formKey );
        } );

        testGet( formKey1 );
        testGet( formKey2 );
        suite.httpBackend.flush();

        // One API call per form
        expect( suite.api.getFormDefinition ).toHaveBeenCalled();
        expect( callCount ).toBe( 2 );

        // Both definitions are now cached, so should still be only one API call per form
        testGet( formKey1 );
        testGet( formKey2 );
        expect( callCount ).toBe( 2 );

        // Clear the cache for formKey1 only
        suite.model.invalidateCache( formKey1 );

        testGet( formKey1 );
        // Should be one new call for form 1
        expect( callCount ).toBe( 3 );

        testGet( formKey2 );
        // Should be no new call for form 2
        expect( callCount ).toBe( 3 );

        function testGet( formKey ) {
          suite.model.getFormDefinition( {
            formKey: formKey
          } );
        }
      } );
    } );

    describe( 'model.getValidationDefinition', function() {
      it( 'should get the validation definition for the form', function() {
        var formKey = 'comprehensive';

        test(); // test initial API fetch
        suite.httpBackend.flush();

        test(); // test cached version
        suite.timeout.flush();

        function test() {
          suite.model.getValidationDefinition( { formKey: formKey } )
            .then( function( response ) {
              // There should be a list of subform fields keyed by the data model path of that collection field
              var collectionValidation = _.find( response, {
                key: 'sampleEmbeddedSubform'
              } );
              expect( collectionValidation.fields.length ).toBeGreaterThan( 0 );
            } );
        }
      } );
    } );
  } );

  function getFormStatuses( formType, activeOnly ) {
    var filterObj = {
      formType: formType
    };
    if ( activeOnly ) {
      filterObj.status = 'Active';
    }
    return _.filter( mockFormStore.formStatus, filterObj );
  }
})();
