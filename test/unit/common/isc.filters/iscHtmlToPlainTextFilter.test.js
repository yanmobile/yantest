
(function(){
  'use strict';
  //console.log( 'iscHtmlToPlainText Tests' );

  describe('iscHtmlToPlainText', function(){
    var scope,
        filter;

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));


    beforeEach( module('isc.filters'), function( $provide ){
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

