
(function(){
  'use strict';

  var mockConfig = angular.copy( customConfig );



  describe('iscDateFilter', function(){
    var scope,
        filter;

    beforeEach( module('iscHsCommunityAngular'));
    beforeEach( module('isc.common'));

    beforeEach( module('isc.common', 'iscHsCommunityAngular'), function( $provide ){
      $provide.value('$log', console);
    });


    beforeEach( inject( function( $rootScope, $injector ){
      scope = $rootScope.$new();
      filter = $injector.get('$filter')('iscDateFilter');

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
        var dateStr = today.year() + '-' + month + '-' + day + '      04:57:00'; //note extra whitespace
        var expected  = filter( dateStr );
        expect( expected ).toBe( 'ISC_TODAY' );
      });

      it( 'should return the right date string - yesterday', function(){
        var yesterday = moment().subtract(1,'days');

        var month = (yesterday.month() + 1);
        month = ( month < 10 ) ? '0' + month : month;
        var day = yesterday.date();
        day = ( day < 10 ) ? '0' + day : day;
        var dateStr = yesterday.year() + '-' + month + '-' + day + ' 04:57:00';

        var expected  = filter( dateStr );
        expect( expected ).toBe( 'ISC_YESTERDAY' );

      });

      it( 'should return the right date string - some day', function(){
        var dateStr = '2014-12-07 04:57:00';
        var expected  = filter( dateStr );
        expect( expected ).toBe( '2014-Dec-07' );
      });

    });


  });
})();

