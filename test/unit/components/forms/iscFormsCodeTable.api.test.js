(function() {
  'use strict';

  describe( 'iscFormsCodeTableApi', function() {
    var suite;

    useDefaultFormsModules();

    mockDefaultFormStates();

    beforeEach( inject( function( iscFormsCodeTableApi,
      $httpBackend, $timeout ) {

      suite = window.createSuite( {
        api        : iscFormsCodeTableApi,
        httpBackend: $httpBackend,
        timeout    : $timeout
      } );

      mockFormResponses( suite.httpBackend );
    } ) );

    describe( 'iscFormsCodeTableApi', function() {
      it( 'should have revealed functions', function() {
        expect( _.isFunction( suite.api.getAsync ) ).toBe( true );
        expect( _.isFunction( suite.api.getSync ) ).toBe( true );
      } );
    } );

    describe( 'api.getSync', function() {
      it( 'should return undefined if the code table has not been cached', function() {
        // Then they are queried synchronously from the cache
        var sampleTable = suite.api.getSync( 'usStates' );
        expect( sampleTable ).toBeUndefined();
      } );
    } );

    describe( 'api.getAsync and api.getSync', function() {
      it( 'should get a single code table from the API', function() {
        suite.api.getAsync( 'usStates' ).then( function( response ) {
          expect( response.length ).toBe( 50 );

          var sampleTable = suite.api.getSync( 'usStates' );
          expect( sampleTable ).toBeDefined();
          expect( _.isArray( sampleTable ) ).toBe( true );
          expect( sampleTable.length ).toEqual( 50 ); // fifty nifty
        } );
        suite.httpBackend.flush();
      } );
    } );

  } );
})();
