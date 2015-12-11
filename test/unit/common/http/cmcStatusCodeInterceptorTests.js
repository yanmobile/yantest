(function () {
  'use strict';

  var url = '/fake/url';

  describe('iscStatusCodesInterceptor test', function () {

    var fakeConfirmationService;
    var interceptor;

    beforeEach(module('isc.http', function ($provide) {
      fakeConfirmationService = {
        show: function () {
        }
      };
      $provide.value('iscConfirmationService', fakeConfirmationService);
    }));

    beforeEach(inject(function (iscStatusCodesInterceptor) {
      interceptor = iscStatusCodesInterceptor;
    }));


    /**
     *  tests
     */
    describe('sanity check', function () {
      it('should have interceptor defined', function () {
        expect(interceptor).toBeDefined();
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

  })
}());
