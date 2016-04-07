(function () {
  'use strict';

  var $httpBackend;
  var iscHttpapi;
  var url = '/fake/url';

  describe('iscHttpapi.service test', function () {

    beforeEach(module('isc.http'));

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    // don't worry about calls to assets
    beforeEach(inject(function (_$httpBackend_, _iscHttpapi_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', /json$|html$/).respond(200, {});
      iscHttpapi   = _iscHttpapi_;
    }));

    // -------------------------
    describe('calling iscHttpapi\'s methods with default config', function () {
      var responseData = { name: 1 };

      it('should return response.data when GET is invoked', function () {

        $httpBackend.whenGET(url).respond(responseData);

        iscHttpapi.get(url).then(function (response) {
          expect(response).toEqual(responseData);
        });

        $httpBackend.flush();
      });

      it('should return response.data when PUT is invoked', function () {

        $httpBackend.whenPUT(url).respond(responseData);

        iscHttpapi.put(url, {}).then(function (response) {
          expect(response).toEqual(responseData);
        });

        $httpBackend.flush();
      });

      it('should return response.data when POST is invoked', function () {

        $httpBackend.whenPOST(url).respond(responseData);

        iscHttpapi.post(url).then(function (response) {
          expect(response).toEqual(responseData);
        });

        $httpBackend.flush();
      });

      it('should return response.data when DELETE is invoked', function () {

        $httpBackend.whenDELETE(url).respond(responseData);

        iscHttpapi.delete(url).then(function (response) {
          expect(response).toEqual(responseData);
        });

        $httpBackend.flush();
      });
    });

    describe('calling iscHttpapi\'s methods with {responseAsObject:true} overload', function () {

      var responseData = { name: 1 };
      var overloads    = { responseAsObject: true };

      it('should respond with raw ajax object when performing a GET request', function () {

        $httpBackend.whenGET(url).respond(responseData);

        iscHttpapi.get(url, overloads).then(function (response) {
          expect(response.config).not.toBeNull();
          expect(response.data).not.toBeNull();

          expect(response.data).toEqual(responseData);
        });

        $httpBackend.flush();
      });

      it('should respond with raw ajax object when performing a PUT request', function () {

        $httpBackend.whenPUT(url).respond(responseData);


        iscHttpapi.put(url, null, overloads).then(function (response) {
          expect(response.config).not.toBeNull();
          expect(response.data).not.toBeNull();

          expect(response.data).toEqual(responseData);
        });

        $httpBackend.flush();
      });

      it('should respond with raw ajax object when performing a POST request', function () {

        $httpBackend.whenPOST(url).respond(responseData);


        iscHttpapi.post(url, null, overloads).then(function (response) {
          expect(response.config).not.toBeNull();
          expect(response.data).not.toBeNull();

          expect(response.data).toEqual(responseData);
        });
        $httpBackend.flush();
      });

      it('should respond with raw ajax object when performing a DELETE request', function () {

        $httpBackend.whenDELETE(url).respond(responseData);


        iscHttpapi.delete(url, overloads).then(function (response) {
          expect(response.config).not.toBeNull();
          expect(response.data).not.toBeNull();

          expect(response.data).toEqual(responseData);
        });
        $httpBackend.flush();
      });

      it('should not have responseAsObject key in response.config', function () {
        //to illustrate the custom configs are not sent in the request
        $httpBackend.whenGET(url).respond(responseData);

        iscHttpapi.get(url, overloads).then(function (response) {
          expect(response.config).not.toBeNull();
          expect(_.has(response.config, 'responseData')).toBe(false);
        });

        $httpBackend.flush();
      });
    });
  });
})();
