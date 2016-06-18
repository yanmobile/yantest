/**
 * Created by Henry Zou on 06/17/2016.
 */

(function() {
  'use strict';

  describe( 'isc.states', function() {
    var suite;
    var expected;

    beforeEach( module( 'isc.core', function( devlogProvider, $provide ) {
      $provide.value( '$log', mock$log );
      devlogProvider.loadConfig( customConfig );
    } ) );

    beforeEach( module( 'isc.states', function( $stateProvider ) {
      expected = {
        url     : "home/:name",
        template: "<home></home>"
      };
      $stateProvider.state( "home", expected );
    } ) );

    beforeEach( inject( function( $rootScope, $state ) {
      suite            = {};
      suite.$rootScope = $rootScope;
      suite.$state     = $state;
    } ) );

    describe( 'setup test', function() {
      it( 'should have injected correctly', function() {
        expect( suite.$state ).toBeDefined();
        expect( suite.$rootScope ).toBeDefined();
      } );
    } );

    describe( 'decorated state params', function() {
      it( '$state.next', function() {
        var expectedParams          = { name: "JohnSmith" };
        var $stateChangeStartCalled = false;
        suite.$rootScope.$on( '$stateChangeStart', function( event, state, params ) {
          expect( suite.$state.next ).toEqual( expected );
          expect( suite.$state.toParams ).toEqual( expectedParams );
          $stateChangeStartCalled = true;
        } );
        suite.$state.go( 'home', expectedParams );
        expect( $stateChangeStartCalled ).toBe( true );
      } );
    } );
  } );
})();

