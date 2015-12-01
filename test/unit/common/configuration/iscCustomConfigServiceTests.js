
(function(){
  'use strict';
  //console.log( 'iscCustomConfigService Tests' );

  var mockConfig = angular.copy( customConfig );

  describe('iscCustomConfigService', function(){
    var scope,
      sessionModel,
      helper,
      service,
      httpBackend;

    var mockStates = [
      { state:'index.home', exclude: true },
      { state:'index.home.sub1', exclude: false },
      { state:'index.home.sub2', exclude: true },
      { state:'index.home.sub3', exclude: false },
      { state:'index.messages', exclude: true },
      { state:'index.messages.sub1', exclude: false },
      { state:'index.messages.sub2', exclude: true },
      { state:'index.messages.sub3', exclude: false },
      { state:'index.library', exclude: true },
      { state:'index.account', exclude: false }
    ];


    beforeEach( module('isc.common'));
    beforeEach( module('iscNavContainer'));

    // this loads all the external templates used in directives etc
    // eg, everything in **/*.html
    beforeEach( module('isc.templates') );

    // log statements
    beforeEach( module('isc.common', 'iscNavContainer'), function( $provide ){
      $provide.value('$log', console);
    });

    beforeEach( inject( function( $rootScope, $httpBackend, iscCustomConfigService, iscCustomConfigHelper, iscSessionModel ){
      scope = $rootScope.$new();
      sessionModel = iscSessionModel;
      helper = iscCustomConfigHelper;

      mockConfig = angular.copy( customConfig );
      service = iscCustomConfigService;
      service.setConfig( mockConfig );

      httpBackend = $httpBackend;

      // dont worry about calls to assets
      httpBackend.when( 'GET', 'assets/i18n/en-us.json' )
          .respond( 200, {} );

      // mock calls to the config
      httpBackend.when( 'GET', 'assets/configuration/configFile.json' )
          .respond( 200, customConfig );

      // dont worry about calls to home page mocks
      httpBackend.when( 'GET', 'assets/mockData/home/mockPatientData.json' )
          .respond( 200, {} );

      // dont worry about calls to home page mocks
      httpBackend.when( 'GET', 'assets/mockData/home/mockPanelData.json' )
          .respond( 200, {} );

    }));

    // -------------------------
    describe( 'getConfig/setConfig tests ', function(){

      it( 'should have a function getConfig', function(){
        expect( angular.isFunction( service.getConfig )).toBe( true );
      });

      it( 'should have a function setConfig', function(){
        expect( angular.isFunction( service.setConfig )).toBe( true );
      });

      it( 'should return the config when calling getConfig', function(){
        var result = service.getConfig();
        expect( result ).toBe( mockConfig );
      });
    });

    // -------------------------
    describe( 'loadConfig tests ', function(){

      it( 'should have a function loadConfig', function(){
        expect( angular.isFunction( service.loadConfig )).toBe( true );
      });

      it( 'should return the config when calling loadConfig, no config present', function(){
        service.setConfig( null );

        httpBackend.when('GET', 'assets/configuration/localConfig.json' )
          .respond( 500 );

        httpBackend.when('GET', 'assets/configuration/configFile.json' )
          .respond( 200, mockConfig );

        service.loadConfig();

        var result = service.getConfig();
        expect( result ).toEqual( null );

        httpBackend.flush();

        var result = service.getConfig();
        expect( result ).toEqual( mockConfig );
      });

      it( 'should return the config when calling loadConfig, no config present, overriding values is localConfig is present', function(){
        service.setConfig( null );

        httpBackend.when('GET', 'assets/configuration/localConfig.json' )
          .respond( 200, { "baseUrl": "newBaseUrl", "userRoles": [ "sorcerer", "warrior" ] } );

        httpBackend.when('GET', 'assets/configuration/configFile.json' )
          .respond( 200, mockConfig );

        service.loadConfig();

        httpBackend.flush();

        var result = service.getConfig();
        mockConfig.baseUrl = "newBaseUrl";
        mockConfig.userRoles = [ "sorcerer", "warrior" ];
        expect( result ).toEqual( mockConfig );
      });

      it( 'should return the config when calling loadConfig, with config present', function(){
        service.setConfig( mockConfig );

        // NOTE this will throw an error if it DOES get called, which it shouldn't
        // since there is a config in place
        httpBackend.when('GET', 'assets/configuration/configFile.json' )
          .respond( 'foobar' );

        service.loadConfig();

        var result = service.getConfig();
        expect( result ).toEqual( mockConfig );
      });

      it( 'should update the helper with all the states', function(){
        service.setConfig( null );

        httpBackend.when('GET', 'assets/configuration/configFile.json' )
          .respond( 200, mockConfig );

        httpBackend.when('GET', 'assets/configuration/localConfig.json' )
          .respond( 500 );

        // load the config
        service.loadConfig();
        httpBackend.flush();
        var config = service.getConfig();
        expect( config ).toEqual( mockConfig );

        // make an object with all the states in the config
        var allStates = angular.copy( config.topTabs );

        // add in the login button
        var login = angular.copy( {loginButton: config.loginButton} );
        _.forEach( login, function( stateObj ){
          allStates[stateObj.state] = stateObj;
        });

        // add in the secondary navs
        var secondaryNavs = _.filter( config, 'secondaryNav' );
        _.forEach( secondaryNavs, function( obj ){
          var sec = obj.secondaryNav;
          _.forEach( sec, function( stateObj ){
            allStates[stateObj.state] =  stateObj;
          });
        });

        // add in the tasks
        var tasks = _.filter( config, 'tasks' );
        _.forEach( tasks, function( obj ){
          var sec = obj.tasks;
          _.forEach( sec, function( stateObj ){
            allStates[stateObj.state] =  stateObj;
          });
        });

        var newAllStates  = helper.getAllStates();

        // make sure that every state has been added
        _.forEach( newAllStates, function( state ){

          var configObj = allStates[ state.state ];

          //console.log( '.......state', state );
          //console.log( '...configObj', configObj );

          var expected = angular.equals( configObj, state );
          expect( expected ).toBe( true );
        });
      });
    });

    // -------------------------
    describe( 'get specific config tests ', function(){

      it( 'should have a function getTopTabsConfig', function(){
        expect( angular.isFunction( service.getTopTabsConfig )).toBe( true );
      });

      it( 'should get the tab config when calling getTopTabsConfig', function(){
        var result = service.getTopTabsConfig();
        expect( result ).toBe( mockConfig.topTabs );
      });

      // --------------
      it( 'should have a function getHomePageConfig', function(){
        expect( angular.isFunction( service.getHomePageConfig )).toBe( true );
      });

      it( 'should get the home config when calling getHomePageConfig', function(){
        var result = service.getHomePageConfig();
        expect( result ).toBe( mockConfig.homePage );
      });

      // --------------
      it( 'should have a function getLogoutButtonConfig', function(){
        expect( angular.isFunction( service.getLogoutButtonConfig )).toBe( true );
      });

      it( 'should get a config when calling getLogoutButtonConfig', function(){
        var result = service.getLogoutButtonConfig();
        expect( result ).toBe( mockConfig.logoutButton );
      });

      // --------------
      it( 'should have a function getLoginButtonConfig', function(){
        expect( angular.isFunction( service.getLoginButtonConfig )).toBe( true );
      });

      it( 'should get a config when calling getLoginButtonConfig', function(){
        var result = service.getLoginButtonConfig();
        expect( result ).toBe( mockConfig.loginButton );
      });

    });

    // -------------------------
    describe( 'updateStateByRole tests ', function(){

      it( 'should have a function updateStateByRole', function(){
        expect( angular.isFunction( service.updateStateByRole )).toBe( true );
      });

      it( 'should updateStateByRole, bogus role', function(){
        mockConfig.noLoginRequired = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user:['*']
        };

        helper.resetStates();
        helper.addStates( angular.copy( mockStates ) );

        service.updateStateByRole( 'FOOBAR' );
        var allStates = helper.getAllStates();

        _.forEach( allStates, function( state ){
          if(_.contains( state.state, 'index.home' )){
            expect( state.exclude ).toBe( false ); // if its whitelisted, dont exclude
          }
          else{
            expect( state.exclude ).toBe( true );
          }

        });
      });

      it( 'should updateStateByRole, no role', function(){
        mockConfig.noLoginRequired = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user:['*']
        };

        helper.resetStates();
        helper.addStates( angular.copy( mockStates ) );

        service.updateStateByRole();
        var allStates = helper.getAllStates();

        _.forEach( allStates, function( state ){
          if(_.contains( state.state, 'index.home' )){
            expect( state.exclude ).toBe( false ); // if its whitelisted, dont exclude
          }
          else{
            expect( state.exclude ).toBe( true );
          }

        });
      });

      it( 'should updateStateByRole, all permitted by wildcard', function(){
        mockConfig.noLoginRequired = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user:['*']
        };

        helper.resetStates();
        helper.addStates( angular.copy( mockStates ) );

        service.updateStateByRole( 'user' );
        var allStates = helper.getAllStates();

        _.forEach( allStates, function( state ){
          expect( state.exclude ).toBe( false );
        });
      });

      it( 'should updateStateByRole, some permitted by wildcard, some not, some excluded', function(){
        mockConfig.noLoginRequired = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user:['index.library', 'index.messages', 'index.messages.sub1']
        };

        helper.resetStates();
        helper.addStates( angular.copy( mockStates ) );

        service.updateStateByRole( 'user' );
        var allStates = helper.getAllStates();

        var permittedStates = mockConfig.userPermittedTabs.user;

        _.forEach( allStates, function( state ){
          if(_.contains( permittedStates, state.state )){
            expect( state.exclude ).toBe( false ); // if its in the permitted states, dont exclude
          }
          else if(_.contains( state.state, 'index.home' )){
            expect( state.exclude ).toBe( false ); // or if its whitelisted, dont exclude
          }
          else{
            expect( state.exclude ).toBe( true ); // otherwise disappear it
          }
        });

        expect( allStates['index.messages.sub2'].exclude).toBe( true ); //just to be sure
      });

      it( 'should updateStateByRole, some permitted by wildcard, some excluded', function(){
        mockConfig.noLoginRequired = ['index.home.*'];
        mockConfig.userPermittedTabs = {
          user:['index.messages.*']
        };

        helper.resetStates();
        helper.addStates( angular.copy( mockStates ) );

        service.updateStateByRole( 'user' );
        var allStates = helper.getAllStates();

        _.forEach( allStates, function( state ){

          if(_.contains( state.state, 'index.home' )){
            expect( state.exclude ).toBe( false ); // its whitelisted, dont exclude
          }
          else if(_.contains( state.state, 'index.messages' )){
            expect( state.exclude ).toBe( false ); // or if its wild carded, dont exclude
          }
          else{
            expect( state.exclude ).toBe( true ); // otherwise disappear it
          }
        });

        expect( allStates['index.library'].exclude).toBe( true ); //just to be sure
      });

      it( 'should updateStateByRole, no wildcard, some excluded', function(){
        mockConfig.noLoginRequired = []; // log in for everything
        mockConfig.userPermittedTabs = {
          user:['index.library', 'index.account']
        };

        helper.resetStates();
        helper.addStates( angular.copy( mockStates ) );

        service.updateStateByRole( 'user' );
        var allStates = helper.getAllStates();

        _.forEach( allStates, function( state ){
          if( state.state === 'index.library' ){
            expect( state.exclude ).toBe( false ); // explicitly permitted
          }
          else if( state.state === 'index.account' ){
            expect( state.exclude ).toBe( false ); // explicitly permitted
          }
          else{
            expect( state.exclude ).toBe( true ); // otherwise disappear it
          }
        });
      });

      it( 'should updateStateByRole, no wildcard, some bogus states', function(){
        mockConfig.noLoginRequired = []; // log in for everything
        mockConfig.userPermittedTabs = {
          user:['index.library', 'index.account', 'foobar']
        };

        helper.resetStates();
        helper.addStates( angular.copy( mockStates ) );

        service.updateStateByRole( 'user' );
        var allStates = helper.getAllStates();

        expect( allStates['foobar'] ).not.toBeDefined(); // bogus state

        _.forEach( allStates, function( state ){
          if( state.state === 'index.library' ){
            expect( state.exclude ).toBe( false ); // explicitly permitted
          }
          else if( state.state === 'index.account' ){
            expect( state.exclude ).toBe( false ); // explicitly permitted
          }
          else{
            expect( state.exclude ).toBe( true ); // otherwise disappear it
          }
        });
      });
    });

  });

})();

