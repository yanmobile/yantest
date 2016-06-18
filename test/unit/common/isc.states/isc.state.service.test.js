/**
 * Created by Henry Zou on 06/17/2016.
 */

(function() {
  'use strict';

  describe( 'isc.state.service', function() {
    var suite;

    // setup devlog
    beforeEach( module( 'isc.core', function( devlogProvider, $provide ) {
      $provide.value( '$log', mock$log );
      devlogProvider.loadConfig( customConfig );
    } ) );

    // log statements
    beforeEach( module( 'isc.configuration', 'isc.states', function( iscCustomConfigServiceProvider, iscStateProvider ) {
      suite = {
        iscCustomConfigServiceProvider: iscCustomConfigServiceProvider,
        iscStateProvider              : iscStateProvider,
        stateData                     : getStates()
      };
      iscCustomConfigServiceProvider.loadConfig( customConfig );
      suite.iscStateProvider.state( suite.stateData );
    } ) );

    describe( 'iscStateProvider.state()', function() {
      it( 'should add tab, permission, and landing config', function() {
        inject( function( $rootScope, $httpBackend, iscCustomConfigService ) {
          suite.iscCustomConfigService = iscCustomConfigService;
          var landingPage              = iscCustomConfigService.getConfigSection( "landingPages", "*" );
          expect( landingPage ).toEqual( "unauthenticated.home" );

          var permission = iscCustomConfigService.getConfigSection( "rolePermissions", "*" );
          expect( _.includes( permission, "unauthenticated.home" ) ).toBe( true );

        } );
      } );
    } );
  } );

  function getStates() {
    return {
      'unauthenticated.home': {
        url           : 'home',
        templateUrl   : 'home/home.html',
        controller    : 'homeController as homeCtrl',
        state         : 'unauthenticated.home',
        translationKey: 'Home',
        roles         : ["*"],
        layout        : "layout/tpls/default.html",
        landingPageFor: ["*"],
        displayOrder  : 1
      }
    };
  }
})();

