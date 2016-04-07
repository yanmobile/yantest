(function () {
  'use strict';

  describe('iscLoggingInterceptor test', function () {

    var fakeDevLog;
    var interceptor;
    var $rootScope; //needed for $q to resolve/reject

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    // setup devlog
    beforeEach(module('isc.configuration', function (iscCustomConfigServiceProvider) {
      iscCustomConfigServiceProvider.loadConfig(customConfig);
    }));

    beforeEach(module('isc.http', function ($provide) {
      fakeDevLog = { channel: _.noop, debug: _.noop, logFn: _.noop };
      $provide.value('devlog', fakeDevLog);
      spyOn(fakeDevLog, 'channel').and.returnValue(fakeDevLog);
    }));

    beforeEach(inject(function (_$rootScope_, iscLoggingInterceptor) {
      interceptor = iscLoggingInterceptor;
      $rootScope  = _$rootScope_;
    }));


    /**
     *  tests
     */
    describe('sanity check', function () {
      it('should have interceptor defined', function () {
        expect(interceptor).toBeDefined();
        expect(interceptor.request).toBeDefined();
        expect(interceptor.response).toBeDefined();
        expect(interceptor.responseError).toBeDefined();
      });
    });

    describe('outgoing requests', function () {

      it('should log when requesting *.html files', function () {
        spyOn(fakeDevLog, 'debug');

        interceptor.request({ url: 'foo.json', data: 'myData' });
        expect(fakeDevLog.channel).toHaveBeenCalled();
        expect(fakeDevLog.debug.calls.mostRecent().args).toEqual(['iscLoggingInterceptor request for %s', 'foo.json', 'myData']);
      });

      it('should not log when requesting *.html files', function () {
        spyOn(fakeDevLog, 'debug');

        interceptor.request({ url: 'foo.html' });
        expect(fakeDevLog.channel).not.toHaveBeenCalledWith('iscLoggingInterceptor');
      });

    });

    describe('incoming responses', function () {

      it('should return response', function () {
        spyOn(fakeDevLog, 'debug');

        var response = { config: { url: 'foo.json', data: 'myData' }, data: {} };

        var output = interceptor.response(response);
        expect(response).toEqual(output);
      });

      it('should log when response.data is of type object', function () {
        spyOn(fakeDevLog, 'debug');

        var response = { config: { url: 'foo.json', data: 'myData' }, data: {} };

        interceptor.response(response);
        expect(fakeDevLog.channel).toHaveBeenCalled();
        expect(fakeDevLog.debug.calls.mostRecent().args).toEqual(['iscLoggingInterceptor response for %s', 'foo.json', response]);
      });

      it('should log when response.data is of type array', function () {
        spyOn(fakeDevLog, 'debug');

        var response = { config: { url: 'foo.json', data: 'myData' }, data: [] };

        interceptor.response(response);
        expect(fakeDevLog.channel).toHaveBeenCalled();
        expect(fakeDevLog.debug.calls.mostRecent().args).toEqual(['iscLoggingInterceptor response for %s', 'foo.json', response]);
      });

      it('should not log when response.data is not object or array', function () {
        spyOn(fakeDevLog, 'debug');

        var response = { config: { url: 'foo.json', data: 'myData' }, data: '' };
        interceptor.response(response);
        expect(fakeDevLog.channel).not.toHaveBeenCalledWith('iscLoggingInterceptor');

        response = { config: { url: 'foo.json', data: 'myData' }, data: new Date() };
        interceptor.response(response);
        expect(fakeDevLog.channel).not.toHaveBeenCalledWith('iscLoggingInterceptor');

        response = { config: { url: 'foo.json', data: 'myData' }, data: 123 };
        interceptor.response(response);
        expect(fakeDevLog.channel).not.toHaveBeenCalledWith('iscLoggingInterceptor');

        response = { config: { url: 'foo.json', data: 'myData' }, data: new RegExp('foo') };
        interceptor.response(response);
        expect(fakeDevLog.channel).not.toHaveBeenCalledWith('iscLoggingInterceptor');

        response = { config: { url: 'foo.json', data: 'myData' }, data: false };
        interceptor.response(response);
        expect(fakeDevLog.channel).not.toHaveBeenCalledWith('iscLoggingInterceptor');
      });

    });

    describe('incoming error responses', function () {

      it('should log when response ', function () {
        spyOn(fakeDevLog, 'debug');

        var response = { config: { url: 'foo.json', data: 'myData' }, data: 'myData' };
        interceptor.responseError(response);
        expect(fakeDevLog.channel).toHaveBeenCalled();
        expect(fakeDevLog.debug.calls.mostRecent().args).toEqual(['iscLoggingInterceptor responseError for ', response]);
      });

      it('should return a rejected project', function () {
        var callback = { error: _.noop };
        spyOn(callback, 'error');

        var response = { config: { url: 'foo.json', data: 'myData' }, data: 'myData' };
        interceptor.responseError(response).then(null, callback.error);
        $rootScope.$digest(); //to resolve/reject the promise

        expect(callback.error).toHaveBeenCalledWith(response);
      });

    });
  });
}());