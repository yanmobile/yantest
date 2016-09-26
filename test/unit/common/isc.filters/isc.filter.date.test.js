(function() {
  'use strict';

  describe( 'iscDateFilter', function() {
    var scope,
        filter;

    // setup devlog
    beforeEach( module( 'isc.core', 'isc.filters', function( devlogProvider ) {
      devlogProvider.loadConfig( customConfig );
    } ) );

    beforeEach( inject( function( $rootScope, $injector ) {
      scope  = $rootScope.$new();
      filter = $injector.get( '$filter' )( 'iscDate' );

      //"2014-12-08 04:57:00" - actual format
    } ) );

    // -------------------------
    describe( 'date filter tests ', function() {

      it( 'should return empty string if not date object', function() {
        var dateStr = '';
        var actual  = filter( dateStr );
        expect( actual ).toBe( '' );
      } );

      it( 'should return "1 day ago" when format is "fromNow"', function() {
        var dateStr = moment().subtract( 1, 'day' ).toDate();
        var actual  = filter( dateStr, 'fromNow' );
        expect( actual ).toBe( 'a day ago' );
      } );

      it( 'should return the right date string - some day', function() {
        var dateStr = '2014-12-07 04:57:00';
        var actual  = filter( dateStr );
        expect( actual ).toBe( 'December 7th, 2014 4:57 AM' );
      } );

      it( 'should return the right date string - date', function() {
        var dateStr = '2014-12-07 04:57:00';
        var actual  = filter( dateStr, 'date' );
        expect( actual ).toBe( 'December 7th, 2014' );
      } );

      it( 'should return the right date string - dateWithTime', function() {
        var dateStr = '2014-12-07 04:57:00';
        var actual  = filter( dateStr, 'dateWithTime' );
        expect( actual ).toBe( '12/7/14 4:57 AM' );
      } );

      it( 'should return the right date string - custom', function() {
        var dateStr = '2014-12-07 04:57:00';
        var actual  = filter( dateStr, 'l' );
        expect( actual ).toBe( '12/7/2014' );
      } );

      it( 'should log return the date string if moment is not defined', function() {
        var oldMoment = moment;
        moment        = null;
        var dateStr   = '2014-12-07 04:57:00';
        var expected  = dateStr;
        var actual    = filter( dateStr, 'l' );
        expect( expected ).toBe( actual );
        moment = oldMoment;
      } );

      it( 'should return the UTC version of the date if the UTC argument is provided', function() {
        var dateArray = [2014, 11, 7, 4, 57, 0];

        // If UTC is not passed, the date is created in the local time zone
        var actual = filter( dateArray, 'M/D/YY h:mm A Z' );
        expect( actual ).toBe( '12/7/14 4:57 AM -05:00' );

        // If UTC is passed, the date is created as UTC
        actual = filter( dateArray, 'M/D/YY h:mm A Z', true );
        expect( actual ).toBe( '12/7/14 4:57 AM +00:00' );
      } );
    } );


  } );
})();

