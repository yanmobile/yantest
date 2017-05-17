(function() {
  'use strict';

  describe( 'zip code filter', function() {
    var scope, filter;

    // setup devlog
    beforeEach( module( 'isc.core', function( devlogProvider ) {
      devlogProvider.loadConfig( customConfig );
    } ) );

    // show $log statements
    beforeEach( module( 'isc.filters', function( $provide ) {
      $provide.value( '$log', mock$log );
    } ) );

    beforeEach( inject( function( $rootScope, $injector ) {
      scope  = $rootScope.$new();
      filter = $injector.get( '$filter' )( 'iscZipCode' );
    } ) );

    // -------------------------
    describe( 'zip Dependency Injection', function() {
      it( "should inject filter correctly", function() {
        expect( filter ).toBeDefined();
      } );
    } );

    describe( 'zip filter test', function() {
      it( "should format the 9 digit zip-code with dash ", function() {
        var expected = '12345-6789';
        var actual   = filter( '123456789' );

        expect( expected ).toBe( actual );
      } );

      it( "should not change the input if its length is less than 9", function() {
        var expected = '12345';
        var actual   = filter( '12345' );

        expect( expected ).toBe( actual );
      } );

      it( "should not change the input if its length is greater than 9", function() {
        var expected = '1234567890';
        var actual   = filter( '1234567890' );

        expect( expected ).toBe( actual );
      } );
    } );

  } );
})();


