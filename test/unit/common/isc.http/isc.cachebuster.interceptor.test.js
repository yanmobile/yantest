(function () {
  'use strict';

  var url = '/fake/url';

  describe('iscCacheBuster test', function () {

    var interceptor;

    // setup devlog
    beforeEach (module ('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig (customConfig);
    }));

    beforeEach (module ('isc.http'));

    beforeEach (inject (function (iscCacheBusterInterceptor) {
      interceptor = iscCacheBusterInterceptor;
    }));


    /**
     *  tests
     */
    describe('sanity check', function () {
      it('should have interceptor defined', function () {
        expect(interceptor).toBeDefined();
      });
    });

    describe('method test ', function () {
      it('should work', function () {

        var myResult = interceptor.request({})

        expect(myResult.params.ts).not.toBe(undefined);

        myResult = interceptor.request({url: 'foo.html'});

       //html does not get a cache bust
        expect(myResult.params).toBe(undefined);
      });
    });

  });
}());
