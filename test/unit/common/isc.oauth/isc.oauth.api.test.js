(function() {
  'use strict';

  var suite;


  // Factory/service
  describe( 'isc.oauth.api', function() {

    // setup devlog
    beforeEach (module ('isc.core','isc.common','isc.oauth', function (devlogProvider) {
      devlogProvider.loadConfig ({});
    }));

    // Inject factory API

    beforeEach( inject( function( $httpBackend,
      $window,
      $rootScope,
      iscHttpapi,
      $httpParamSerializerJQLike,
      iscOauthApi,
      iscOauthService) {

      suite =  {
        $window                   : $window,
        $rootScope                : $rootScope,
        $httpBackend              : $httpBackend,
        iscHttpapi                : iscHttpapi,
        serializer                : $httpParamSerializerJQLike,
        iscOauthApi               : iscOauthApi,
        iscOauthService           : iscOauthService
      } ;

      spyOn(suite.iscOauthService, 'get').and.callFake(function( query ) {
        return "test-"+query;
      })
    } ) );


      // -------------------------
      it( 'authorize should called to get auth url', function() {
        suite.$window.onbeforeunload = function( e ) {
          e.preventDefault();
          console.log("Verified redirect triggered and cancelled");
          expect(true).toBe(true);
        };
        spyOn(suite.iscOauthService,'getAuthorizationUrl').and.returnValue("test123");
        suite.iscOauthApi.authorize();
        expect(suite.iscOauthService.getAuthorizationUrl).toHaveBeenCalled();
      } );

      // -------------------------
      it( 'revoke should make a form post request with right data and call clearOauthConfig', function() {
        spyOn(suite.iscOauthService, 'getRevocationUrl').and.returnValue("test123");
        spyOn(suite.iscOauthService, 'clearOauthConfig').and.callFake(_.noop);

        suite.$httpBackend.expectPOST("test123",suite.serializer({
          "token"     : 'test-accessToken',
          "client_id" : "test-clientId" ,
          "token_type": "revoke"
        })).respond({});
        suite.iscOauthApi.revoke().then(function(  ) {
          expect(suite.iscOauthService.clearOauthConfig).toHaveBeenCalled();
        });
        suite.$httpBackend.flush();
      } );


      // -------------------------
      it( 'requestToken should make a form post request with right data and call saveOauthConfig', function() {
        spyOn(suite.iscOauthService, 'getRequestTokenUrl').and.returnValue("test123");
        spyOn(suite.iscOauthService, 'saveOauthConfig').and.callFake(_.noop);

        var tokenResponse = {
          "access_token": "tkn123"
        };
        var formattedToken = {
          "accessToken": "tkn123"
        };

        suite.$httpBackend.expectPOST("test123",suite.serializer({
          "grant_type"  : "authorization_code",
          "code"        : "auth-123",
          "redirect_uri": "test-redirectUrl"
        })).respond(tokenResponse);
        suite.iscOauthApi.requestToken("auth-123").then(function( ) {
          expect(suite.iscOauthService.saveOauthConfig).toHaveBeenCalledWith(formattedToken);
        });
        suite.$httpBackend.flush();
      } );

      it( 'refreshToken should make a form post request with right data and call saveOauthConfig', function() {
        spyOn(suite.iscOauthService, 'getRequestTokenUrl').and.returnValue("test123");
        spyOn(suite.iscOauthService, 'saveOauthConfig').and.callFake(_.noop);

        var tokenResponse = {
          "access_token" : "tkn123",
          "refresh_token":"123"
        };
        var formattedToken = {
          "accessToken" : "tkn123",
          "refreshToken": "123"
        };

        suite.$httpBackend.expectPOST("test123",suite.serializer({
          "grant_type"   : "refresh_token",
          "refresh_token": "test-refreshToken"
        })).respond(tokenResponse);
        suite.iscOauthApi.refreshToken().then(function(  ) {
          expect(suite.iscOauthService.saveOauthConfig).toHaveBeenCalledWith(formattedToken);
        });
        suite.$httpBackend.flush();
      } );


      it( 'introspect should make a form post request with right data', function() {
        spyOn(suite.iscOauthService, 'getIntrospectionUrl').and.returnValue("test123");

        suite.$httpBackend.expectPOST("test123",suite.serializer({
          "token": encodeURIComponent(  "test-accessToken"  )
        })).respond({});
        suite.iscOauthApi.introspect().then(function( response ) {
          expect(response).toEqual({});
        });
        suite.$httpBackend.flush();
      } );


      it( 'getUserInfo should make a form post request with right data', function() {
        spyOn(suite.iscOauthService, 'getUserInfoUrl').and.returnValue("test123");

        suite.$httpBackend.expectPOST("test123",suite.serializer({
          "access_token": encodeURIComponent(  "test-accessToken"  )
        })).respond({});
        suite.iscOauthApi.getUserInfo().then(function( response ) {
          expect(response).toEqual({});
        });
        suite.$httpBackend.flush();
      } );



  } );
})
();
