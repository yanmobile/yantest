(function() {
  'use strict';
  //console.log( 'iscCustomConfigService Tests' );
  var permittedStates;

  describe( 'iscCustomConfigService', function() {
    var customConfigService,
        provider;

    // setup devlog
    beforeEach( module( 'isc.core', function( devlogProvider, $provide ) {
      $provide.value( '$log', mock$log );
      devlogProvider.loadConfig( customConfig );
    } ) );

    // log statements
    beforeEach( module( 'isc.configuration', function( iscCustomConfigServiceProvider ) {
      provider = iscCustomConfigServiceProvider;
      iscCustomConfigServiceProvider.loadConfig( customConfig );
    } ) );

    beforeEach( inject( function( $rootScope, $httpBackend, iscCustomConfigService ) {
      customConfigService = iscCustomConfigService;
    } ) );

    describe( 'getConfig', function() {
      it( 'should have a getConfig method', function() {
        expect( _.isFunction( customConfigService.getConfig ) ).toBe( true );
      } );

      it( 'should return entire config', function() {
        var config = customConfigService.getConfig();
        expect( _.isObject( config.rolePermissions ) ).toBe( true );
        expect( _.isObject( config.topTabs ) ).toBe( true );
        expect( _.isObject( config.landingPages ) ).toBe( true );
      } );
    } );

    describe( 'getConfigSection', function() {
      it( 'should return entire section', function() {
        var permissions = customConfigService.getConfigSection( 'rolePermissions' );
        expect( permissions ).toEqual( customConfig.rolePermissions );
      } );

      it( 'should return rolePermissions for anonymous', function() {
        var permissions = customConfigService.getConfigSection( 'rolePermissions', '*' );
        expect( permissions ).toEqual( customConfig.rolePermissions['*'] );
      } );

    } );

    describe( 'getTopTabs', function() {
      it( 'should return topTabs for anonymous', function() {
        var topTabs = customConfigService.getConfigSection( 'topTabs', '*' );
        expect( topTabs ).toEqual( ['index.login'] );
      } );

      it( 'should return anonymous user tabs when getting non-anonymous user tabs', function() {
        var topTabs = customConfigService.getConfigSection( 'topTabs', 'user' );
        expect( _.includes( topTabs, 'index.login' ) ).toBe( true );
      } );
    } );

    describe( 'iscCustomConfigServiceProvider addRolePermissions', function() {

      it( 'should addRolePermissions to be called first', function() {
        provider.addRolePermissions( { 'myRoute.*': ['*'] } );
        provider.loadConfig( customConfig );

        permittedStates = customConfigService.getConfigSection( 'rolePermissions', '*' );
        expect( permittedStates ).toBeDefined();
        expect( _.includes( permittedStates, 'myRoute.*' ) ).toBe( true );
      } );

      it( 'should loadConfig to be called first', function() {
        provider.loadConfig( customConfig );
        provider.addRolePermissions( { 'myRoute.*': ['*'] } );

        permittedStates = customConfigService.getConfigSection( 'rolePermissions', '*' );
        expect( permittedStates ).toBeDefined();
        expect( _.includes( permittedStates, 'myRoute.*' ) ).toBe( true );
      } );

      it( 'should allow adding a single route', function() {
        provider.addRolePermissions( { 'myRoute.*': ['*'] } );

        permittedStates = customConfigService.getConfigSection( 'rolePermissions', '*' );
        expect( permittedStates ).toBeDefined();
        expect( _.includes( permittedStates, 'myRoute.*' ) ).toBe( true );
      } );

      it( 'should allow padding in an array of routes', function() {
        provider.addRolePermissions( [{ 'myRoute.*': ['*'] }, { 'yourRoute.*': ['*'] }] );

        permittedStates = customConfigService.getConfigSection( 'rolePermissions', '*' );
        expect( permittedStates ).toBeDefined();
        expect( _.includes( permittedStates, 'myRoute.*' ) ).toBe( true );
        expect( _.includes( permittedStates, 'yourRoute.*' ) ).toBe( true );
      } );

      it( 'should be able to add multiple roles', function() {
        provider.addRolePermissions( {
          'myRoute.*': ['user', '%HSCC_CMC_CarePlanCreator']
        } );
        permittedStates = customConfigService.getConfigSection( 'rolePermissions' );

        var statesEvaluated = 0;
        ['user',
          '%HSCC_CMC_CarePlanCreator'
        ].forEach( function( role ) {
          expect( _.includes( permittedStates[role], 'myRoute.*' ) ).toBe( true );
          statesEvaluated++;
        } );
        expect( statesEvaluated ).toBe( 2 );
      } );
    } );

  } );
})();

