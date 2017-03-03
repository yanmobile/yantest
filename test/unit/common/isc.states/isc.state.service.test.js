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

    describe( 're-writing url', function() {

      it( 'should have a rule()', function() {
        expect( _.isFunction( suite.iscStateProvider.rewriteUrl ) ).toBe( true );
      } );

      it( 'should invoke rule when navigating to state', function() {
        inject( function( $state, $rootScope ) {
          var pattern   = /\/unauthenticated\/home\/(.+)/ig;
          suite.rewrite = _.noop;

          spyOn( suite, 'rewrite' );

          suite.iscStateProvider.rewriteUrl( pattern, suite.rewrite );

          $state.go( "unauthenticated.home.livingroom" );
          $rootScope.$apply();
          expect( suite.rewrite ).toHaveBeenCalledWith( '/unauthenticated/home/livingRoom', 'livingRoom', 0, '/unauthenticated/home/livingRoom' );
        } );

      } );

    } );

  } );

  function getStates() {
    return {
      'unauthenticated'                : {
        url     : 'unauthenticated',
        template: "<ui-view></ui-view>",
        roles   : ["*"],
        state   : 'unauthenticated',
        data    : {
          layout: "layout/tpls/default.html",
        }
      },
      'unauthenticated.home'           : {
        url           : '/home',
        template      : "<ui-view></ui-view>",
        translationKey: 'Home',
        state         : 'unauthenticated.home',
        roles         : ["*"],
        landingPageFor: ["*"],
        displayOrder  : 1
      },
      'unauthenticated.home.livingroom': {
        url           : '/livingRoom',
        template      : "<living-room></living-room>",
        state         : 'unauthenticated.home.livingroom',
        translationKey: 'Living Room',
        roles         : ["*"]
      }
    };
  }
})();

