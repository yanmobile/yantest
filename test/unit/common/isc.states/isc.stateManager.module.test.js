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
      it( '$state next and toParam', function() {
        expect( suite.$state.next ).toEqual( undefined );
        expect( suite.$state.toParams ).toEqual( undefined );

        var expectedParams = { name: "JohnSmith" };
        suite.$state.go( 'home', expectedParams );

        expect( suite.$state.next ).toEqual( expected );
        expect( suite.$state.toParams ).toEqual( expectedParams );
      } );
    } );
  } );
})();

