(function () {
  'use strict';

  fdescribe('devlog', function () {
    var $log;
    var devlog;
    var mockConfig;

    // show $log statements
    beforeEach(module('isc.core', function (devlogProvider) {
      mockConfig = angular.copy(customConfig);
      devlogProvider.loadConfig(mockConfig);
    }));

    beforeEach(inject(function (_$log_, _devlog_) {
      $log   = _$log_;
      devlog = _devlog_;
    }));

    describe(
      'basic debug calls',
      function () {
        it(
          'should function as a wrapper to $log - string',
          function () {
            devlog.debug('This is a debug message');
            expect($log.debug.logs[0][0]).toBe('This is a debug message');
          }
        );
        it(
          'should function as a wrapper to $log - object',
          function () {
            devlog.debug({ a: 1 });
            expect($log.debug.logs[0][1]).toEqual({ a: 1 });
          }
        );
      }
    );

    describe(
      'channel usage with no channels',
      function () {
        it(
          'should not go through - no whitelist present',
          function () {
            mockConfig.devlogWhitelist = undefined;
            devlog.channel().debug('This is a debug message');
            expect($log.debug.logs).toEqual([]);
          }
        );
        it(
          'should always go through - no whitelist entries',
          function () {
            mockConfig.devlogWhitelist = [];
            devlog.channel().debug('This is a debug message');
            expect($log.debug.logs[0][0]).toBe('This is a debug message');
          }
        );
        it(
          'should always go through - with whitelist entries',
          function () {
            mockConfig.devlogWhitelist = [];
            mockConfig.devlogWhitelist.push('apple');
            mockConfig.devlogWhitelist.push('banana');
            devlog.channel().debug('This is a debug message');
            expect($log.debug.logs[0][0]).toBe('This is a debug message');
          }
        );
      }
    );

    describe(
      'channel usage with one channel',
      function () {
        it(
          'should not go through with no whitelist present',
          function () {
            mockConfig.devlogWhitelist = undefined;
            devlog.channel('banana').debug('This is a debug message');
            expect($log.debug.logs).toEqual([]);
          }
        );
        it(
          'should go through when whitelisted',
          function () {
            mockConfig.devlogWhitelist = [];
            mockConfig.devlogWhitelist.push('apple');
            mockConfig.devlogWhitelist.push('banana');
            devlog.channel('banana').debug('This is a debug message');
            expect($log.debug.logs[0][0]).toBe('|BANANA| This is a debug message');
          }
        );
        it(
          'should not go through when not whitelisted',
          function () {
            mockConfig.devlogWhitelist = [];
            mockConfig.devlogWhitelist.push('apple');
            mockConfig.devlogWhitelist.push('banana');
            devlog.channel('cookie').debug('This is a debug message');
            expect($log.debug.logs).toEqual([]);
          }
        );
      }
    );

    describe(
      'channel usage with multiple channels',
      function () {
        it(
          'should not go through with no whitelist present',
          function () {
            mockConfig.devlogWhitelist = undefined;
            devlog.channel('cookie', 'banana', 'duck').debug('This is a debug message');
            expect($log.debug.logs).toEqual([]);
          }
        );
        it(
          'should go through when any are whitelisted',
          function () {
            //console.log( mockConfig );
            mockConfig.devlogWhitelist.push('apple');
            mockConfig.devlogWhitelist.push('banana');
            devlog.channel('cookie', 'banana', 'duck').debug('This is a debug message');
            expect($log.debug.logs[0][0]).toBe('|BANANA| This is a debug message');
          }
        );
        it(
          'should not go through when none are whitelisted',
          function () {
            mockConfig.devlogWhitelist.push('apple');
            mockConfig.devlogWhitelist.push('banana');
            devlog.channel('cookie', 'duck', 'eagle').debug('This is a debug message');
            expect($log.debug.logs).toEqual([]);
          }
        );
      }
    );

    describe('blacklisted channel', function () {
      it(
        'should not go through when channel is blacklisted',
        function () {
          mockConfig.devlogBlacklist.push('apple');
          mockConfig.devlogWhitelist.push('apple');
          devlog.channel('apple').debug('This is a debug message');
          expect($log.debug.logs).toEqual([]);
        }
      );
    });
  });

})();
