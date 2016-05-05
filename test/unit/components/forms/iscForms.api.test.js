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
          expect(forms).toEqual(mockFormStore.formStatus);
        });
        httpBackend.flush();
      });
    });

    describe('api.getFormStatuses', function () {
      it('should get the form statuses of the given formType', function () {
        var formType    = 'initial',
            intakeForms = getFormStatuses(formType);
        api.getFormStatuses(formType).then(function (response) {
          expect(response).toEqual(intakeForms);
        });
        httpBackend.flush();

        formType           = 'treatment';
        var treatmentForms = getFormStatuses(formType);
        api.getFormStatuses(formType).then(function (response) {
          expect(response).toEqual(treatmentForms);
          expect(response).not.toEqual(intakeForms);
        });
        httpBackend.flush();
      });
    });

    describe('api.setFormStatus', function () {
      it('should set the status of the given form type', function () {
        var formType = 'initial',
            formKey  = 'intake';

        // Intake is currently active
        api.getFormStatuses(formType).then(function (response) {
          expect(response[0].status).toEqual('Active');   // intake
          expect(response[1].status).toEqual('Inactive'); // sample
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
        api.getFormStatuses(formType).then(function (response) {
          expect(response[0].status).toEqual('Inactive'); // intake
          expect(response[1].status).toEqual('Inactive'); // sample
        });
        httpBackend.flush();
      });
    });

    describe('api.getFormDefinition', function () {
      it('should get the form definition from the API', function () {
        var formKey = 'intake';

        api.getFormDefinition(formKey).then(function (response) {
          // Full forms are objects
          expect(_.isObject(response)).toBe(true);
          // with names
          expect(response.name).toEqual('Sample Intake Form');
        });
        httpBackend.flush();

        formKey = 'embeddableSubform';
        api.getFormDefinition(formKey).then(function (response) {
          expect(response).not.toBe('');
          // Embedded forms are arrays
          expect(_.isArray(response)).toBe(true);
        });
        httpBackend.flush();
      });
    });

    describe('api.getUserScript', function () {
      it('should get a user script from the API', function () {
        var scriptName = 'loadPatient';

        api.getUserScript(scriptName).then(function (response) {
          expect(response).not.toBe('');
        });
        httpBackend.flush();
      });
    });

    describe('api.getTemplate', function () {
      it('should get a custom template from the API', function () {
        var templateName = 'customTemplate',
            htmlName     = 'customTemplate.input.html';

        // html template
        api.getTemplate(['html', templateName, htmlName].join('/')).then(function (response) {
          expect(response).not.toBe('');
        });
        httpBackend.flush();

        // js script
        api.getTemplate(['js', templateName].join('/')).then(function (response) {
          expect(response).not.toBe('');
        });
        httpBackend.flush();

        // css stylesheet
        api.getTemplate(['css', templateName].join('/')).then(function (response) {
          expect(response).not.toBe('');
        });
        httpBackend.flush();
      });
    });
  });

  function getFormStatuses(formType) {
    return _.filter(mockFormStore.formStatus, {
      formType: formType
    });
  }
})();