
(function(){
  'use strict';

  describe('iscDateFilter', function(){
    var scope,
        filter;

    // show $log statements
    beforeEach(module(function ($provide) {
      $provide.value('$log', mock$log);
    }));

    // setup devlog
    beforeEach(module('isc.core', 'isc.filters', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));

    beforeEach( inject( function( $rootScope, $injector ){
      scope = $rootScope.$new();
      filter = $injector.get('$filter')('iscDate');

      //"2014-12-08 04:57:00" - expected format
    }));

    // -------------------------
    describe( 'date filter tests ', function(){

      it( 'should return the right date string - some day', function(){
        var dateStr = '2014-12-07 04:57:00';
        var expected  = filter( dateStr );
        expect( expected ).toBe( 'December 7th, 2014 4:57 AM' );
      });

      it( 'should return the right date string - date', function(){
        var dateStr = '2014-12-07 04:57:00';
        var expected  = filter( dateStr, 'date' );
        expect( expected ).toBe( 'December 7th, 2014' );
      });

      it( 'should return the right date string - dateWithTime', function(){
        var dateStr = '2014-12-07 04:57:00';
        var expected = filter( dateStr, 'dateWithTime' );
        expect( expected ).toBe( '12/7/14 4:57 AM' );
      });

      it( 'should return the right date string - custom', function(){
        var dateStr = '2014-12-07 04:57:00';
        var expected  = filter( dateStr, 'l' );
        expect( expected ).toBe( '12/7/2014' );
      });

    });


  });
})();

