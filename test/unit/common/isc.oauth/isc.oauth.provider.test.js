(function() {
  'use strict';

  var suite;

  var oauthConfig = {
    'clientId'        : "testClientId",
    'clientSecret'    : "testClientSecret",
    'redirectUrl'     : "testRedirectUrl",
    'scope'           : "user/*.read",
    'responseType'    : 'code',
    'responseMode'    : 'query',
    'oauthBaseUrl'    : "testOauthBaseUrl",
    'aud'             : "testAud",
    'state'           : "state123",
    'requestGrantType': 'authorization_code',
    'refreshGrantType': 'refresh_token'
  };

  var getUrlList =[
    "getAuthorizationUrl",
    "getRequestTokenUrl",
    "getRevocationUrl",
    "getUserInfoUrl",
    "getIntrospectionUrl"
  ];

  var mockMd5 = jasmine.createSpyObj("mockMd5",["createHash"]);
  mockMd5.createHash.and.returnValue("state123");

  describe( 'isc.oauth.provider', function() {

    // setup devlog
    beforeEach (module ('isc.core','isc.common', function (devlogProvider) {
      devlogProvider.loadConfig ({});
    }));

    beforeEach(module('isc.oauth', function($provide, iscOauthServiceProvider) {
      $provide.value("md5",mockMd5);
      iscOauthServiceProvider.configure( oauthConfig );
    }));

    beforeEach( inject( function( $httpBackend,
      $window,
      $rootScope,
      md5,
      iscSessionStorageHelper,
      iscOauthService) {

      suite =  {
        $window                : $window,
        $rootScope             : $rootScope,
        $httpBackend           : $httpBackend,
        md5                    : md5,
        iscSessionStorageHelper: iscSessionStorageHelper,
        iscOauthService        : iscOauthService
      } ;


      suite.iscOauthService.saveOauthConfig( oauthConfig );
    } ) );

    it('Should have defined methods', function() {

      _.every(getUrlList,function(method){
        expect(suite.iscOauthService[method]).toBeDefined();
      });
      expect(suite.iscOauthService.get).toBeDefined();
      expect(suite.iscOauthService.getOauthConfig).toBeDefined();
      expect(suite.iscOauthService.saveOauthConfig).toBeDefined();
      expect(suite.iscOauthService.clearOauthConfig).toBeDefined();
    });

    it("Should return the configured values for every property when called via get", function(){
      _.every(_.keys(oauthConfig), function(key){

        expect(suite.iscOauthService.get(key)).toBe(oauthConfig[key]);
      });
    });

    it("Should return the right url values for all get url methods", function(){
      var authUrl = oauthConfig.oauthBaseUrl + '/authorize' + '?' +
        'client_id=' + encodeURIComponent( oauthConfig.clientId ) + '&' +
        'redirect_uri=' + encodeURIComponent( oauthConfig.redirectUrl ) + '&' +
        'response_type=' + encodeURIComponent( oauthConfig.responseType ) + '&' +
        'response_mode=' + encodeURIComponent( oauthConfig.responseMode ) + '&' +
        'scope=' + encodeURIComponent( oauthConfig.scope ) + '&' +
        'aud=' + encodeURIComponent( oauthConfig.aud ) + '&' +
        'state=' + encodeURIComponent( oauthConfig.state );

      expect(suite.iscOauthService.getAuthorizationUrl()).toBe(authUrl);
      expect(suite.iscOauthService.getRevocationUrl()).toBe(oauthConfig.oauthBaseUrl + '/revocation');
      expect(suite.iscOauthService.getRequestTokenUrl()).toBe(oauthConfig.oauthBaseUrl + '/token');
      expect(suite.iscOauthService.getIntrospectionUrl()).toBe(oauthConfig.oauthBaseUrl + '/introspection');
      expect(suite.iscOauthService.getUserInfoUrl()).toBe(oauthConfig.oauthBaseUrl + '/userinfo');

    });

    it("Should return parsed and decoded oauth config from session storage on getOauthConfig", function(){
      spyOn(suite.iscSessionStorageHelper, "getValFromSessionStorage").and.callThrough();
      spyOn(window.JSON, "parse").and.callThrough();
      spyOn(window, "decodeURIComponent").and.callThrough();
      expect(suite.iscOauthService.getOauthConfig()).toEqual(oauthConfig);
      expect(suite.iscSessionStorageHelper.getValFromSessionStorage).toHaveBeenCalled();
      expect(window.JSON.parse).toHaveBeenCalled();
      expect(window.decodeURIComponent).toHaveBeenCalled();
    });

    it("Should save encoded oauth config string in session storage on saveOauthConfig", function(){
      spyOn(suite.iscSessionStorageHelper, "setSessionStorageValue").and.callThrough();
      spyOn(window.JSON, "stringify").and.callThrough();
      spyOn(window, "encodeURIComponent").and.callThrough();
      var storedConfig = suite.iscOauthService.getOauthConfig();
      var test = _.assignIn({}, storedConfig, { test : 123});
      suite.iscOauthService.saveOauthConfig({ test : 123});
      expect(window.JSON.stringify).toHaveBeenCalled();
      expect(window.encodeURIComponent).toHaveBeenCalled();
      expect(suite.iscSessionStorageHelper.setSessionStorageValue).toHaveBeenCalledWith('state123', encodeURIComponent( JSON.stringify(test)));

      expect(suite.iscOauthService.getOauthConfig()).toEqual(test);
    });

    it("Should remove oauth config string from session storage on clearOauthConfig", function(){
      spyOn(suite.iscSessionStorageHelper, "removeFromSessionStorage").and.callThrough();

      suite.iscOauthService.clearOauthConfig();
      expect(suite.iscSessionStorageHelper.removeFromSessionStorage).toHaveBeenCalledWith('state123');
      expect(suite.iscSessionStorageHelper.removeFromSessionStorage).toHaveBeenCalledWith('oauthState');

    });

  } );
})();
