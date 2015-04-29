
(function(){
  'use strict';

  var mockConfig = angular.copy( customConfig );



  describe('iscHtmlToPlainText', function(){
    var scope,
        filter;

    beforeEach( module('iscHsCommunityAngular'));
    beforeEach( module('isc.common'));

    beforeEach( module('isc.common', 'iscHsCommunityAngular'), function( $provide ){
      $provide.value('$log', console);
    });


    beforeEach( inject( function( $rootScope, $injector ){
      scope = $rootScope.$new();
      filter = $injector.get('$filter')('iscHtmlToPlainText');

      //"2014-12-08 04:57:00" - expected format
    }));

    // -------------------------
    describe( 'iscHtmlToPlainText filter tests ', function(){

      it( 'should return the right string string', function(){
        var htmlStr = '<div class="foobar"><p>This is a <br><span><strong>test </strong></span>of <i>HTML</i></p></div>';
        var expected = filter( htmlStr );
        expect( expected ).toBe( 'This is a test of HTML' );
      });
    });


  });
})();

