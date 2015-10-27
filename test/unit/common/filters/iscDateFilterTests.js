
(function(){
  'use strict';

  var mockConfig = angular.copy( customConfig );

  describe('iscDateFilter', function(){
    var scope,
        filter;


    beforeEach( module('isc.common'));

    beforeEach( module('isc.common'), function( $provide ){
      $provide.value('$log', console);
    });


    beforeEach( inject( function( $rootScope, $injector ){
      scope = $rootScope.$new();
      filter = $injector.get('$filter')('iscDate');

      //"2014-12-08 04:57:00" - expected format
    }));

    // -------------------------
    describe( 'date filter tests ', function(){

      it( 'should return the right date string - today', function(){
        var today = moment();

        var month = (today.month() + 1);
        month = ( month < 10 ) ? '0' + month : month;
        var day = today.date();
        day = ( day < 10 ) ? '0' + day : day;
        var dateStr = today.year() + '-' + month + '-' + day + ' 04:57:00'; //note extra whitespace
        var expected  = filter( dateStr, 'fromNow' );
        expect( expected ).toEqual( jasmine.stringMatching('hours ago') );
      });

      it( 'should return the right date string - yesterday', function(){
        var yesterday = moment().subtract(1,'days');

        var month = (yesterday.month() + 1);
        month = ( month < 10 ) ? '0' + month : month;
        var day = yesterday.date();
        day = ( day < 10 ) ? '0' + day : day;
        var dateStr = yesterday.year() + '-' + month + '-' + day + ' 04:57:00';

        var expected  = filter( dateStr, 'fromNow' );
        expect( expected ).toBe( 'a day ago' );

      });

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

