(function () {
  'use strict';

  describe('iscFormsModel', function () {
    var suite = {};

    beforeEach(module('formly', 'isc.http', 'isc.forms', 'isc.templates',
      function ($provide, devlogProvider) {
        $provide.value('$log', console);
        $provide.value('apiHelper', mockApiHelper);
        $provide.value('iscCustomConfigService', mockCustomConfigService);
        devlogProvider.loadConfig( mockCustomConfigService.getConfig() );
      })
    );

    beforeEach(inject(function (iscFormsModel, iscFormsApi, iscFormDataApi,
                                $httpBackend, $timeout) {
      suite.model       = iscFormsModel;
      suite.api         = iscFormsApi;
      suite.dataApi     = iscFormDataApi;
      suite.httpBackend = $httpBackend;
      suite.timeout     = $timeout;

      mockFormResponses(suite.httpBackend);
    }));

    afterEach(function () {
      cleanup(suite);
    });

    describe('iscFormsModel', function () {
      it('should have revealed functions', function () {
        expect(_.isFunction(suite.model.getForms)).toBe(true);
        expect(_.isFunction(suite.model.getActiveForm)).toBe(true);
        expect(_.isFunction(suite.model.getActiveForms)).toBe(true);
        expect(_.isFunction(suite.model.setFormStatus)).toBe(true);
        expect(_.isFunction(suite.model.getFormDefinition)).toBe(true);
        expect(_.isFunction(suite.model.getValidationDefinition)).toBe(true);
      });
    });

    describe('model.getForms', function () {
      it('should get the list of forms', function () {
        var formType = 'initial';

        // test API
        test();
        suite.httpBackend.flush();

        // test local cache
        test();
        suite.timeout.flush();

        function test() {
          suite.model.getForms(formType).then(function (response) {
            expect(_.isArray(response)).toBe(true);
            expect(response).toEqual(getFormStatuses(formType));
          });
        }
      });
    });

    describe('model.getActiveForm', function () {
      it('should get the current active form, for a formType with a singleton active member', function () {
        var formType = 'closeout';

        // Returns an object
        suite.model.getActiveForm(formType).then(function (response) {
          expect(_.isObject(response)).toBe(true);
          expect(response).toEqual(getFormStatuses(formType, true)[0]);
        });
        suite.httpBackend.flush();
      });
    });

    describe('model.getActiveForms', function () {
      it('should get the current active forms, for a formType with multiple active members', function () {
        var formType = 'treatment';

        suite.model.getActiveForms(formType).then(function (response) {
          expect(_.isArray(response)).toBe(true);
          expect(response.length).toBeGreaterThan(1);
          expect(response).toEqual(getFormStatuses(formType, true));
        });
        suite.httpBackend.flush();
      });
    });

    describe('model.setFormStatus', function () {
      it('should set the status of the given formType', function () {
        var formType            = 'initial',
            currentlyActiveForm = 'intake',
            formToActivate      = {
              formKey: 'sample',
              status : 'Active'
            },
            formList;

        // Retrieve form list
        suite.model.getForms(formType).then(function (response) {
          formList = response;
          expect(formList[0].formKey).toEqual(currentlyActiveForm);
          expect(response[0].status).toEqual('Active');

          // Activate a different form
          suite.model.setFormStatus(formType, formToActivate, formList).then(function () {
            // Expect the original form to be inactive now
            suite.model.getForms(formType).then(function (response) {
              expect(response[0].formKey).toEqual(currentlyActiveForm);
              expect(response[0].status).toEqual('Inactive');
            });
          });
        });
        suite.httpBackend.flush();
      });
    });

    describe('model.getFormDefinition', function () {
      it('should get the form definition', function () {
        var formKey    = 'intake',
            subformKey = 'embeddableSubform';
        spyOn(suite.api, 'getFormDefinition').and.callThrough();
        spyOn(suite.api, 'getUserScript').and.callThrough();
        spyOn(suite.api, 'getTemplate').and.callThrough();

        test('edit');
        suite.httpBackend.flush();

        // definition is now cached
        test('view');
        suite.timeout.flush();

        function test(mode) {
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

              var form     = response.form,
                  subforms = response.subforms;

              expect( _.isObject( form ) ).toBe( true );
              expect( form.name ).toEqual( 'Sample Intake Form' );

              expect( subforms[subformKey] ).toBeDefined();
              expect( _.isArray( subforms[subformKey] ) ).toBe( true );
            } );
        }
      });
    });

    describe('model.getValidationDefinition', function () {
      it('should get the validation definition for the form', function () {
        var formKey = 'intake';

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
      });
    });
  });

  function getFormStatuses(formType, activeOnly) {
    var filterObj = {
      formType: formType
    };
    if (activeOnly) {
      filterObj.status = 'Active';
    }
    return _.filter(mockFormStore.formStatus, filterObj);
  }
})();
