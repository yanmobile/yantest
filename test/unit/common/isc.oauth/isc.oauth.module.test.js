(function() {
  'use strict';

  var suite         = {};
  var mockAppConfig = {
    'oauth': {
      'iss'         : 'testFhirServerUrl',
      'clientId'    : "testClientId",
      'clientSecret': "testClientSecret",
      'redirectUrl' : "testRedirectUrl",
      'oauthBaseUrl': "testBaseUrl",
      'aud'         : "testAudUrl"
    }
  };

  var sampleConformanceJson = {
    "rest" : [{
      "security": {
        "extension": [
          {
            "extension": [
              {
                "valueUri": "testOuathServerUrl/authorize",
                "url": "authorize"
              }
            ],
            "url": "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris"
          }
        ]
      }
    }]
  };
  var mockFhirService   = jasmine.createSpyObj( "mockFhirService", ["initialize"] );
  var mockFoundationApi = jasmine.createSpyObj( "mockFoundationApi", ["publish"] );

  var mockMd5 = jasmine.createSpyObj("mockMd5",["createHash"]);
  mockMd5.createHash.and.returnValue("state123");


  describe( 'isc.oauth.module', function() {

    // setup devlog
    beforeEach( module( 'isc.core', 'isc.common', function( devlogProvider, $provide, $urlRouterProvider ) {
      $urlRouterProvider.deferIntercept();
      devlogProvider.loadConfig( customConfig );
      $provide.value( 'appConfig', angular.copy( mockAppConfig ) );
      $provide.value( 'md5', mockMd5 );
    } ) );


    beforeEach( function() {

      // create a mock module with the providers
      angular
        .module( 'iscOauthConfig', ['ui.router', 'isc.oauth'] )
        .config( function( $stateProvider ) {
          suite.stateProvider = $stateProvider;
          suite.stateProvider.state( 'unauthenticated', {
              abstract   : true,
              url        : '/',
              state      : 'unauthenticated'
            });
        } ).run( function( $state ) {
          suite.state = $state;
      } );

      module( 'iscOauthConfig' );

      inject( function( $q,
        $httpBackend,
        $stateParams,
        $rootScope,
        appConfig,
        iscSessionStorageHelper,
        iscHttpapi,
        iscOauthApi,
        iscOauthService ) {


        suite.$q                      = $q;
        suite.$httpBackend            = $httpBackend;
        suite.$stateParams            = $stateParams;
        suite.rootScope               = $rootScope;
        suite.appConfig               = appConfig;
        suite.iscHttpapi              = iscHttpapi;
        suite.iscSessionStorageHelper = iscSessionStorageHelper;
        suite.iscOauthApi             = iscOauthApi;
        suite.iscOauthService         = iscOauthService;


      } );

    } );



    it( 'should have registered unauthenticated.launch in $stateProvider', function() {

      var myState = suite.state.get( 'unauthenticated.launch' );
      suite.rootScope.$digest();

      expect( myState.url ).toBe( 'launch?code&state&iss&launch' );
      expect( myState.template ).toBe( '' );
      expect( myState.landingPageFor ).toEqual( [ '*' ] );
      expect( myState.roles ).toEqual( [ '*' ] );
      expect( myState.excludeAuthUser ).toBe( true );
      expect( myState.controller ).toBe( "iscOauthController as oauthCtrl" );

      expect( angular.isFunction( myState.resolve.baseUri ) ).toBe( true );
      expect( angular.isFunction( myState.resolve.token ) ).toBe( true );
      expect( angular.isFunction( myState.resolve.user ) ).toBe( true );


    } );

    it( 'should resolve for baseUri from appConfig if oauthBaseUrl is available in appConfig', function() {
      spyOn(suite.iscOauthService, 'saveOauthConfig').and.callFake(_.noop);

      var myState = suite.state.get( 'unauthenticated.launch' );
      var baseUri = myState.resolve.baseUri( suite.$stateParams, suite.appConfig, suite.iscOauthService, suite.iscHttpapi, suite.iscSessionStorageHelper );

      expect(suite.iscOauthService.saveOauthConfig).toHaveBeenCalledWith(suite.appConfig.oauth);
      expect(baseUri).toBe( suite.appConfig.oauth.oauthBaseUrl );

    } );

    it( 'should resolve for baseUri from fhir metadata if fhirServerUrl is available & oauthBaseUrl isnot available in appConfig', function() {
      spyOn(suite.iscOauthService, 'saveOauthConfig').and.callFake(_.noop);
      spyOn(suite.iscSessionStorageHelper, 'setSessionStorageValue').and.callFake(_.noop);

      suite.$httpBackend.expectGET('testFhirServerUrl/metadata').respond(sampleConformanceJson);
      suite.appConfig.oauth.oauthBaseUrl = '';

      var myState = suite.state.get( 'unauthenticated.launch' );
      myState.resolve.baseUri( suite.$stateParams, suite.appConfig, suite.iscOauthService, suite.iscHttpapi, suite.iscSessionStorageHelper )
        .then(function( baseUri ) {
          var config = _.assignIn({}, suite.appConfig.oauth, suite.$stateParams, { "oauthBaseUrl": baseUri } );
          expect(suite.iscOauthService.saveOauthConfig).toHaveBeenCalledWith(config);
          expect(suite.iscSessionStorageHelper.setSessionStorageValue).toHaveBeenCalledWith("fhirMetaData", sampleConformanceJson);
          expect(baseUri).toBe( "testOuathServerUrl" );
      });
      suite.$httpBackend.flush();

    } );

    it( 'should resolve for baseUri from fhir metadata if fhir server url is available in $stateParams', function() {
      spyOn(suite.iscOauthService, 'saveOauthConfig').and.callFake(_.noop);
      spyOn(suite.iscSessionStorageHelper, 'setSessionStorageValue').and.callFake(_.noop);

      suite.$stateParams.iss = 'testFhirServerUrl';

      suite.appConfig.oauth.oauthBaseUrl = '';

      suite.$httpBackend.expectGET('testFhirServerUrl/metadata').respond(sampleConformanceJson);

      var myState = suite.state.get( 'unauthenticated.launch' );

      myState.resolve.baseUri( suite.$stateParams, suite.appConfig, suite.iscOauthService, suite.iscHttpapi, suite.iscSessionStorageHelper )
        .then(function( baseUri ) {
          var params = _.pickBy( suite.$stateParams, _.identity);
          var config = _.assignIn({}, suite.appConfig.oauth, params, { "oauthBaseUrl": baseUri } );
          expect(suite.iscOauthService.saveOauthConfig).toHaveBeenCalledWith(config);
          expect(suite.iscSessionStorageHelper.setSessionStorageValue).toHaveBeenCalledWith("fhirMetaData", sampleConformanceJson);
          expect(baseUri).toBe( "testOuathServerUrl" );
        });
      suite.$httpBackend.flush();

    } );


    it( 'should resolve for token if authorization code is available in $stateParams', function() {
      var token = { "token" : 123 };
      spyOn(suite.iscOauthApi, 'requestToken').and.returnValue(suite.$q.when(token));
      spyOn(suite.iscSessionStorageHelper, 'getValFromSessionStorage').and.returnValue("state123");

      suite.$stateParams.code = 'authCode123';
      suite.$stateParams.state = 'state123';

      var myState = suite.state.get( 'unauthenticated.launch' );
      myState.resolve.token( suite.$stateParams, suite.iscOauthApi, suite.iscSessionStorageHelper ).then( function( tokenResponse ) {
        expect(suite.iscSessionStorageHelper.getValFromSessionStorage).toHaveBeenCalledWith("oauthState" );
        expect(suite.iscOauthApi.requestToken).toHaveBeenCalledWith( "authCode123" );
        expect(tokenResponse).toEqual( token );
      } );
      suite.rootScope.$apply();
    } );

    it( 'should resolve empty object for token if authorization code is not available in $stateParams', function() {
      var token = {"token": 123};
      spyOn(suite.iscOauthApi, 'requestToken').and.returnValue(suite.$q.when(token));
      spyOn(suite.iscSessionStorageHelper, 'getValFromSessionStorage').and.returnValue("state123");

      var myState = suite.state.get( 'unauthenticated.launch' );
      var tokenResponse = myState.resolve.token( suite.$stateParams, suite.iscOauthApi, suite.iscSessionStorageHelper );

      expect(suite.iscSessionStorageHelper.getValFromSessionStorage).toHaveBeenCalledWith('oauthState');
      expect(suite.iscOauthApi.requestToken).not.toHaveBeenCalledWith( );
      expect(tokenResponse).toEqual( {} );
    } );


    it( 'should resolve for user if token is available', function() {
      var user = {"user": 123};
      var token = {"token": 123};
      spyOn(suite.iscOauthApi, 'getUserInfo').and.returnValue(suite.$q.when(user));

      var myState = suite.state.get( 'unauthenticated.launch' );
      myState.resolve.user( token, suite.iscOauthApi ).then( function( userResponse ) {
        expect(suite.iscOauthApi.getUserInfo).toHaveBeenCalled( );
        expect(userResponse).toEqual( user );
      } );
      suite.rootScope.$apply();
    } );

    it( 'should resolve empty object for user if token is not available', function() {
      var token = {};
      spyOn(suite.iscOauthApi, 'getUserInfo').and.returnValue(suite.$q.when({}));
      spyOn(suite.iscSessionStorageHelper, 'getValFromSessionStorage').and.returnValue("state123");

      var myState = suite.state.get( 'unauthenticated.launch' );
      var userResponse = myState.resolve.user( token, suite.iscOauthApi );

      expect(suite.iscOauthApi.getUserInfo).not.toHaveBeenCalledWith( );
      expect(userResponse).toEqual( {} );
    } );


  } );
})
();
