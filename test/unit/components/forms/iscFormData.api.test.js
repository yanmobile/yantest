(function () {
  'use strict';

  describe('iscFormDataApi', function () {
    var suite ;

    useDefaultModules( 'formly', 'isc.http', 'isc.forms', 'isc.templates',
      function ($provide) {
        suite = window.createSuite();
        $provide.value('apiHelper', mockApiHelper);
        $provide.value('iscCustomConfigService', mockCustomConfigService);
      });

    mockDefaultFormStates();
    
    beforeEach(inject(function (iscFormDataApi, $httpBackend) {
      suite.api         = iscFormDataApi;
      suite.httpBackend = $httpBackend;

      mockFormResponses(suite.httpBackend);
    }));

    describe('iscFormApi', function () {
      it('should have revealed functions', function () {
        expect(_.isFunction(suite.api.get)).toBe(true);
        expect(_.isFunction(suite.api.put)).toBe(true);
        expect(_.isFunction(suite.api.post)).toBe(true);
        expect(_.isFunction(suite.api.delete)).toBe(true);
        expect(_.isFunction(suite.api.list)).toBe(true);
      });
    });

    describe('api.get', function () {
      it('should get the form data', function () {
        var id = 1, data;
        suite.api.get(id).then(function (formData) {
          data = formData;
          expect(formData).toBeDefined();
          expect(formData).toEqual(_.find(mockFormStore.formData, {id: id}));
        });
        suite.httpBackend.flush();

        id = 2;
        suite.api.get(id).then(function (formData) {
          expect(formData).not.toEqual(data);
          expect(formData).toBeDefined();
          expect(formData).toEqual(_.find(mockFormStore.formData, {id: id}));
        });
        suite.httpBackend.flush();
      });
    });

    describe('api.put', function () {
      it('should update the form data', function () {
        var id = 1;

        // Get form data
        suite.api.get(id).then(function (response) {
          var formData = response;

          // Make a change
          var formDataWithChanges = _.merge({}, formData, {
            data: {
              test: 'test'
            }
          });
          suite.api.put(id, formDataWithChanges).then(function (response) {
            expect(response).toBeDefined();
            expect(response).toEqual(formDataWithChanges);
          });

          // Get again and expect it to match the new changes
          suite.api.get(id).then(function (response) {
            expect(response).toBeDefined();
            expect(response).not.toEqual(formData);
            expect(response).toEqual(formDataWithChanges);
          });
        });
        suite.httpBackend.flush();
      });
    });

    describe('api.post', function () {
      it('should save a new form to the API', function () {
        var expectedId = 4,
            formData = {
              test : 'test'
            };

        suite.api.get(expectedId).then(function (response) {
          expect(response).toEqual({});

          suite.api.post(formData).then(function (response) {
            expect(response.data).toEqual(formData);
          });

          suite.api.get(expectedId).then(function (response) {
            expect(response.id).toEqual(expectedId);
            expect(response.data).toEqual(formData);
          });
        });
        suite.httpBackend.flush();
      });
    });

    describe('api.delete', function () {
      it('should delete the form in the API', function () {
        var id = 1;

        suite.api.get(id).then(function (response) {
          expect(response.id).toEqual(id);

          suite.api.delete(id);

          suite.api.get(id).then(function (response) {
            expect(response).toEqual({});
          });
        });
        suite.httpBackend.flush();
      });
    });

    describe('api.list', function () {
      it('should list all the forms', function () {
        suite.api.list().then(function (response) {
          expect(response).toBeDefined();
          expect(response).toEqual(mockFormStore.formData);
        });
        suite.httpBackend.flush();
      });
    });
  });
})();
