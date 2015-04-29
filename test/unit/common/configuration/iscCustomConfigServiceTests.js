
(function(){
  'use strict';

  var mockConfig = angular.copy( customConfig );

  describe('iscCustomConfigService', function(){
    var scope,
      sessionModel,
      helper,
      service,
      httpBackend;

    beforeEach( module('iscHsCommunityAngular'));
    beforeEach( module('isc.common'));
    beforeEach( module('iscNavContainer'));

    // this loads all the external templates used in directives etc
    // eg, everything in **/partials/*.html
    beforeEach( module('isc.templates') );

    beforeEach( module('isc.common', 'iscNavContainer', 'iscHsCommunityAngular'), function( $provide ){
      $provide.value('$log', console);
    });

    beforeEach( inject( function( $rootScope, $httpBackend, iscCustomConfigService, iscCustomConfigHelper, iscSessionModel ){
      scope = $rootScope.$new();
      sessionModel = iscSessionModel;
      helper = iscCustomConfigHelper;
      service = iscCustomConfigService;
      service.setConfig( mockConfig );
      httpBackend = $httpBackend;

      // dont worry about calls to assets
      httpBackend.when( 'GET', 'assets/i18n/en_US.json' )
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

      xit( 'should return the config when calling loadConfig, no config present', function(){
        service.setConfig( null );

        httpBackend.when('GET', '/assets/configuration/configFile.json' )
          .respond( 200, mockConfig );

        service.loadConfig();

        var result = service.getConfig();
        expect( result ).toEqual( null );

        httpBackend.flush();

        var result = service.getConfig();
        expect( result ).toEqual( mockConfig );
      });

      it( 'should return the config when calling loadConfig, with config present', function(){
        service.setConfig( mockConfig );

        // NOTE this will throw an error if it DOES get called, which it shouldn't
        // since there is a config in place
        httpBackend.when('GET', '/assets/configuration/configFile.json' )
          .respond( 'foobar' );

        service.loadConfig();

        var result = service.getConfig();
        expect( result ).toEqual( mockConfig );
      });

      it( 'should update the helper with all the states', function(){
        service.setConfig( null );

        httpBackend.when('GET', '/assets/configuration/configFile.json' )
          .respond( 200, mockConfig );

        // load the config
        service.loadConfig();
        httpBackend.flush();
        var config = service.getConfig();
        expect( config ).toEqual( mockConfig );

        // make an object with all the states in the config
        var allStates = angular.copy( config.topTabs );

        // add in the login button
        var login = angular.copy( config.loginButton );
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

        var helperStates  = helper.getAllStates();

        // make sure that every state has been added
        _.forEach( helperStates, function( helperObj ){
          var configObj = allStates[ helperObj.state ];
          var expected = angular.equals( configObj, helperObj );
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

      // --------------
      it( 'should have a function getLibrarySecondaryNav', function(){
        expect( angular.isFunction( service.getLibrarySecondaryNav )).toBe( true );
      });

      it( 'should get a config when calling getLibrarySecondaryNav', function(){
        var result = service.getLibrarySecondaryNav();
        expect( result ).toBe( mockConfig.library.secondaryNav );
      });

      // --------------
      it( 'should have a function getMessagesSecondaryNav', function(){
        expect( angular.isFunction( service.getMessagesSecondaryNav )).toBe( true );
      });

      it( 'should get the home config when calling getMessagesSecondaryNav', function(){
        var result = service.getMessagesSecondaryNav();
        expect( result ).toBe( mockConfig.messages.secondaryNav );
      });

      // --------------
      it( 'should have a function getMyAccountSecondaryNav', function(){
        expect( angular.isFunction( service.getMyAccountSecondaryNav )).toBe( true );
      });

      it( 'should get a config when calling getMyAccountSecondaryNav', function(){
        var result = service.getMyAccountSecondaryNav();
        expect( result ).toBe( mockConfig.myAccount.secondaryNav );
      });

      // --------------
      it( 'should have a function getCustomerTabSecondaryNav', function(){
        expect( angular.isFunction( service.getCustomerTabSecondaryNav )).toBe( true );
      });

      it( 'should get a config when calling getCustomerTabSecondaryNav', function(){
        var result = service.getCustomerTabSecondaryNav();
        expect( result ).toBe( mockConfig.customerTab.secondaryNav );
      });
    });

  });

})();

