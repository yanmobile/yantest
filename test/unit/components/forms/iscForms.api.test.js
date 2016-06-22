(function () {
  'use strict';

  describe('iscFormsApi', function () {
    var suite ;

    beforeEach(module('formly', 'isc.http', 'isc.forms', 'isc.templates',
      function ($provide) {
        suite = window.createSuite();
        $provide.value('$log', console);
        $provide.value('apiHelper', mockApiHelper);
        $provide.value('iscCustomConfigService', mockCustomConfigService);
      })
    );

    beforeEach(inject(function (iscFormsApi, $httpBackend) {
      suite.api         = iscFormsApi;
      suite.httpBackend = $httpBackend;

      mockFormResponses(suite.httpBackend);
    }));


    describe('iscFormApi', function () {
      it('should have revealed functions', function () {
        expect(_.isFunction(suite.api.listForms)).toBe(true);
        expect(_.isFunction(suite.api.getFormStatuses)).toBe(true);
        expect(_.isFunction(suite.api.setFormStatus)).toBe(true);
        expect(_.isFunction(suite.api.getFormDefinition)).toBe(true);
        expect(_.isFunction(suite.api.getUserScript)).toBe(true);
        expect(_.isFunction(suite.api.getTemplate)).toBe(true);
      });
    });

    describe('api.formList', function () {
      it('should get the list of forms', function () {
        suite.api.listForms().then(function (forms) {
          expect(forms).toEqual(mockFormStore.formStatus);
        });
        suite.httpBackend.flush();
      });
    });

    describe('api.getFormStatuses', function () {
      it('should get the form statuses of the given formType', function () {
        var formType    = 'initial',
            intakeForms = getFormStatuses(formType);
        suite.api.getFormStatuses(formType).then(function (response) {
          expect(response).toEqual(intakeForms);
        });
        suite.httpBackend.flush();

        formType           = 'treatment';
        var treatmentForms = getFormStatuses(formType);
        suite.api.getFormStatuses(formType).then(function (response) {
          expect(response).toEqual(treatmentForms);
          expect(response).not.toEqual(intakeForms);
        });
        suite.httpBackend.flush();
      });
    });

    describe('api.setFormStatus', function () {
      it('should set the status of the given form type', function () {
        var formType = 'initial',
            formKey  = 'intake';

        // Intake is currently active
        suite.api.getFormStatuses(formType).then(function (response) {
          expect(response[0].status).toEqual('Active');   // intake
          expect(response[1].status).toEqual('Inactive'); // sample
        });

        // Inactivate it
        suite.api.setFormStatus(formType, [
          {
            'formKey': formKey,
            'status' : 'Inactive'
          }
        ]);
        suite.httpBackend.flush();

        // Expect it to be inactive
        suite.api.getFormStatuses(formType).then(function (response) {
          expect(response[0].status).toEqual('Inactive'); // intake
          expect(response[1].status).toEqual('Inactive'); // sample
        });
        suite.httpBackend.flush();
      });
    });

    describe('api.getFormDefinition', function () {
      it('should get the form definition from the API', function () {
        var formKey = 'intake';

        suite.api.getFormDefinition(formKey).then(function (response) {
          // Full forms are objects
          expect(_.isObject(response)).toBe(true);
          // with names
          expect(response.name).toEqual('Sample Intake Form');
        });
        suite.httpBackend.flush();

        formKey = 'embeddableSubform';
        suite.api.getFormDefinition(formKey).then(function (response) {
          expect(response).not.toBe('');
          // Embedded forms are arrays
          expect(_.isArray(response)).toBe(true);
        });
        suite.httpBackend.flush();
      });
    });

    describe('api.getUserScript', function () {
      it('should get a user script from the API', function () {
        var scriptName = 'loadPatient';

        suite.api.getUserScript(scriptName).then(function (response) {
          expect(response).not.toBe('');
        });
        suite.httpBackend.flush();
      });
    });

    describe('api.getTemplate', function () {
      it('should get a custom template from the API', function () {
        var templateName = 'customTemplate',
            htmlName     = 'customTemplate.input.html';

        // html template
        suite.api.getTemplate(['html', templateName, htmlName].join('/')).then(function (response) {
          expect(response).not.toBe('');
        });
        suite.httpBackend.flush();

        // js script
        suite.api.getTemplate(['js', templateName].join('/')).then(function (response) {
          expect(response).not.toBe('');
        });
        suite.httpBackend.flush();

        // css stylesheet
        suite.api.getTemplate(['css', templateName].join('/')).then(function (response) {
          expect(response).not.toBe('');
        });
        suite.httpBackend.flush();
      });
    });
  });

  function getFormStatuses(formType) {
    return _.filter(mockFormStore.formStatus, {
      formType: formType
    });
  }
})();