/**
 * Created by hzou on 6/17/16.
 */

(function() {
  'use strict';

  describe( 'decorator stateChangeRejected', function() {
    var suite;

    // setup devlog
    beforeEach( module( 'isc.core', 'isc.states', function( devlogProvider, $provide, $stateProvider ) {
      $provide.value( '$log', mock$log );
      devlogProvider.loadConfig( customConfig );
      $stateProvider.state( "home", {
        url     : "home/:name",
        template: "<home></home>"
      } );
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

    describe( '$stateChangeRejected', function() {
      it( 'should trigger event when $$stateChangeStart is prevented', function() {
        var $stateChangeStartCalled = false;
        suite.$rootScope.$on( "$stateChangeRejected", function( error ) {
          $stateChangeStartCalled = true;
        } );

        suite.$rootScope.$on( '$stateChangeStart', function( event, state, params ) {
          event.preventDefault( { error: "not authorized" } );
        } );

        suite.$state.go( 'home' );
        suite.$rootScope.$apply();
        expect( $stateChangeStartCalled ).toBe( true );
      } );
    } );

  } );

})();