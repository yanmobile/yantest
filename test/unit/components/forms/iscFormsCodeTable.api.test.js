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
        expect( _.isFunction( suite.api.loadAll ) ).toBe( true );
        expect( _.isFunction( suite.api.get ) ).toBe( true );
      } );
    } );

    describe( 'api.loadAll', function() {
      it( 'should get the code tables from the API', function() {
        suite.api.loadAll().then( function( response ) {
          expect( response.usStates.length ).toBe( 50 );
        } );
        suite.httpBackend.flush();
      } );
    } );

    describe( 'api.get', function() {
      it( 'should return a code table synchronously', function() {
        // First code tables must be loaded from the server
        suite.api.loadAll();
        suite.httpBackend.flush();

        // Then they are queried synchronously from the cache
        var sampleTable = suite.api.get( 'usStates' );
        expect( sampleTable ).toBeDefined();
        expect( _.isArray( sampleTable ) ).toBe( true );
        expect( sampleTable.length ).toEqual( 50 ); // fifty nifty
      } );
    } );

  } );
})();
