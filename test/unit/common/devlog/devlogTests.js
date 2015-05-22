
(function(){
  'use strict';

  describe('devlog', function() {
    beforeEach( module('hsSampleApp'));
    beforeEach( module('isc.common'));

    var $log;
    var devlog;
    var iscCustomConfigService;

    beforeEach(inject(function(_$log_, _devlog_, _iscCustomConfigService_) {
      $log = _$log_;
      devlog = _devlog_;
      iscCustomConfigService = _iscCustomConfigService_;
      spyOn( iscCustomConfigService, 'getConfig').andReturn(customConfig);
    }));

    describe(
      'basic debug calls',
      function() {
        it(
          'should function as a wrapper to $log - string',
          function() {
            devlog.debug("This is a debug message");
            expect( $log.debug.logs[0][0] ).toBe( "This is a debug message" );
          }
        );
        it(
          'should function as a wrapper to $log - object',
          function() {
            devlog.debug({a:1});
            expect( $log.debug.logs[0][0] ).toEqual( {a:1} );
          }
        );
      }
    );

    describe(
      'channel usage with no channels',
      function() {
        it(
          'should always go through - no whitelist entries',
          function() {
            devlog.channel().debug("This is a debug message");
            expect( $log.debug.logs[0][0] ).toBe( "This is a debug message" );
          }
        );
        it(
          'should always go through - with whitelist entries',
          function() {
            customConfig.devlogWhitelist.push('apple');
            customConfig.devlogWhitelist.push('banana');
            devlog.channel().debug("This is a debug message");
            expect( $log.debug.logs[0][0] ).toBe( "This is a debug message" );
          }
        );
      }
    );

    describe(
      'channel usage with one channel',
      function() {
        it(
          'should go through when whitelisted',
          function() {
            customConfig.devlogWhitelist.push('apple');
            customConfig.devlogWhitelist.push('banana');
            devlog.channel('banana').debug("This is a debug message");
            expect( $log.debug.logs[0][0] ).toBe( "This is a debug message" );
          }
        );
        it(
          'should not go through when not whitelisted',
          function() {
            customConfig.devlogWhitelist.push('apple');
            customConfig.devlogWhitelist.push('banana');
            devlog.channel('cookie').debug("This is a debug message");
            expect( $log.debug.logs ).toEqual( [] );
          }
        );
      }
    );

    describe(
      'channel usage with multiple channels',
      function() {
        it(
          'should go through when any are whitelisted',
          function() {
            customConfig.devlogWhitelist.push('apple');
            customConfig.devlogWhitelist.push('banana');
            devlog.channel('cookie', 'banana', 'duck').debug("This is a debug message");
            expect( $log.debug.logs[0][0] ).toBe( "This is a debug message" );
          }
        );
        it(
          'should not go through when none are whitelisted',
          function() {
            customConfig.devlogWhitelist.push('apple');
            customConfig.devlogWhitelist.push('banana');
            devlog.channel('cookie', 'duck', 'eagle').debug("This is a debug message");
            expect( $log.debug.logs ).toEqual( [] );
          }
        );
      }
    );
  });

})();
