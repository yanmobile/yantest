(function () {
  'use strict';

  describe('iscFormsModel', function () {
    var model,
        api,
        dataApi,
        httpBackend,
        timeout;

    beforeEach(module('formly', 'isc.http', 'isc.forms', 'isc.templates',
      function ($provide) {
        $provide.value('$log', console);
        $provide.value('apiHelper', mockApiHelper);
        $provide.value('iscCustomConfigService', mockCustomConfigService);
      })
    );

    beforeEach(inject(function (iscFormsModel, iscFormsApi, iscFormDataApi,
                                $httpBackend, $timeout) {
      model       = iscFormsModel;
      api         = iscFormsApi;
      dataApi     = iscFormDataApi;
      httpBackend = $httpBackend;
      timeout     = $timeout;

      mockFormResponses(httpBackend);
    }));

    afterEach(function () {
      if (customConfig.cleanup) {
        httpBackend = null;
      }
    });

    describe('iscFormsModel', function () {
      it('should have revealed functions', function () {
        expect(_.isFunction(model.getForms)).toBe(true);
        expect(_.isFunction(model.getActiveForm)).toBe(true);
        expect(_.isFunction(model.getActiveForms)).toBe(true);
        expect(_.isFunction(model.setFormStatus)).toBe(true);
        expect(_.isFunction(model.getFormDefinition)).toBe(true);
        expect(_.isFunction(model.getValidationDefinition)).toBe(true);
      });
    });

    describe('model.getForms', function () {
      it('should get the list of forms', function () {
        var formType = 'initial';

        // test API
        test();
        httpBackend.flush();

        // test local cache
        test();
        timeout.flush();

        function test() {
          model.getForms(formType).then(function (response) {
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
        model.getActiveForm(formType).then(function (response) {
          expect(_.isObject(response)).toBe(true);
          expect(response).toEqual(getFormStatuses(formType, true)[0]);
        });
        httpBackend.flush();
      });
    });

    describe('model.getActiveForms', function () {
      it('should get the current active forms, for a formType with multiple active members', function () {
        var formType = 'treatment';

        model.getActiveForms(formType).then(function (response) {
          expect(_.isArray(response)).toBe(true);
          expect(response.length).toBeGreaterThan(1);
          expect(response).toEqual(getFormStatuses(formType, true));
        });
        httpBackend.flush();
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
        model.getForms(formType).then(function (response) {
          formList = response;
          expect(formList[0].formKey).toEqual(currentlyActiveForm);
          expect(response[0].status).toEqual('Active');

          // Activate a different form
          model.setFormStatus(formType, formToActivate, formList).then(function () {
            // Expect the original form to be inactive now
            model.getForms(formType).then(function (response) {
              expect(response[0].formKey).toEqual(currentlyActiveForm);
              expect(response[0].status).toEqual('Inactive');
            });
          });
          httpBackend.flush();
        });
      });
    });

    describe('model.getFormDefinition', function () {
      it('should get the form definition', function () {
        var formKey    = 'intake',
            subformKey = 'embeddableSubform';

        spyOn(api, 'getFormDefinition').and.callThrough();
        spyOn(api, 'getUserScript').and.callThrough();
        spyOn(api, 'getTemplate').and.callThrough();

        test('edit');
        httpBackend.flush();

        // definition is now cached
        test('view');
        timeout.flush();

        function test(mode) {
          model.getFormDefinition(formKey, mode).then(function (response) {
            expect(api.getFormDefinition).toHaveBeenCalled();
            expect(api.getUserScript).toHaveBeenCalledWith("loadPatient");
            expect(api.getTemplate).toHaveBeenCalledWith("js/customTemplate");

            var form     = response.form,
                subforms = response.subforms;

            expect(_.isObject(form)).toBe(true);
            expect(form.name).toEqual('Sample Intake Form');

            expect(subforms[subformKey]).toBeDefined();
            expect(_.isArray(subforms[subformKey])).toBe(true);
          });
        }
      });
    });

    describe('model.getValidationDefinition', function () {
      it('should get the validation definition for the form', function () {
        var formKey = 'intake';

        test(); // test initial API fetch
        httpBackend.flush();

        test(); // test cached version
        timeout.flush();

        function test() {
          model.getValidationDefinition(formKey).then(function (response) {
            // There should be a list of subform fields keyed by the data model path of that collection field
            var collectionValidation = _.find(response, {
              key: 'sampleEmbeddedSubform'
            });
            expect(collectionValidation.fields.length).toBeGreaterThan(0);
          });
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