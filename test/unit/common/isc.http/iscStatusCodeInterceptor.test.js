(function () {
  'use strict';

  var url = '/fake/url';

  describe('iscStatusCodesInterceptor test', function () {

    var fakeConfirmationService;
    var interceptor;
    var $rootScope;
    var AUTH_EVENTS;
    var statusCode;

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    beforeEach(module('isc.http', function ($provide) {
      fakeConfirmationService = {
        show: function () {
        }
      };
      $provide.value('iscConfirmationService', fakeConfirmationService);
    }));

    beforeEach(inject(function (iscStatusCodesInterceptor, _$rootScope_, _AUTH_EVENTS_, _statusCode_) {
      interceptor = iscStatusCodesInterceptor;
      $rootScope  = _$rootScope_;
      AUTH_EVENTS = _AUTH_EVENTS_;
      statusCode  = _statusCode_;
    }));


    /**
     *  tests
     */
    describe('sanity check', function () {
      it('should have interceptor defined', function () {
        expect(interceptor).toBeDefined();
      });
    });

    describe('status code 401', function () {
      it('should broadcast AUTH_EVENTS.sessionTimeout', function () {
        spyOn($rootScope, '$emit');
        var response = { status: statusCode.Unauthorized, config: {} };
        interceptor.responseError(response);
        expect($rootScope.$emit).toHaveBeenCalledWith(AUTH_EVENTS.sessionTimeout, response);

      });
    });

    describe('status code 403', function () {
      it('should broadcast AUTH_EVENTS.notAuthenticated', function () {
        spyOn($rootScope, '$emit');
        var response = { status: statusCode.Forbidden, config: {} };
        interceptor.responseError(response);
        expect($rootScope.$emit).toHaveBeenCalledWith(AUTH_EVENTS.notAuthenticated, response);

      });
    });

    describe('without preventDefault', function () {

      it('should have called confirmationService.show status 404', function () {
        spyOn(fakeConfirmationService, 'show');

        interceptor.responseError({ status: 404, config: {} });
        expect(fakeConfirmationService.show).toHaveBeenCalled();
      });

      it('should have called confirmationService.show status 555', function () {
        spyOn(fakeConfirmationService, 'show');

        interceptor.responseError({ status: 555, config: {} });
        expect(fakeConfirmationService.show).toHaveBeenCalled();
      });

    });

    describe('prevent default on ALL status code with preventDefault = true', function () {
      it('should not call confirmationService.show status 404', function () {
        spyOn(fakeConfirmationService, 'show');

        interceptor.responseError({ status: 404, config: { preventDefault: true } });
        expect(fakeConfirmationService.show).not.toHaveBeenCalled();
      });

      it('should not call confirmationService.show status 555', function () {
        spyOn(fakeConfirmationService, 'show');

        interceptor.responseError({ status: 555, config: { preventDefault: true } });
        expect(fakeConfirmationService.show).not.toHaveBeenCalled();
      });
    });

    describe('prevent default on selective status code with preventDefault = [codes]', function () {
      it('should call confirmation.show if status code is 404', function () {
        spyOn(fakeConfirmationService, 'show');

        interceptor.responseError({ status: 404, config: { preventDefault: [403] } });
        expect(fakeConfirmationService.show).toHaveBeenCalled();
      });

      it('should not call confirmationService.show status 404', function () {
        spyOn(fakeConfirmationService, 'show');

        interceptor.responseError({ status: 404, config: { preventDefault: [404] } });
        expect(fakeConfirmationService.show).not.toHaveBeenCalled();
      });

      it('should not call confirmationService.show status 555', function () {
        spyOn(fakeConfirmationService, 'show');

        interceptor.responseError({ status: 555, config: { preventDefault: [555] } });
        expect(fakeConfirmationService.show).not.toHaveBeenCalled();
      });
    });

  });
}());
