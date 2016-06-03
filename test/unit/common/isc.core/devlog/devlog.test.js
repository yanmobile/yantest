(function() {
  'use strict';

  describe( 'devlog', function() {
    var $log;
    var devlogProvider;
    var devlog;
    var mockConfig;

    // show $log statements

    function initNonProductionConfig() {
      beforeEach( module( 'isc.core', function( _devlogProvider_ ) {
        devlogProvider = _devlogProvider_;
        mockConfig     = angular.copy( customConfig );
        devlogProvider.loadConfig( mockConfig );
      } ) );
      beforeEach( inject( function( _$log_, _devlog_ ) {
        $log   = _$log_;
        devlog = _devlog_;
      } ) );
    }

    function initProductionConfig() {
      beforeEach( module( 'isc.core', function( _devlogProvider_ ) {
        devlogProvider        = _devlogProvider_;
        mockConfig            = angular.copy( customConfig );
        mockConfig.production = true;
        devlogProvider.loadConfig( mockConfig );
      } ) );
      beforeEach( inject( function( _$log_, _devlog_ ) {
        $log   = _$log_;
        devlog = _devlog_;
      } ) );
    }

    describe(
      'performance testing',
      function() {
        initNonProductionConfig();
        it( 'should take less than 100ms to log 10k messages directly to devlog.debug', function() {
          var duration;
          var loops;

          var now = Date.now();
          for ( loops = 10000; loops >= 0; --loops ) {
            devlog.debug( 'This is a debug message' );
          }
          duration = Date.now() - now;
          //console.log(duration);
          expect( duration < 100 ).toBe( true );
        } );

        it( 'should take less than 100ms to log 10k white-listed messages', function() {
          var duration;
          var loops;

          var now                    = Date.now();
          mockConfig.devlogWhitelist = ['banana'];
          var log                    = devlog.channel( 'banana' );
          for ( loops = 10000; loops >= 0; --loops ) {
            log.debug( 'This is white listed' );
          }
          duration = Date.now() - now;
          //console.log(duration);
          expect( duration < 100 ).toBe( true );
        } );
        it( 'should take less than 100ms to log 10k black-listed messages', function() {
          var duration;
          var loops;

          var now                    = Date.now();
          mockConfig.devlogBlacklist = ['apple', 'banana'];
          var log                    = devlog.channel( 'banana' );
          for ( loops = 10000; loops >= 0; --loops ) {
            log.debug( 'this is blacklisted' );
          }
          duration = Date.now() - now;
          //console.log(duration);
          expect( duration < 100 ).toBe( true );
        } );
      }
    );

    describe(
      'basic debug calls',
      function() {

        initNonProductionConfig();

        it( 'should have logFn on .channel()', function() {

          mockConfig.devlogWhitelist = ['myChannel'];
          devlogProvider.loadConfig( mockConfig );
          expect( devlog.logFn ).toBeDefined();
          devlog.channel( 'myChannel' ).logFn( 'myFunc' );
          var output = $log.log.logs[1].join( ' ' );
          expect( output ).toBe( "===== myChannel.myFunc () =====" );
        } );

        it( 'should be able to output additional params', function() {
          mockConfig.devlogWhitelist = ['myChannel'];
          devlogProvider.loadConfig( mockConfig );
          devlog.channel( 'myChannel' ).logFn( 'myFunc', 1, "name" );
          var output = $log.log.logs[1].join( ' ' );
          expect( output ).toBe( "===== myChannel.myFunc (1, name) =====" );
        } );

        it(
          'should function as a wrapper to $log - string',
          function() {
            devlog.debug( 'This is a debug message' );
            expect( $log.debug.logs[0][0] ).toBe( 'This is a debug message' );
          }
        );
        it(
          'should function as a wrapper to $log - object',
          function() {
            devlog.debug( { a: 1 } );
            expect( $log.debug.logs[0][0] ).toEqual( { a: 1 } );
          }
        );
      }
    );

    describe( 'channel usage with no channels', function() {

        initNonProductionConfig();
        it( 'should not go through - no whitelist present', function() {

            mockConfig.devlogWhitelist = undefined;
            devlogProvider.loadConfig( mockConfig );
            devlog.channel().debug( 'This is a debug message' );
            expect( $log.debug.logs ).toEqual( [] );
          }
        );
        it(
          'should not go through - no whitelist present',
          function() {

            mockConfig.devlogWhitelist = [];
            devlogProvider.loadConfig( mockConfig );
            devlog.channel( 'myChannel' ).debug( 'This is a debug message' );
            expect( $log.debug.logs ).toEqual( [] );
          }
        );
        it(
          'should always go through - no whitelist entries',
          function() {
            mockConfig.devlogWhitelist = [];
            devlogProvider.loadConfig( mockConfig );
            devlog.channel().debug( 'This is a debug message' );
            expect( $log.debug.logs[0][0] ).toBe( 'This is a debug message' );
          }
        );
        it(
          'should always go through - with whitelist entries',
          function() {
            mockConfig.devlogWhitelist = ['apple', 'banana'];
            devlogProvider.loadConfig( mockConfig );
            devlog.channel().debug( 'This is a debug message' );
            expect( $log.debug.logs[0][0] ).toBe( 'This is a debug message' );
          }
        );
      }
    );

    describe( 'channel usage with one channel', function() {
        initNonProductionConfig();
        it( 'should keep the passed in channel casing', function() {
          var expected               = "|baNanA|";
          mockConfig.devlogWhitelist = ["*"];
          devlogProvider.loadConfig( mockConfig );
          devlog.channel( 'baNanA' ).debug( 'This is an error message' );
          expect( $log.debug.logs[0][0] ).toBe( expected );
        } );

        it(
          'should not go through with no whitelist present',
          function() {
            mockConfig.devlogWhitelist = undefined;
            devlogProvider.loadConfig( mockConfig );
            devlog.channel( 'banana' ).debug( 'This is a debug message' );
            expect( $log.debug.logs ).toEqual( [] );
          }
        );
        it(
          'should go through when whitelisted',
          function() {
            mockConfig.devlogWhitelist = ['apple', 'banana'];
            devlogProvider.loadConfig( mockConfig );
            devlog.channel( 'banana' ).debug( 'This is a debug message' );
            expect( $log.debug.logs[0].join( ' ' ) ).toBe( '|banana| This is a debug message' );
          }
        );
        it(
          'should not go through when not whitelisted',
          function() {
            mockConfig.devlogWhitelist = ['apple', 'banana'];
            devlogProvider.loadConfig( mockConfig );
            devlog.channel( 'cookie' ).debug( 'This is a debug message' );
            expect( $log.debug.logs ).toEqual( [] );
          }
        );
      }
    );

    describe(
      'channel usage with multiple channels',
      function() {
        initNonProductionConfig();
        it(
          'should not go through with no whitelist present',
          function() {
            mockConfig.devlogWhitelist = undefined;
            devlogProvider.loadConfig( mockConfig );
            devlog.channel( 'cookie', 'banana', 'duck' ).debug( 'This is a debug message' );
            expect( $log.debug.logs ).toEqual( [] );
          }
        );
        //it(
        //  'should go through when any are whitelisted',
        //  function () {
        //    //console.log( mockConfig );
        //    mockConfig.devlogWhitelist.push('apple');
        //    mockConfig.devlogWhitelist.push('banana');
        //    devlogProvider.loadConfig(mockConfig);
        //    devlog.channel('cookie', 'banana', 'duck').debug('This is a debug message');
        //    expect($log.debug.logs[0][0]).toBe('|BANANA| This is a debug message');
        //  }
        //);
        it(
          'should not go through when none are whitelisted',
          function() {
            mockConfig.devlogWhitelist = ['apple', 'banana'];
            devlogProvider.loadConfig( mockConfig );
            devlog.channel( 'cookie', 'duck', 'eagle' ).debug( 'This is a debug message' );
            expect( $log.debug.logs ).toEqual( [] );
          }
        );
      }
    );

    describe( 'blacklisted channel', function() {
      initNonProductionConfig();
      it(
        'should not go through when channel is blacklisted',
        function() {
          mockConfig.devlogBlacklist = ['apple'];
          mockConfig.devlogWhitelist = ['apple'];
          devlogProvider.loadConfig( mockConfig );
          devlog.channel( 'apple' ).debug( 'This is a debug message' );
          expect( $log.debug.logs ).toEqual( [] );
        }
      );
    } );

    describe( 'logging errors', function() {
      initNonProductionConfig();

      it( 'should go through if channel blacklisted', function() {
        mockConfig.devlogBlacklist = ['apple'];
        devlogProvider.loadConfig( mockConfig );
        devlog.channel( 'apple' ).error( 'This is an error message' );
        expect( $log.error.logs[0].join( ' ' ) ).toEqual( '|apple| This is an error message' );
      } );

      it( 'should go through if not whitelisted', function() {
        mockConfig.devlogBlacklist = [];
        devlogProvider.loadConfig( mockConfig );
        devlog.channel( 'apple' ).error( 'This is an error message' );
        expect( $log.error.logs[0].join( ' ' ) ).toEqual( '|apple| This is an error message' );
      } );

      it( 'should go through if no channel defined', function() {
        mockConfig.devlogBlacklist = [];
        devlogProvider.loadConfig( mockConfig );
        devlog.debug( 'This is a debug message' );
        expect( $log.debug.logs[0] ).toEqual( ['This is a debug message'] );
      } );

    } );

    describe( 'suppress all channel when in production', function() {
      initProductionConfig();
      it( 'should suppress all messages when in production', function() {
        inject( function( _$log_, _devlog_ ) {
          devlogProvider.loadConfig( mockConfig );
          $log   = _$log_;
          devlog = _devlog_;
        } );

        devlog.channel( 'apple' ).debug( 'This is a debug message' );
        expect( $log.debug.logs ).toEqual( [] );

        devlog.error( 'This is a debug message' );
        expect( $log.error.logs ).toEqual( [] );

      } );
    } );
  } );

})();
