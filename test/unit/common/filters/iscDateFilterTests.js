
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

      it( 'should return the right date string', function(){
        var today = new Date();

        var month = (today.getMonth() + 1 );
        month = ( month < 10 ) ? '0' + month : month;
        var day = today.getDate();
        day = ( day < 10 ) ? '0' + day : day;
        var dateStr = today.getFullYear() + '-' + month + '-' + day + '      04:57:00'; //note extra whitespace
        var expected  = filter( dateStr );
        expect( expected).toBe( 'ISC_TODAY' );

        var month = (today.getMonth() + 1 );
        month = ( month < 10 ) ? '0' + month : month;
        var day = today.getDate() - 1;
        day = ( day < 10 ) ? '0' + day : day;
        var dateStr = today.getFullYear() + '-' + month + '-' + day + ' 04:57:00';
        var expected  = filter( dateStr );
        expect( expected).toBe( 'ISC_YESTERDAY' );

        dateStr = '2014-12-07 04:57:00';
        expected  = filter( dateStr );
        expect( expected).toBe( '2014-Dec-07' );

      });
    });


  });
})();

