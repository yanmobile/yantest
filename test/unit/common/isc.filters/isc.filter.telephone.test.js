(function() {
  'use strict';

  describe( 'iscTelephone filter', function() {
    var suite;

    window.useDefaultModules( 'isc.filters' );

    beforeEach( inject( function( $rootScope, $injector, $filter ) {
      suite = window.createSuite( {
        $filter: $filter
      } );
    } ) );

    // -------------------------
    describe( 'iscTelephone', function() {
      it( 'should format a 7-digit US phone number', function() {
        var formattedOutput = '123-4567';

        expect( filter( '1234567' ) ).toEqual( formattedOutput );
        expect( filter( '123-4567' ) ).toEqual( formattedOutput );
        expect( filter( '1234-567' ) ).toEqual( formattedOutput );
        expect( filter( '1234567' ) ).toEqual( formattedOutput );
        expect( filter( 1234567 ) ).toEqual( formattedOutput );
      } );

      it( 'should format a 10-digit US phone number', function() {
        var formattedOutput = '(123)456-7890';

        expect( filter( '1234567890' ) ).toEqual( formattedOutput );
        expect( filter( '(123)4567890' ) ).toEqual( formattedOutput );
        expect( filter( '(123)456-7890' ) ).toEqual( formattedOutput );
        expect( filter( '(123)4567-890' ) ).toEqual( formattedOutput );
        expect( filter( '123-456-7890' ) ).toEqual( formattedOutput );
        expect( filter( 1234567890 ) ).toEqual( formattedOutput );
      } );

      it( 'should format a 10-digit US phone number with a 1 prefix', function() {
        var formattedOutput = '(800)123-4567';

        expect( filter( '18001234567' ) ).toEqual( formattedOutput );
        expect( filter( '1-800-1234567' ) ).toEqual( formattedOutput );
        expect( filter( '1-(800)-1234567' ) ).toEqual( formattedOutput );
        expect( filter( 18001234567 ) ).toEqual( formattedOutput );
      } );

      it( 'should not change other input', function() {
        expect( filter( '123456' ) ).toEqual( '123456' );
        expect( filter( '12345678' ) ).toEqual( '12345678' );
        expect( filter( 'abcdefg' ) ).toEqual( 'abcdefg' );
        expect( filter( '123456' ) ).toEqual( '123456' );
        expect( filter( '1-800-ISC-HELP' ) ).toEqual( '1-800-ISC-HELP' );
        expect( filter( {} ) ).toEqual( {} );
        expect( filter( [1234567] ) ).toEqual( [1234567] );
        expect( filter( '' ) ).toEqual( '' );
        expect( filter( undefined ) ).toEqual( undefined );
        expect( filter( null ) ).toEqual( null );
      } );


      function filter( input ) {
        return suite.$filter( 'iscTelephone' )( input );
      }
    } );

  } );
})();


