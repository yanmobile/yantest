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

      for ( var i = 0; i < cookies.length; i++ ) {
        cookie          = cookies[i];
        eqPos           = cookie.indexOf( "=" );
        name            = eqPos > -1 ? cookie.substr( 0, eqPos ) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    } );

    // -------------------------
    describe(
      'setup tests ',
      function() {

        it( 'should have valid methods defined', function() {
          expect( angular.isDefined( service.getItem ) ).toBeDefined();
          expect( angular.isDefined( service.setItem ) ).toBeDefined();
          expect( angular.isDefined( service.removeItem ) ).toBeDefined();

        } );

      } );

    describe(
      'setItem tests ',
      function() {

        it( 'should set the value in the cookie', function() {
          service.setItem( "testKey", "testValue" );
          expect( document.cookie ).toBe( "testKey=testValue" );
        } );

      } );

    describe(
      'getItem tests ',
      function() {

        it( 'should get return the correct value from the cookie', function() {
          service.setItem( "testKey1", "testValue1" );
          service.setItem( "testKey2", "testValue2" );
          expect( service.getItem( "testKey1" ) ).toBe( "testValue1" );
          expect( service.getItem( "testKey2" ) ).toBe( "testValue2" );

        } );

      } );

    describe(
      'removeItem tests ',
      function() {

        it( 'should remove the value from the cookie', function() {
          service.setItem( "testKey1", "testValue1" );
          service.setItem( "testKey2", "testValue2" );
          service.removeItem( "testKey2" );
          expect( service.getItem( "testKey1" ) ).toBe( "testValue1" );
          expect( service.getItem( "testKey2" ) ).toBe( null );

        } );

      } );

  } );

})();

