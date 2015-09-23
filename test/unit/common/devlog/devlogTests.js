
(function(){
  'use strict';

  describe('devlog', function() {
    beforeEach( module('isc.common'));

    var $log;
    var devlog;
    var iscCustomConfigService;
    var mockConfig;

    beforeEach(inject(function(_$log_, _devlog_, _iscCustomConfigService_) {
      $log = _$log_;
      devlog = _devlog_;
      iscCustomConfigService = _iscCustomConfigService_;

      mockConfig = angular.copy( customConfig );
      spyOn( iscCustomConfigService, 'getConfig').and.returnValue( mockConfig );

    }));

    describe(
        'basic log calls',
        function() {
          it(
              'should function as a wrapper to $log - string',
              function() {

                devlog.log('This is a log message');
                //console.log( '$log', $log.log );
                expect( $log.log.logs[0][0] ).toBe( 'This is a log message' );
              }
          );
          it(
              'should function as a wrapper to $log - object',
              function() {
                devlog.log({a:1});
                expect( $log.log.logs[0][0] ).toEqual( {a:1} );
              }
          );
        }
    );

    describe(
        'channel usage with no channels',
        function() {
          it(
              'should not go through - no whitelist present',
              function() {
                mockConfig.devlogWhitelist = undefined;
                devlog.channel().log('This is a log message');
                expect( $log.log.logs ).toEqual( [] );
              }
          );
          it(
              'should always go through - no whitelist entries',
              function() {
                mockConfig.devlogWhitelist = [];
                devlog.channel().log('This is a log message');
                expect( $log.log.logs[0][0] ).toBe( 'This is a log message' );
              }
          );
          it(
              'should always go through - with whitelist entries',
              function() {
                mockConfig.devlogWhitelist = [];
                mockConfig.devlogWhitelist.push('apple');
                mockConfig.devlogWhitelist.push('banana');
                devlog.channel().log('This is a log message');
                expect( $log.log.logs[0][0] ).toBe( 'This is a log message' );
              }
          );
        }
    );

    describe(
        'channel usage with one channel',
        function() {
          it(
              'should not go through with no whitelist present',
              function() {
                mockConfig.devlogWhitelist = undefined;
                devlog.channel('banana').log('This is a log message');
                expect( $log.log.logs ).toEqual( [] );
              }
          );
          it(
              'should go through when whitelisted',
              function() {
                mockConfig.devlogWhitelist = [];
                mockConfig.devlogWhitelist.push('apple');
                mockConfig.devlogWhitelist.push('banana');
                devlog.channel('banana').log('This is a log message');
                expect( $log.log.logs[0][0] ).toBe( 'This is a log message' );
              }
          );
          it(
              'should not go through when not whitelisted',
              function() {
                mockConfig.devlogWhitelist = [];
                mockConfig.devlogWhitelist.push('apple');
                mockConfig.devlogWhitelist.push('banana');
                devlog.channel('cookie').log('This is a log message');
                expect( $log.log.logs ).toEqual( [] );
              }
          );
        }
    );

    describe(
        'channel usage with multiple channels',
        function() {
          it(
              'should not go through with no whitelist present',
              function() {
                mockConfig.devlogWhitelist = undefined;
                devlog.channel('cookie', 'banana', 'duck').log('This is a log message');
                expect( $log.log.logs ).toEqual( [] );
              }
          );
          it(
              'should go through when any are whitelisted',
              function() {
                //console.log( mockConfig );
                mockConfig.devlogWhitelist.push('apple');
                mockConfig.devlogWhitelist.push('banana');
                devlog.channel('cookie', 'banana', 'duck').log('This is a log message');
                expect( $log.log.logs[0][0] ).toBe( 'This is a log message' );
              }
          );
          it(
              'should not go through when none are whitelisted',
              function() {
                mockConfig.devlogWhitelist.push('apple');
                mockConfig.devlogWhitelist.push('banana');
                devlog.channel('cookie', 'duck', 'eagle').log('This is a log message');
                expect( $log.log.logs ).toEqual( [] );
              }
          );
        }
    );
  });

})();
