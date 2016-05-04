(function () {
  'use strict';

  describe('iscFormsApi', function () {
    var api,
        httpBackend;

    beforeEach(module('formly', 'isc.http', 'isc.forms', 'isc.templates',
      function ($provide) {
        $provide.value('$log', console);
        $provide.value('apiHelper', mockApiHelper);
        $provide.value('iscCustomConfigService', mockCustomConfigService);
      })
    );

    beforeEach(inject(function (iscFormsApi, $httpBackend) {
      api         = iscFormsApi;
      httpBackend = $httpBackend;

      mockFormResponses(httpBackend);
    }));

    afterEach(function () {
      if (customConfig.cleanup) {
        httpBackend = null;
      }
    });

    describe('iscFormApi', function () {
      it('should have revealed functions', function () {
        expect(_.isFunction(api.listForms)).toBe(true);
        expect(_.isFunction(api.getFormStatuses)).toBe(true);
        expect(_.isFunction(api.setFormStatus)).toBe(true);
        expect(_.isFunction(api.getFormDefinition)).toBe(true);
        expect(_.isFunction(api.getUserScript)).toBe(true);
        expect(_.isFunction(api.getTemplate)).toBe(true);
      });
    });

    describe('api.formList', function () {
      it('should get the list of forms', function () {
        api.listForms().then(function (forms) {
          expect(forms).toBeDefined();
          expect(forms).toEqual(mockFormData.formStore);
        });
        httpBackend.flush();
      });
    });

    describe('api.getFormStatuses', function () {
      it('should get the form statuses of the given formType', function () {
        var formType    = 'initial',
            intakeForms = getFormStatuses(formType);
        api.getFormStatuses(formType).then(function (forms) {
          expect(forms).toEqual(intakeForms);
        });
        httpBackend.flush();

        formType           = 'treatment';
        var treatmentForms = getFormStatuses(formType);
        api.getFormStatuses(formType).then(function (forms) {
          expect(forms).toEqual(treatmentForms);
          expect(forms).not.toEqual(intakeForms);
        });
        httpBackend.flush();
      });
    });

    describe('api.setFormStatus', function () {
      it('should set the status of the given form type', function () {
        var formType = 'initial',
            formKey  = 'intake';

        // Intake is currently active
        api.getFormStatuses(formType).then(function (forms) {
          expect(forms[0].status).toEqual('Active');   // intake
          expect(forms[1].status).toEqual('Inactive'); // sample
        });

        // Inactivate it
        api.setFormStatus(formType, [
          {
            'formKey': formKey,
            'status' : 'Inactive'
          }
        ]);
        httpBackend.flush();

        // Expect it to be inactive
        api.getFormStatuses(formType).then(function (forms) {
          expect(forms[0].status).toEqual('Inactive'); // intake
          expect(forms[1].status).toEqual('Inactive'); // sample
        });
        httpBackend.flush();
      });
    });

    describe('api.getFormDefinition', function () {
      it('should get the form definition from the API', function () {
        var formKey = 'intake';

        api.getFormDefinition(formKey).then(function (formDef) {
          expect(formDef).toBeDefined();
          expect(formDef).toEqual(mockFormData.formDefinitions[formKey]);
        });
        httpBackend.flush();

        formKey = 'embedMe';
        api.getFormDefinition(formKey).then(function (formDef) {
          expect(formDef).toBeDefined();
          expect(formDef).toEqual(mockFormData.formDefinitions[formKey]);
        });
        httpBackend.flush();
      });
    });

    describe('api.getUserScript', function () {
      it('should get a user script from the API', function () {
        var result,
            scriptName = 'loadPatient';

        result = api.getUserScript(scriptName).then(function (response) {
          expect(response).toBeDefined();
        });
        httpBackend.flush();
        expect(_.get(result, '$$state.value.status')).not.toBe(404);
      });
    });

    describe('api.getTemplate', function () {
      it('should get a custom template from the API', function () {
        var result,
            templateName = 'customTemplate',
            htmlName     = 'customTemplate.input.html';

        // html template
        result = api.getTemplate(['html', templateName, htmlName].join('/')).then(function (response) {
          expect(response).toBeDefined();
        });
        httpBackend.flush();
        expect(_.get(result, '$$state.value.status')).not.toBe(404);

        // js script
        result = api.getTemplate(['js', templateName].join('/')).then(function (response) {
          expect(response).toBeDefined();
        });
        httpBackend.flush();
        expect(_.get(result, '$$state.value.status')).not.toBe(404);

        // css stylesheet
        result = api.getTemplate(['css', templateName].join('/')).then(function (response) {
          expect(response).toBeDefined();
        });
        httpBackend.flush();
        expect(_.get(result, '$$state.value.status')).not.toBe(404);
      });
    });
  });

  function getFormStatuses(formType) {
    return _.filter(mockFormData.formStore, {
      formType: formType
    });
  }
})();