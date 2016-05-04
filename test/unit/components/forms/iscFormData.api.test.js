(function () {
  'use strict';

  describe('iscFormDataApi', function () {
    var api,
        httpBackend;

    beforeEach(module('formly', 'isc.http', 'isc.forms', 'isc.templates',
      function ($provide) {
        $provide.value('$log', console);
        $provide.value('apiHelper', mockApiHelper);
        $provide.value('iscCustomConfigService', mockCustomConfigService);
      })
    );

    beforeEach(inject(function (iscFormDataApi, $httpBackend) {
      api         = iscFormDataApi;
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
        expect(_.isFunction(api.get)).toBe(true);
        expect(_.isFunction(api.put)).toBe(true);
        expect(_.isFunction(api.post)).toBe(true);
        expect(_.isFunction(api.delete)).toBe(true);
        expect(_.isFunction(api.list)).toBe(true);
      });
    });

    describe('api.get', function () {
      it('should get the form data', function () {
        var id = 1, data;
        api.get(id).then(function (formData) {
          data = formData;
          expect(formData).toBeDefined();
          expect(formData).toEqual(_.find(mockFormData.formData, {id: id}));
        });
        httpBackend.flush();

        id = 2;
        api.get(id).then(function (formData) {
          expect(formData).not.toEqual(data);
          expect(formData).toBeDefined();
          expect(formData).toEqual(_.find(mockFormData.formData, {id: id}));
        });
        httpBackend.flush();
      });
    });

    describe('api.put', function () {
      it('should update the form data', function () {
        var id = 1;

        // Get form data
        api.get(id).then(function (response) {
          var formData = response;

          // Make a change
          var formDataWithChanges = _.merge({}, formData, {
            data: {
              test: 'test'
            }
          });
          api.put(id, formDataWithChanges).then(function (response) {
            expect(response).toBeDefined();
            expect(response).toEqual(formDataWithChanges);
          });

          // Get again and expect it to match the new changes
          api.get(id).then(function (response) {
            expect(response).toBeDefined();
            expect(response).not.toEqual(formData);
            expect(response).toEqual(formDataWithChanges);
          });
        });
        httpBackend.flush();
      });
    });

    describe('api.post', function () {
      it('should save a new form to the API', function () {
        var expectedId = 3,
            formData = {
              test : 'test'
            };
        
        api.get(expectedId).then(function (response) {
          expect(response).toEqual({});

          api.post(formData).then(function (response) {
            expect(response.data).toEqual(formData);
          });

          api.get(expectedId).then(function (response) {
            expect(response.id).toEqual(expectedId);
            expect(response.data).toEqual(formData);
          });
        });
        httpBackend.flush();
      });
    });

    describe('api.delete', function () {
      it('should delete the form in the API', function () {
        var id = 1;

        api.get(id).then(function (response) {
          expect(response.id).toEqual(id);

          api.delete(id);
          
          api.get(id).then(function (response) {
            expect(response).toEqual({});
          });
        });
        httpBackend.flush();
      });
    });

    describe('api.list', function () {
      it('should list all the forms', function () {
        api.list().then(function (response) {
          expect(response).toBeDefined();
          expect(response).toEqual(mockFormData.formData);
        });
        httpBackend.flush();
      });
    });
  });
})();