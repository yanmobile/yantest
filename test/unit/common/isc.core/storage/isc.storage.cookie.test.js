(function() {
  'use strict';

  describe( 'iscCookieManager', function() {
    var service;

    // show $log statements
    useDefaultModules('isc.core');

    beforeEach( inject( function( iscCookieManager ) {
      service = iscCookieManager;
    } ) );

    beforeEach( function() {
      var cookies, cookie, eqPos, name;
      //delete all cookies after every test
      cookies = document.cookie.split( ";" );

      cookies.forEach( function( cookie ) {
        eqPos           = cookie.indexOf( "=" );
        name            = eqPos > -1 ? cookie.substr( 0, eqPos ) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } );

    } );

    // -------------------------
    describe(
      'setup tests ',
      function() {

        it( 'should have valid methods defined', function() {
          expect( angular.isDefined( service.get ) ).toBeDefined();
          expect( angular.isDefined( service.set ) ).toBeDefined();
          expect( angular.isDefined( service.remove ) ).toBeDefined();

        } );

      } );

    describe(
      'set tests ',
      function() {

        it( 'should set the value in the cookie', function() {
          service.set( "testKey", "testValue" );
          expect( document.cookie ).toEqual( 'testKey="testValue"' );
        } );

      } );

    describe(
      'get tests ',
      function() {

        it( 'should get return the correct value from the cookie', function() {
          service.set( "testKey1", "testValue1" );
          service.set( "testKey2", 9 );
          var testObj = {
            a : 1
          };
          service.set( "testKey3", testObj );
          expect( service.get( "testKey1" ) ).toBe( "testValue1" );
          expect( service.get( "testKey2" ) ).toBe( 9 );
          expect( service.get( "testKey3" ) ).toEqual( testObj );

        } );

      } );

    describe(
      'remove tests ',
      function() {

        it( 'should remove the value from the cookie', function() {
          service.set( "testKey1", "testValue1" );
          service.set( "testKey2", "testValue2" );
          service.remove( "testKey2" );
          expect( service.get( "testKey1" ) ).toBe( "testValue1" );
          expect( service.get( "testKey2" ) ).not.toBeDefined( );

        } );

      } );

  } );

})();

