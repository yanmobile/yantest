
( function() {
  "use strict";

  angular.module( "isc.oauth" ).factory( "iscOauthApi", iscOauthApi );

  /* @ngInject */
  function iscOauthApi( $window, $http, $httpParamSerializerJQLike, iscHttpapi, iscOauthService ) {

    var api = {
      authorize      : authorize,
      revoke         : revoke,
      introspect     : introspect,
      requestToken   : requestToken,
      refreshToken   : refreshToken,
      getUserInfo    : getUserInfo
    };



    function formPost( url, data, headers ) {
      headers = _.assignIn( ( headers || {} ), { "Content-Type" : "application/x-www-form-urlencoded" } );
      return iscHttpapi.post( url, $httpParamSerializerJQLike( data ), { "headers" : headers } );
    }

    var basicAuthHeader = "basic " + $window.btoa( iscOauthService.get( "clientId" ) + ":" + iscOauthService.get( "clientSecret" ) );

    function formatAndSaveToken( token ) {
      var formattedToken = _.mapKeys( token, function( value, key ) {
        return _.camelCase( key );
      } );
      $http.defaults.headers.common.AUTHORIZATION = "BEARER " + formattedToken.accessToken;
      iscOauthService.saveOauthConfig( formattedToken );
      return formattedToken;
    }

    function authorize(  ) {
      $window.location.href = iscOauthService.getAuthorizationUrl();
    }

    function requestToken( code ) {

      return formPost( iscOauthService.getRequestTokenUrl(), {
            "grant_type"  : "authorization_code",
            "code"        : code,
            "redirect_uri": iscOauthService.get( "redirectUrl" )
          }, {
            "AUTHORIZATION": basicAuthHeader
          } ).then( formatAndSaveToken );

    }

    function refreshToken() {
      return formPost( iscOauthService.getRequestTokenUrl(),
        {
          "grant_type"   : "refresh_token",
          "refresh_token": iscOauthService.get( "refreshToken" )
        },
        {
          "AUTHORIZATION": basicAuthHeader
        } ).then( formatAndSaveToken );
    }


    function revoke(  ) {
      return formPost( iscOauthService.getRevocationUrl(),
        {
          "token"     : iscOauthService.get( "accessToken" ),
          "client_id" : iscOauthService.get( "clientId" ),
          "token_type": "revoke"
        }, {} ).then( function( response ) {
          $http.defaults.headers.common.AUTHORIZATION = '';
          iscOauthService.clearOauthConfig();
          return response;
        } );
    }

    function introspect( ) {
      return formPost( iscOauthService.getIntrospectionUrl(),
        {
          "token": encodeURIComponent( iscOauthService.get( "accessToken" ) )
        },
        {
          "AUTHORIZATION": basicAuthHeader
        } );
    }

    function getUserInfo( ) {
      return formPost( iscOauthService.getUserInfoUrl(),
        {
          "access_token": encodeURIComponent( iscOauthService.get( "accessToken" ) )
        },
        {} );
    }

    return api;


  }


} )();

