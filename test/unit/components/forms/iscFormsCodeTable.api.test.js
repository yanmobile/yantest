(function () {
  'use strict';

  describe('iscFormsCodeTableApi', function () {
    var api,
        httpBackend,
        timeout;

    beforeEach(module('formly', 'isc.http', 'isc.forms', 'isc.templates',
      function ($provide) {
        $provide.value('$log', console);
        $provide.value('apiHelper', mockApiHelper);
        $provide.value('iscCustomConfigService', mockCustomConfigService);
      })
    );

    beforeEach(inject(function (iscFormsCodeTableApi,
                                $httpBackend, $timeout) {
      api         = iscFormsCodeTableApi;
      httpBackend = $httpBackend;
      timeout     = $timeout;

      mockFormResponses(httpBackend);
    }));

    afterEach(function () {
      if (customConfig.cleanup) {
        httpBackend = null;
      }
    });

    describe('iscFormsCodeTableApi', function () {
      it('should have revealed functions', function () {
        expect(_.isFunction(api.loadAll)).toBe(true);
        expect(_.isFunction(api.get)).toBe(true);
      });
    });

    describe('api.loadAll', function () {
      it('should get the code tables from the API', function () {
        api.loadAll().then(function (response) {
          expect(response.US_states.length).toBe(50);
        });
        httpBackend.flush();
      });
    });

    describe('api.get', function () {
      it('should return a code table synchronously', function () {
        // First code tables must be loaded from the server
        api.loadAll();
        httpBackend.flush();

        // Then they are queried synchronously from the cache
        var sampleTable = api.get('US_states');
        expect(sampleTable).toBeDefined();
        expect(_.isArray(sampleTable)).toBe(true);
        expect(sampleTable.length).toEqual(50); // fifty nifty
      });
    });

  });
})();